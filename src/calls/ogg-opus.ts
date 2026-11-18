import { CallError } from "./call-errors";
import {
	CALL_AUDIO_ERROR_DETAILS,
	CALL_ERROR_MESSAGES,
	OGG_CAPTURE_PATTERN,
	OGG_LACING_CONTINUES,
	OGG_PAGE_HEADER_SIZE,
	OPUS_CELT_FRAME_MS,
	OPUS_FIRST_CELT_CONFIG,
	OPUS_FIRST_HYBRID_CONFIG,
	OPUS_FRAME_CODE_MASK,
	OPUS_FRAME_COUNT_MASK,
	OPUS_HEAD_MAGIC,
	OPUS_HYBRID_FRAME_MS,
	OPUS_SILK_FRAME_MS,
	OPUS_TAGS_MAGIC,
} from "./defaults";

export interface OpusPacket {
	data: Buffer;
	durationMs: number;
	silk: boolean;
}

export function invalidAudio(detail: string): CallError {
	return new CallError("INVALID_AUDIO", {message: `${CALL_ERROR_MESSAGES.INVALID_AUDIO}: ${detail}`});
}

function opusConfig(packet: Buffer): number {
	return packet[0] >> 3;
}

function opusFrameMs(config: number): number {
	if (config < OPUS_FIRST_HYBRID_CONFIG) {
		return OPUS_SILK_FRAME_MS[config % OPUS_SILK_FRAME_MS.length];
	}
	if (config < OPUS_FIRST_CELT_CONFIG) {
		return OPUS_HYBRID_FRAME_MS[config % OPUS_HYBRID_FRAME_MS.length];
	}
	return OPUS_CELT_FRAME_MS[config % OPUS_CELT_FRAME_MS.length];
}

export function opusPacketDurationMs(packet: Buffer): number {
	const frameMs = opusFrameMs(opusConfig(packet));
	switch (packet[0] & OPUS_FRAME_CODE_MASK) {
		case 0:
			return frameMs;
		case 1:
		case 2:
			return 2 * frameMs;
		default: {
			const count = packet.length > 1 ? packet[1] & OPUS_FRAME_COUNT_MASK : 0;
			if (count === 0) {
				throw invalidAudio(CALL_AUDIO_ERROR_DETAILS.badPacket);
			}
			return count * frameMs;
		}
	}
}

export function looksLikeOggOpus(data: Buffer): boolean {
	if (data.length <= OGG_PAGE_HEADER_SIZE || data.toString("latin1", 0, OGG_CAPTURE_PATTERN.length) !== OGG_CAPTURE_PATTERN) {
		return false;
	}
	const bodyStart = OGG_PAGE_HEADER_SIZE + data[OGG_PAGE_HEADER_SIZE - 1];
	return data.toString("latin1", bodyStart, bodyStart + OPUS_HEAD_MAGIC.length) === OPUS_HEAD_MAGIC;
}

export class OggOpusReader {
	private pending: Buffer = Buffer.alloc(0);
	private partial: Buffer[] = [];
	private packetIndex = 0;

	push(chunk: Buffer): OpusPacket[] {
		this.pending = this.pending.length > 0 ? Buffer.concat([this.pending, chunk]) : chunk;
		const packets: OpusPacket[] = [];
		while (this.pending.length >= OGG_PAGE_HEADER_SIZE) {
			if (this.pending.toString("latin1", 0, OGG_CAPTURE_PATTERN.length) !== OGG_CAPTURE_PATTERN) {
				throw invalidAudio(CALL_AUDIO_ERROR_DETAILS.notOgg);
			}
			const headerEnd = OGG_PAGE_HEADER_SIZE + this.pending[OGG_PAGE_HEADER_SIZE - 1];
			if (this.pending.length < headerEnd) {
				break;
			}
			const lacing = this.pending.subarray(OGG_PAGE_HEADER_SIZE, headerEnd);
			const pageEnd = headerEnd + lacing.reduce((sum, length) => sum + length, 0);
			if (this.pending.length < pageEnd) {
				break;
			}
			let offset = headerEnd;
			for (const length of lacing) {
				this.partial.push(this.pending.subarray(offset, offset + length));
				offset += length;
				if (length < OGG_LACING_CONTINUES) {
					const packet = this.take(Buffer.concat(this.partial));
					this.partial = [];
					if (packet) {
						packets.push(packet);
					}
				}
			}
			this.pending = this.pending.subarray(pageEnd);
		}
		return packets;
	}

	end(): void {
		if (this.packetIndex < 2) {
			throw invalidAudio(CALL_AUDIO_ERROR_DETAILS.notOpus);
		}
	}

	private take(packet: Buffer): OpusPacket | undefined {
		const index = this.packetIndex++;
		if (index === 0 || index === 1) {
			const magic = index === 0 ? OPUS_HEAD_MAGIC : OPUS_TAGS_MAGIC;
			if (packet.toString("latin1", 0, magic.length) !== magic) {
				throw invalidAudio(CALL_AUDIO_ERROR_DETAILS.notOpus);
			}
			return undefined;
		}
		if (packet.length === 0) {
			return undefined;
		}
		return {
			data: packet,
			durationMs: opusPacketDurationMs(packet),
			silk: opusConfig(packet) < OPUS_FIRST_HYBRID_CONFIG,
		};
	}
}

export function parseOggOpus(data: Buffer): OpusPacket[] {
	const reader = new OggOpusReader();
	const packets = reader.push(data);
	reader.end();
	if (packets.length === 0) {
		throw invalidAudio(CALL_AUDIO_ERROR_DETAILS.empty);
	}
	return packets;
}
