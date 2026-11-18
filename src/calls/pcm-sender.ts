import { setTimeout as sleep } from "timers/promises";
import { CallPcmSampleRate } from "../types";
import { AudioBridge } from "./audio-bridge";
import { CallError, toCallError } from "./call-errors";
import { CALL_AUDIO_MAX_SEND_LAG_MS, CALL_PCM_BYTES_PER_SAMPLE, CALL_PCM_FRAME_MS, CALL_PCM_FRAMES_PER_SECOND } from "./defaults";
import { OpusPcmEncoder } from "./opus-codec";

export class PcmSender {
	private readonly frameSamples: number;
	private readonly frameBytes: number;
	private chunks: Buffer[] = [];
	private queuedBytes = 0;
	private encoder?: OpusPcmEncoder;
	private running = false;
	private closed = false;
	private wake?: () => void;
	private drainWaiters: Array<() => void> = [];

	constructor(
		private readonly bridge: AudioBridge,
		private readonly sampleRate: CallPcmSampleRate,
		private readonly waitReady: () => Promise<void>,
		private readonly onError: (error: CallError) => void,
	) {
		this.frameSamples = sampleRate / CALL_PCM_FRAMES_PER_SECOND;
		this.frameBytes = this.frameSamples * CALL_PCM_BYTES_PER_SAMPLE;
	}

	get pendingMs(): number {
		return Math.round(this.queuedBytes / CALL_PCM_BYTES_PER_SAMPLE / this.sampleRate * 1000);
	}

	write(chunk: Buffer): void {
		if (this.closed) {
			return;
		}
		this.encoder ??= new OpusPcmEncoder(this.sampleRate);
		if (chunk.length === 0) {
			return;
		}
		this.chunks.push(chunk);
		this.queuedBytes += chunk.length;
		this.wake?.();
		if (!this.running) {
			this.running = true;
			void this.run();
		}
	}

	clear(): void {
		this.chunks = [];
		this.queuedBytes = 0;
		this.resolveDrained();
	}

	drain(): Promise<void> {
		if (this.queuedBytes === 0 || this.closed) {
			return Promise.resolve();
		}
		return new Promise((resolve) => this.drainWaiters.push(resolve));
	}

	close(): void {
		this.closed = true;
		this.clear();
		this.wake?.();
		this.encoder?.close();
		this.encoder = undefined;
	}

	private async run(): Promise<void> {
		try {
			await this.waitReady();
		} catch (error) {
			this.running = false;
			this.clear();
			if (!this.closed) {
				this.onError(toCallError(error));
			}
			return;
		}

		let startedAt = 0;
		let frameIndex = 0;
		let restart = true;
		while (!this.closed) {
			if (this.queuedBytes === 0) {
				this.resolveDrained();
				await this.waitForData();
				restart = true;
				continue;
			}
			if (this.queuedBytes < this.frameBytes && await this.waitForData(CALL_PCM_FRAME_MS)) {
				continue;
			}
			if (this.closed || !this.encoder) {
				break;
			}
			const frame = this.take();
			if (restart || startedAt + frameIndex * CALL_PCM_FRAME_MS < performance.now() - CALL_AUDIO_MAX_SEND_LAG_MS) {
				startedAt = performance.now();
				frameIndex = 0;
				restart = false;
			}
			const dueAt = startedAt + frameIndex * CALL_PCM_FRAME_MS;
			const waitMs = dueAt - performance.now();
			if (waitMs > 0) {
				await sleep(waitMs);
			}
			if (this.closed || !this.encoder) {
				break;
			}
			this.bridge.sendOpus(this.encoder.encode(frame, this.frameSamples), dueAt, frameIndex === 0);
			frameIndex++;
		}
		this.running = false;
	}

	private take(): Buffer {
		const frame = Buffer.alloc(this.frameBytes);
		let filled = 0;
		while (filled < this.frameBytes && this.chunks.length > 0) {
			const chunk = this.chunks[0];
			const size = Math.min(chunk.length, this.frameBytes - filled);
			chunk.copy(frame, filled, 0, size);
			filled += size;
			if (size === chunk.length) {
				this.chunks.shift();
			} else {
				this.chunks[0] = chunk.subarray(size);
			}
		}
		this.queuedBytes -= filled;
		return frame;
	}

	private waitForData(timeoutMs?: number): Promise<boolean> {
		return new Promise((resolve) => {
			const timer = timeoutMs === undefined ? undefined : setTimeout(() => {
				this.wake = undefined;
				resolve(false);
			}, timeoutMs);
			this.wake = () => {
				clearTimeout(timer);
				this.wake = undefined;
				resolve(true);
			};
		});
	}

	private resolveDrained(): void {
		const waiters = this.drainWaiters;
		this.drainWaiters = [];
		waiters.forEach((resolve) => resolve());
	}
}
