import type OpusScript from "opusscript";
import { CallPcmSampleRate } from "../types";
import {
	CALL_AUDIO_CLOCK_RATE_PER_MS,
	CALL_AUDIO_OPUS_CODEC,
	CALL_AUDIO_TIMESTAMP_RANGE,
	CALL_PCM_BITRATE,
	CALL_PCM_BYTES_PER_SAMPLE,
	CALL_PCM_MAX_GAP_FILL_MS,
	CALL_SEQUENCE_HALF_RANGE,
} from "./defaults";
import { loadOpusScript } from "./optional-dependencies";

export class OpusPcmEncoder {
	private readonly encoder: OpusScript;

	constructor(sampleRate: CallPcmSampleRate) {
		const OpusScriptClass = loadOpusScript();
		this.encoder = new OpusScriptClass(sampleRate, 1, OpusScriptClass.Application.RESTRICTED_LOWDELAY);
		this.encoder.setBitrate(CALL_PCM_BITRATE);
	}

	encode(pcm: Buffer, frameSamples: number): Buffer {
		return Buffer.from(this.encoder.encode(pcm, frameSamples));
	}

	close(): void {
		this.encoder.delete();
	}
}

export class OpusPcmDecoder {
	private readonly decoder: OpusScript;
	private readonly clockPerSample: number;
	private lastSequenceNumber?: number;
	private expectedTimestamp?: number;

	constructor(sampleRate: CallPcmSampleRate) {
		const OpusScriptClass = loadOpusScript();
		this.decoder = new OpusScriptClass(sampleRate, 1, OpusScriptClass.Application.RESTRICTED_LOWDELAY);
		this.clockPerSample = CALL_AUDIO_OPUS_CODEC.clockRate / sampleRate;
	}

	decode(payload: Buffer, sequenceNumber: number, timestamp: number): Buffer | undefined {
		if (payload.length === 0) {
			return undefined;
		}
		if (this.lastSequenceNumber !== undefined) {
			const ahead = (sequenceNumber - this.lastSequenceNumber + 2 * CALL_SEQUENCE_HALF_RANGE) % (2 * CALL_SEQUENCE_HALF_RANGE);
			if (ahead === 0 || ahead >= CALL_SEQUENCE_HALF_RANGE) {
				return undefined;
			}
		}
		this.lastSequenceNumber = sequenceNumber;
		let pcm: Buffer;
		try {
			pcm = Buffer.from(this.decoder.decode(payload));
		} catch {
			return undefined;
		}
		const silence = this.silenceBefore(timestamp);
		const samples = pcm.length / CALL_PCM_BYTES_PER_SAMPLE;
		this.expectedTimestamp = (timestamp + Math.round(samples * this.clockPerSample)) % CALL_AUDIO_TIMESTAMP_RANGE;
		return silence > 0 ? Buffer.concat([Buffer.alloc(silence * CALL_PCM_BYTES_PER_SAMPLE), pcm]) : pcm;
	}

	private silenceBefore(timestamp: number): number {
		if (this.expectedTimestamp === undefined) {
			return 0;
		}
		const gap = (timestamp - this.expectedTimestamp + CALL_AUDIO_TIMESTAMP_RANGE) % CALL_AUDIO_TIMESTAMP_RANGE;
		if (gap === 0 || gap > CALL_PCM_MAX_GAP_FILL_MS * CALL_AUDIO_CLOCK_RATE_PER_MS) {
			return 0;
		}
		return Math.round(gap / this.clockPerSample);
	}

	close(): void {
		this.decoder.delete();
	}
}
