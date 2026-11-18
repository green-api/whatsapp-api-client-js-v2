import { setTimeout as sleep } from "timers/promises";
import type * as Werift from "werift";
import { CallRemoteAudio, CallsRtcClientFrame, CallsRtcIceCandidate, IceServer } from "../types";
import { CallError } from "./call-errors";
import {
	CALL_AUDIO_CLOCK_RATE_PER_MS,
	CALL_AUDIO_ERROR_DETAILS,
	CALL_AUDIO_GATHER_WAIT_MS,
	CALL_AUDIO_OPUS_CODEC,
	CALL_AUDIO_SEQUENCE_RANGE,
	CALL_AUDIO_TIMESTAMP_RANGE,
	CALL_ERROR_MESSAGES,
} from "./defaults";
import { loadWerift } from "./optional-dependencies";

function audioFailed(detail: string): CallError {
	return new CallError("AUDIO_FAILED", {message: `${CALL_ERROR_MESSAGES.AUDIO_FAILED}: ${detail}`});
}

function settled<T>(): {promise: Promise<T>; resolve: (value: T) => void; reject: (error: Error) => void} {
	let resolve!: (value: T) => void;
	let reject!: (error: Error) => void;
	const promise = new Promise<T>((onResolve, onReject) => {
		resolve = onResolve;
		reject = onReject;
	});
	promise.catch(() => undefined);
	return {promise, resolve, reject};
}

export class AudioBridge {
	private readonly werift = loadWerift();
	private readonly peer: Werift.RTCPeerConnection;
	private readonly track: Werift.MediaStreamTrack;
	private readonly connectedState = settled<void>();
	private readonly remoteAudioState = settled<void>();
	private readonly clockStart = performance.now();
	private sequenceNumber = Math.floor(Math.random() * CALL_AUDIO_SEQUENCE_RANGE);
	private readonly timestampBase = Math.floor(Math.random() * CALL_AUDIO_TIMESTAMP_RANGE);
	private remoteDescriptionSet = false;
	private answered = false;
	private offerSent = false;
	private closed = false;
	private pendingCandidates: CallsRtcIceCandidate[] = [];
	private earlyCandidates: CallsRtcIceCandidate[] = [];

	constructor(
		iceServers: IceServer[],
		private readonly send: (frame: CallsRtcClientFrame) => boolean,
		onAudio: (audio: CallRemoteAudio) => void,
		onFailed: (error: CallError) => void,
	) {
		this.peer = new this.werift.RTCPeerConnection({
			iceServers,
			codecs: {audio: [new this.werift.RTCRtpCodecParameters({...CALL_AUDIO_OPUS_CODEC})]},
		});
		this.track = new this.werift.MediaStreamTrack({kind: "audio"});
		const transceiver = this.peer.addTransceiver(this.track, {direction: "sendrecv"});
		transceiver.onTrack.subscribe((remote) => {
			remote.onReceiveRtp.subscribe((rtp) => {
				this.remoteAudioState.resolve();
				onAudio({payload: rtp.payload, sequenceNumber: rtp.header.sequenceNumber, timestamp: rtp.header.timestamp});
			});
		});
		this.peer.onIceCandidate.subscribe((candidate) => {
			if (!candidate || this.closed) {
				return;
			}
			if (this.offerSent) {
				this.send({type: "ice-candidate", candidate: candidate.toJSON()});
			} else {
				this.earlyCandidates.push(candidate.toJSON());
			}
		});
		this.peer.connectionStateChange.subscribe((state) => {
			if (state === "connected") {
				this.connectedState.resolve();
			} else if (state === "failed" && !this.closed) {
				const error = audioFailed(CALL_AUDIO_ERROR_DETAILS.connectionFailed);
				this.connectedState.reject(error);
				onFailed(error);
			}
		});
	}

	get connected(): Promise<void> {
		return this.connectedState.promise;
	}

	get remoteAudio(): Promise<void> {
		return this.remoteAudioState.promise;
	}

	get isAnswered(): boolean {
		return this.answered;
	}

	async start(): Promise<void> {
		const offer = await this.peer.createOffer();
		let localError: unknown;
		const localSet = this.peer.setLocalDescription(offer).then(() => undefined, (error) => {
			localError = error;
		});
		await Promise.race([localSet, sleep(CALL_AUDIO_GATHER_WAIT_MS)]);
		if (localError) {
			throw localError;
		}
		if (this.closed) {
			return;
		}
		const sdp = this.peer.localDescription?.sdp ?? offer.sdp;
		this.send({type: "offer", offer: {type: "offer", sdp}});
		this.offerSent = true;
		const offered = new Set(sdp.split(/\r?\n/).filter((line) => line.startsWith("a=candidate:")).map((line) => line.slice(2)));
		const early = this.earlyCandidates;
		this.earlyCandidates = [];
		early.filter((candidate) => !offered.has(candidate.candidate)).forEach((candidate) => this.send({type: "ice-candidate", candidate}));
	}

	async setAnswer(sdp: string): Promise<boolean> {
		if (this.answered || this.closed) {
			return false;
		}
		this.answered = true;
		await this.peer.setRemoteDescription({type: "answer", sdp});
		this.remoteDescriptionSet = true;
		const candidates = this.pendingCandidates;
		this.pendingCandidates = [];
		for (const candidate of candidates) {
			await this.peer.addIceCandidate(candidate);
		}
		return true;
	}

	async addCandidate(candidate: CallsRtcIceCandidate): Promise<void> {
		if (this.closed) {
			return;
		}
		if (!this.remoteDescriptionSet) {
			this.pendingCandidates.push(candidate);
			return;
		}
		await this.peer.addIceCandidate(candidate);
	}

	sendOpus(payload: Buffer, atMs: number, marker: boolean): void {
		if (this.closed) {
			return;
		}
		const elapsed = Math.round((atMs - this.clockStart) * CALL_AUDIO_CLOCK_RATE_PER_MS);
		const header = new this.werift.RtpHeader({
			sequenceNumber: this.sequenceNumber,
			timestamp: (this.timestampBase + elapsed) % CALL_AUDIO_TIMESTAMP_RANGE,
			marker,
		});
		this.sequenceNumber = (this.sequenceNumber + 1) % CALL_AUDIO_SEQUENCE_RANGE;
		this.track.writeRtp(new this.werift.RtpPacket(header, payload));
	}

	close(): void {
		if (this.closed) {
			return;
		}
		this.closed = true;
		const error = audioFailed(CALL_AUDIO_ERROR_DETAILS.audioStopped);
		this.connectedState.reject(error);
		this.remoteAudioState.reject(error);
		void this.peer.close().catch(() => undefined);
	}
}
