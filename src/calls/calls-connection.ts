import { EventEmitter } from "events";
import { setTimeout as sleep } from "timers/promises";
import type { GreenApiClient } from "../client/green-api-client";
import { GreenApiLogger } from "../utils/logger";
import {
	CallAudioSource,
	CallEndDetail,
	CallPcmSampleRate,
	CallPlayOptions,
	CallRemoteAudio,
	CallsConnectionEvents,
	CallsConnectionOptions,
	CallsDisconnectDetail,
	CallsRtcIceCandidate,
	CallsRtcServerFrame,
	CallState,
	CallStateKind,
} from "../types";
import { AudioBridge } from "./audio-bridge";
import { openCallAudio } from "./audio-source";
import { CallError, toCallError } from "./call-errors";
import { describeCallEndReason, isActiveCallState } from "./call-states";
import { CallsSocket } from "./calls-socket";
import {
	CALL_AUDIO_CONNECT_TIMEOUT_MS,
	CALL_AUDIO_ERROR_DETAILS,
	CALL_AUDIO_MAX_SEND_LAG_MS,
	CALL_AUDIO_REMOTE_WAIT_MS,
	CALL_CONNECTION_LOST_DESCRIPTION,
	CALL_ENDED_DESCRIPTION,
	CALL_ERROR_MESSAGES,
	CALL_PCM_DEFAULT_SAMPLE_RATE,
	CALL_PCM_SAMPLE_RATES,
} from "./defaults";
import { invalidAudio } from "./ogg-opus";
import { OpusPcmDecoder } from "./opus-codec";
import { PcmSender } from "./pcm-sender";

type Deferred<T> = {resolve: (value: T) => void; reject: (error: Error) => void};

/**
 * Live connection to the calls of an instance (the callsRtc WebSocket) and the audio of the current call.
 * Create it with GreenApiClient.connectCalls(). Control the call with the client's calls methods.
 *
 * Events: "connect", "disconnect", "state", "incoming-call", "end-call", "remote-audio", "remote-pcm" and "error".
 * "remote-pcm" keeps real time: silent gaps and lost packets arrive as silence with the next audio.
 * Audio needs the optional dependencies werift and ws: npm install werift@^0.25.2 ws
 * Live PCM audio (sendPcm, remote-pcm) also needs the Opus codec: npm install opusscript
 *
 * @example
 * ```typescript
 * const calls = client.connectCalls();
 * await calls.open();
 * await client.callsDial({chatId: "79001234567@c.us"});
 * await calls.startAudioBridge();
 * await calls.waitFor("on-call");
 * await calls.play("./hello.ogg");
 * await client.callsHangUp();
 * calls.close();
 * ```
 */
export class CallsConnection extends EventEmitter<CallsConnectionEvents> {
	private readonly logger = GreenApiLogger.getInstance(CallsConnection.name);
	private readonly socket: CallsSocket;
	private readonly pcmSampleRate: CallPcmSampleRate;
	private currentState: CallState | null = null;
	private bridge?: AudioBridge;
	private pendingBridge?: Deferred<void>;
	private firstState?: Deferred<CallState>;
	private player?: {stopped: boolean; stop: () => void};
	private pcmSender?: PcmSender;
	private pcmDecoder?: OpusPcmDecoder;
	private pcmDecodeFailed = false;
	private resumePending = false;
	private refusalReported = false;
	private closed = false;

	/**
	 * Creates the connection. Use GreenApiClient.connectCalls() instead.
	 *
	 * @param client - GREEN-API client of the instance
	 * @param url - The callsRtc WebSocket URL
	 * @param options - Sample rate of the live PCM audio
	 * @throws {CallError} INVALID_AUDIO if pcmSampleRate is not supported
	 */
	constructor(private readonly client: Pick<GreenApiClient, "callsGetIceServers">, url: string, options: CallsConnectionOptions = {}) {
		super();
		const sampleRate = options.pcmSampleRate ?? CALL_PCM_DEFAULT_SAMPLE_RATE;
		if (!(CALL_PCM_SAMPLE_RATES as readonly number[]).includes(sampleRate)) {
			throw invalidAudio(CALL_AUDIO_ERROR_DETAILS.sampleRate);
		}
		this.pcmSampleRate = sampleRate as CallPcmSampleRate;
		this.socket = new CallsSocket(url);
		this.socket.on("connect", () => this.emit("connect"));
		this.socket.on("disconnect", (detail: CallsDisconnectDetail) => this.onSocketDisconnect(detail));
		this.socket.on("frame", (frame: CallsRtcServerFrame) => void this.onFrame(frame));
	}

	/**
	 * The latest call state of the instance, null before the first state arrives or after the connection is lost.
	 */
	get state(): CallState | null {
		return this.currentState;
	}

	/**
	 * Whether the audio of a call is connected or connecting now.
	 */
	get hasAudioBridge(): boolean {
		return this.bridge !== undefined;
	}

	/**
	 * How much live PCM audio from sendPcm is queued and not yet sent, in milliseconds.
	 */
	get pendingAudioMs(): number {
		return this.pcmSender?.pendingMs ?? 0;
	}

	/**
	 * Opens the connection. Reconnects on its own after network drops until close() is called.
	 *
	 * @returns Promise resolving to the current call state
	 * @throws {CallError} INVALID_CREDENTIALS, NOT_IN_TARIFF, CALLS_NOT_ENABLED or CONNECTION_FAILED
	 */
	async open(): Promise<CallState> {
		if (this.closed) {
			throw new CallError("CONNECTION_FAILED", {message: "The calls connection is closed, create a new one with connectCalls()"});
		}
		const first = new Promise<CallState>((resolve, reject) => {
			this.firstState = {resolve, reject};
		});
		first.catch(() => undefined);
		try {
			await this.socket.open();
		} catch (error) {
			this.firstState = undefined;
			throw toCallError(error);
		}
		return first;
	}

	/**
	 * Connects the audio of the current call. Call it after callsDial or callsAccept has resolved.
	 *
	 * @returns Promise that resolves when GREEN-API has answered the audio offer
	 * @throws {CallError} If there is no call, the call ends first, or the audio cannot start
	 */
	startAudioBridge(): Promise<void> {
		if (this.closed) {
			return Promise.reject(new CallError("CONNECTION_FAILED", {message: "The calls connection is closed"}));
		}
		if (this.bridge || this.pendingBridge) {
			return Promise.reject(new CallError("AUDIO_BUSY"));
		}
		return new Promise<void>((resolve, reject) => {
			const pending = {resolve, reject};
			this.pendingBridge = pending;
			this.createBridge(pending).catch((error) => {
				if (this.pendingBridge !== pending) {
					return;
				}
				this.pendingBridge = undefined;
				this.teardownBridge(false);
				reject(toCallError(error));
			});
		});
	}

	/**
	 * Disconnects the audio of the call. The call itself goes on, end it with callsHangUp.
	 */
	stopAudioBridge(): void {
		this.resumePending = false;
		this.rejectPendingBridge(CALL_AUDIO_ERROR_DETAILS.audioStopped);
		this.teardownBridge(true);
	}

	/**
	 * Plays audio into the call. Waits until the audio is connected and the other side is heard, then plays in real time.
	 * Ogg Opus files play as they are. Other formats, and Ogg files with SILK frames that WhatsApp calls do not play, go through ffmpeg.
	 * The whole source is read before it plays, for live audio use sendPcm. A new play stops the previous one and drops queued live audio.
	 *
	 * @param source - Path or http(s) URL of an audio file, a Buffer, or a readable stream
	 * @param options - Path to ffmpeg
	 * @returns Promise that resolves when the audio has been played, stopped, or the call ended
	 * @throws {CallError} AUDIO_NOT_STARTED, AUDIO_FAILED, INVALID_AUDIO or FFMPEG_NOT_FOUND
	 */
	async play(source: CallAudioSource, options: CallPlayOptions = {}): Promise<void> {
		const bridge = this.bridge;
		if (!bridge) {
			throw new CallError("AUDIO_NOT_STARTED");
		}
		this.stopPlaying();
		this.pcmSender?.clear();
		const player = {stopped: false, stop: () => {
			player.stopped = true;
		}};
		this.player = player;
		const playing = () => !player.stopped && this.bridge === bridge;
		try {
			const audio = await openCallAudio(source, options);
			player.stop = () => {
				player.stopped = true;
				audio.stop();
			};
			if (player.stopped) {
				audio.stop();
				return;
			}
			await this.waitAudioReady(bridge);
			let startedAt: number | undefined;
			let offsetMs = 0;
			for await (const packet of audio.packets) {
				if (!playing()) {
					break;
				}
				startedAt ??= performance.now();
				if (startedAt + offsetMs < performance.now() - CALL_AUDIO_MAX_SEND_LAG_MS) {
					startedAt = performance.now() - offsetMs;
				}
				const dueAt = startedAt + offsetMs;
				const waitMs = dueAt - performance.now();
				if (waitMs > 0) {
					await sleep(waitMs);
				}
				if (!playing()) {
					break;
				}
				bridge.sendOpus(packet.data, dueAt, offsetMs === 0);
				offsetMs += packet.durationMs;
			}
		} catch (error) {
			if (playing()) {
				throw toCallError(error);
			}
		} finally {
			if (this.player === player) {
				this.player = undefined;
			}
		}
	}

	/**
	 * Stops the audio that is playing.
	 */
	stopPlaying(): void {
		this.player?.stop();
		this.player = undefined;
	}

	/**
	 * Sends live audio into the call: 16-bit little-endian mono PCM at pcmSampleRate (24000 by default).
	 * Chunks of any size are queued, encoded to Opus in 20 ms frames and sent in real time.
	 * The first audio waits until the audio is connected and the other side is heard. Stops a running play().
	 *
	 * @param pcm - PCM samples
	 * @throws {CallError} AUDIO_NOT_STARTED, or MISSING_OPUS_CODEC when opusscript is not installed
	 *
	 * @example
	 * ```typescript
	 * const calls = client.connectCalls({pcmSampleRate: 16000});
	 * calls.on("remote-pcm", (pcm) => calls.sendPcm(pcm));
	 * ```
	 */
	sendPcm(pcm: Buffer | Int16Array | Uint8Array): void {
		const bridge = this.bridge;
		if (!bridge) {
			throw new CallError("AUDIO_NOT_STARTED");
		}
		this.stopPlaying();
		this.pcmSender ??= new PcmSender(bridge, this.pcmSampleRate, () => this.waitAudioReady(bridge), (error) => this.emitError(error));
		this.pcmSender.write(Buffer.isBuffer(pcm) ? pcm : Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength));
	}

	/**
	 * Drops the live audio that is queued and stops play(), for example when the other side starts talking.
	 */
	clearAudio(): void {
		this.stopPlaying();
		this.pcmSender?.clear();
	}

	/**
	 * Waits until the queued live audio has been sent.
	 *
	 * @returns Promise that resolves when the queue is empty, cleared, or the audio stopped
	 */
	drainAudio(): Promise<void> {
		return this.pcmSender?.drain() ?? Promise.resolve();
	}

	/**
	 * Waits until the call reaches a state.
	 *
	 * @param state - The state to wait for
	 * @param timeoutMs - How long to wait, no limit by default
	 * @returns Promise resolving to the call state
	 * @throws {CallError} CALL_ENDED with the reason if the call ends first, TIMEOUT, or the connection error
	 */
	waitFor(state: CallStateKind, timeoutMs?: number): Promise<CallState> {
		if (this.currentState?.state === state) {
			return Promise.resolve(this.currentState);
		}
		return new Promise((resolve, reject) => {
			const timer = timeoutMs === undefined ? undefined : setTimeout(() => {
				cleanup();
				reject(new CallError("TIMEOUT", {message: `The call did not reach the ${state} state in time`}));
			}, timeoutMs);
			const onState = (next: CallState) => {
				if (next.state === state) {
					cleanup();
					resolve(next);
				}
			};
			const onEnd = (detail: CallEndDetail) => {
				if (state === "idle") {
					return;
				}
				cleanup();
				reject(new CallError("CALL_ENDED", {message: detail.description, serverMessage: detail.cause}));
			};
			const onDisconnect = (detail: CallsDisconnectDetail) => {
				if (detail.permanent) {
					cleanup();
					reject(detail.error ?? new CallError("CONNECTION_FAILED"));
				}
			};
			const cleanup = () => {
				clearTimeout(timer);
				this.off("state", onState);
				this.off("end-call", onEnd);
				this.off("disconnect", onDisconnect);
			};
			this.on("state", onState);
			this.on("end-call", onEnd);
			this.on("disconnect", onDisconnect);
		});
	}

	/**
	 * Disconnects the audio and closes the connection. The call itself is not ended.
	 */
	close(): void {
		if (this.closed) {
			return;
		}
		this.closed = true;
		this.resumePending = false;
		this.rejectPendingBridge(CALL_AUDIO_ERROR_DETAILS.audioStopped);
		this.teardownBridge(false);
		this.firstState?.reject(new CallError("CONNECTION_FAILED", {message: "The calls connection was closed"}));
		this.firstState = undefined;
		this.socket.close();
	}

	private async createBridge(pending: Deferred<void>): Promise<void> {
		const iceServers = await this.client.callsGetIceServers();
		if (this.pendingBridge !== pending) {
			return;
		}
		const bridge: AudioBridge = new AudioBridge(
			iceServers,
			(frame) => this.socket.send(frame),
			(audio) => this.onRemoteAudio(bridge, audio),
			(error) => this.onBridgeFailed(bridge, error),
		);
		this.bridge = bridge;
		await bridge.start();
	}

	private onRemoteAudio(bridge: AudioBridge, audio: CallRemoteAudio): void {
		if (this.bridge !== bridge) {
			return;
		}
		this.emit("remote-audio", audio);
		if (this.pcmDecodeFailed || this.listenerCount("remote-pcm") === 0) {
			return;
		}
		if (!this.pcmDecoder) {
			try {
				this.pcmDecoder = new OpusPcmDecoder(this.pcmSampleRate);
			} catch (error) {
				this.pcmDecodeFailed = true;
				this.emitError(toCallError(error));
				return;
			}
		}
		const pcm = this.pcmDecoder.decode(audio.payload, audio.sequenceNumber, audio.timestamp);
		if (pcm) {
			this.emit("remote-pcm", pcm);
		}
	}

	private async waitAudioReady(bridge: AudioBridge): Promise<void> {
		await this.waitConnected(bridge);
		await Promise.race([bridge.remoteAudio.catch(() => undefined), sleep(CALL_AUDIO_REMOTE_WAIT_MS)]);
	}

	private async waitConnected(bridge: AudioBridge): Promise<void> {
		let timer: NodeJS.Timeout | undefined;
		const timeout = new Promise<never>((_resolve, reject) => {
			timer = setTimeout(() => reject(new CallError("AUDIO_FAILED", {
				message: `${CALL_ERROR_MESSAGES.AUDIO_FAILED}: ${CALL_AUDIO_ERROR_DETAILS.notConnected}`,
			})), CALL_AUDIO_CONNECT_TIMEOUT_MS);
		});
		try {
			await Promise.race([bridge.connected, timeout]);
		} finally {
			clearTimeout(timer);
		}
	}

	private async onFrame(frame: CallsRtcServerFrame): Promise<void> {
		switch (frame.type) {
			case "state":
				this.onState(frame.state);
				return;
			case "answer":
				await this.onAnswer(frame.answer.sdp);
				return;
			case "ice-candidate":
				await this.onRemoteCandidate(frame.candidate);
				return;
			case "error":
				this.onServerError(frame.message);
				return;
		}
	}

	private onState(state: CallState): void {
		const previous = this.currentState?.state;
		this.currentState = state;
		this.firstState?.resolve(state);
		this.firstState = undefined;
		this.emit("state", state);

		if (state.state === "inc-call" && previous !== "inc-call" && state.info) {
			this.emit("incoming-call", state.info);
			return;
		}

		if (isActiveCallState(previous) && !isActiveCallState(state.state)) {
			this.resumePending = false;
			this.rejectPendingBridge(CALL_AUDIO_ERROR_DETAILS.callEnded, "CALL_ENDED");
			this.teardownBridge(true);
			this.emit("end-call", {
				reason: "call-ended",
				cause: state.reason,
				description: describeCallEndReason(state.reason) ?? CALL_ENDED_DESCRIPTION,
			});
			return;
		}

		if (this.resumePending && isActiveCallState(state.state) && !this.bridge && !this.pendingBridge) {
			this.resumePending = false;
			this.startAudioBridge().catch((error) => this.emitError(toCallError(error)));
		}
	}

	private async onAnswer(sdp: string): Promise<void> {
		const bridge = this.bridge;
		if (!bridge) {
			return;
		}
		try {
			if (!await bridge.setAnswer(sdp)) {
				return;
			}
		} catch (error) {
			if (this.bridge !== bridge) {
				return;
			}
			const callError = toCallError(error);
			const pending = this.pendingBridge;
			this.pendingBridge = undefined;
			this.teardownBridge(false);
			if (pending) {
				pending.reject(callError);
			} else {
				this.emitError(callError);
			}
			return;
		}
		const pending = this.pendingBridge;
		if (this.bridge === bridge && pending) {
			this.pendingBridge = undefined;
			pending.resolve();
		}
	}

	private async onRemoteCandidate(candidate: CallsRtcIceCandidate): Promise<void> {
		const bridge = this.bridge;
		if (!bridge) {
			return;
		}
		try {
			await bridge.addCandidate(candidate);
		} catch (error) {
			if (this.bridge !== bridge) {
				return;
			}
			this.rejectPendingBridge(CALL_AUDIO_ERROR_DETAILS.connectionFailed, "AUDIO_FAILED");
			this.teardownBridge(false);
			this.emitError(toCallError(error));
		}
	}

	private onServerError(message: string): void {
		const error = new CallError("CALL_FAILED", {message: `${CALL_ERROR_MESSAGES.CALL_FAILED}: ${message}`, serverMessage: message});
		const pending = this.pendingBridge;
		if (pending) {
			this.pendingBridge = undefined;
			this.teardownBridge(false);
			pending.reject(error);
			return;
		}
		this.refusalReported = true;
		this.emitError(error);
	}

	private onBridgeFailed(bridge: AudioBridge, error: CallError): void {
		if (this.bridge !== bridge) {
			return;
		}
		const pending = this.pendingBridge;
		this.pendingBridge = undefined;
		this.teardownBridge(false);
		if (pending) {
			pending.reject(error);
		} else {
			this.emitError(error);
		}
	}

	private onSocketDisconnect(detail: CallsDisconnectDetail): void {
		if (isActiveCallState(this.currentState?.state)) {
			this.resumePending = this.bridge !== undefined && !detail.permanent;
			this.rejectPendingBridge(CALL_AUDIO_ERROR_DETAILS.connectionLost, "CONNECTION_FAILED");
			this.teardownBridge(false);
			if (!this.resumePending) {
				this.currentState = null;
				this.emit("end-call", {reason: "connection-lost", description: CALL_CONNECTION_LOST_DESCRIPTION});
			}
		} else {
			this.currentState = null;
		}

		if (detail.permanent) {
			const opening = this.firstState !== undefined;
			this.firstState?.reject(detail.error ?? new CallError("CONNECTION_FAILED"));
			this.firstState = undefined;
			if (!opening && !this.refusalReported && detail.error) {
				this.emitError(detail.error);
			}
		}
		this.refusalReported = false;
		this.emit("disconnect", detail);
	}

	private rejectPendingBridge(detail: string, code: "AUDIO_FAILED" | "CALL_ENDED" | "CONNECTION_FAILED" = "AUDIO_FAILED"): void {
		const pending = this.pendingBridge;
		this.pendingBridge = undefined;
		pending?.reject(new CallError(code, {message: `${CALL_ERROR_MESSAGES.AUDIO_FAILED}: ${detail}`}));
	}

	private teardownBridge(notifyServer: boolean): void {
		this.stopPlaying();
		this.pcmSender?.close();
		this.pcmSender = undefined;
		this.pcmDecoder?.close();
		this.pcmDecoder = undefined;
		const bridge = this.bridge;
		this.bridge = undefined;
		if (!bridge) {
			return;
		}
		if (notifyServer) {
			this.socket.send({type: "stop"});
		}
		bridge.close();
	}

	private emitError(error: CallError): void {
		if (this.listenerCount("error") > 0) {
			this.emit("error", error);
			return;
		}
		this.logger.warn("Calls connection error", {code: error.code, message: error.message});
	}
}
