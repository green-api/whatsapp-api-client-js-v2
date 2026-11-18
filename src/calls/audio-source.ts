import { spawn } from "child_process";
import { promises as fs } from "fs";
import { Readable } from "stream";
import { CallAudioSource, CallPlayOptions } from "../types";
import { CallError } from "./call-errors";
import {
	CALL_AUDIO_ERROR_DETAILS,
	CALL_AUDIO_FFMPEG_INPUT_ARGS,
	CALL_AUDIO_FFMPEG_OUTPUT_ARGS,
	CALL_AUDIO_FFMPEG_PATH,
	CALL_AUDIO_FFMPEG_STDIN,
	CALL_AUDIO_FFMPEG_STDOUT,
	CALL_AUDIO_MAX_SOURCE_BYTES,
	CALL_AUDIO_URL_PATTERN,
} from "./defaults";
import { OggOpusReader, OpusPacket, invalidAudio, looksLikeOggOpus, parseOggOpus } from "./ogg-opus";

export interface CallAudio {
	packets: AsyncIterable<OpusPacket>;
	stop(): void;
}

function tooLarge(): CallError {
	return invalidAudio(`${CALL_AUDIO_ERROR_DETAILS.tooLarge} ${CALL_AUDIO_MAX_SOURCE_BYTES / 1024 / 1024} MB`);
}

async function download(url: string): Promise<Buffer> {
	let response: Response;
	try {
		response = await fetch(url);
	} catch (error) {
		throw invalidAudio(`${CALL_AUDIO_ERROR_DETAILS.download}: ${error instanceof Error ? error.message : String(error)}`);
	}
	if (!response.ok) {
		throw invalidAudio(`${CALL_AUDIO_ERROR_DETAILS.download}: HTTP ${response.status}`);
	}
	if (Number(response.headers.get("content-length") ?? 0) > CALL_AUDIO_MAX_SOURCE_BYTES) {
		throw tooLarge();
	}
	return collect(Readable.fromWeb(response.body as Parameters<typeof Readable.fromWeb>[0]));
}

async function collect(stream: Readable): Promise<Buffer> {
	const chunks: Buffer[] = [];
	let size = 0;
	for await (const chunk of stream) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += buffer.length;
		if (size > CALL_AUDIO_MAX_SOURCE_BYTES) {
			stream.destroy();
			throw tooLarge();
		}
		chunks.push(buffer);
	}
	return Buffer.concat(chunks);
}

async function readSource(source: CallAudioSource): Promise<Buffer> {
	if (Buffer.isBuffer(source)) {
		return source;
	}
	if (typeof source !== "string") {
		return collect(source);
	}
	if (CALL_AUDIO_URL_PATTERN.test(source)) {
		return download(source);
	}
	let data: Buffer;
	try {
		if ((await fs.stat(source)).size > CALL_AUDIO_MAX_SOURCE_BYTES) {
			throw tooLarge();
		}
		data = await fs.readFile(source);
	} catch (error) {
		throw error instanceof CallError ? error : invalidAudio((error as Error).message);
	}
	return data;
}

function directPackets(data: Buffer): OpusPacket[] | undefined {
	if (!looksLikeOggOpus(data)) {
		return undefined;
	}
	try {
		const packets = parseOggOpus(data);
		return packets.some((packet) => packet.silk) ? undefined : packets;
	} catch {
		return undefined;
	}
}

async function* fromArray(packets: OpusPacket[]): AsyncGenerator<OpusPacket> {
	yield* packets;
}

function transcode(data: Buffer, ffmpegPath: string): CallAudio {
	let stopped = false;
	let kill: () => void = () => undefined;

	async function* packets(): AsyncGenerator<OpusPacket> {
		const ffmpeg = spawn(ffmpegPath, [
			...CALL_AUDIO_FFMPEG_INPUT_ARGS,
			"-i", CALL_AUDIO_FFMPEG_STDIN,
			...CALL_AUDIO_FFMPEG_OUTPUT_ARGS,
			CALL_AUDIO_FFMPEG_STDOUT,
		], {stdio: ["pipe", "pipe", "pipe"]});
		kill = () => {
			ffmpeg.kill();
		};
		if (stopped) {
			kill();
		}
		const exited = new Promise<number | null>((resolve, reject) => {
			ffmpeg.once("error", reject);
			ffmpeg.once("close", resolve);
		});
		exited.catch(() => undefined);
		let stderr = "";
		ffmpeg.stderr.on("data", (chunk) => {
			stderr += chunk;
		});
		ffmpeg.stdin.on("error", () => undefined);
		ffmpeg.stdin.end(data);

		const reader = new OggOpusReader();
		let finished = false;
		try {
			for await (const chunk of ffmpeg.stdout) {
				for (const packet of reader.push(chunk)) {
					yield packet;
				}
			}
			let code: number | null;
			try {
				code = await exited;
			} catch (error) {
				throw (error as NodeJS.ErrnoException).code === "ENOENT"
					? new CallError("FFMPEG_NOT_FOUND")
					: invalidAudio(`${CALL_AUDIO_ERROR_DETAILS.ffmpeg}: ${(error as Error).message}`);
			}
			finished = true;
			if (stopped) {
				return;
			}
			if (code !== 0) {
				throw invalidAudio(`${CALL_AUDIO_ERROR_DETAILS.ffmpeg}: ${stderr.trim() || `exit code ${code}`}`);
			}
			reader.end();
		} finally {
			if (!finished) {
				kill();
			}
		}
	}

	return {
		packets: packets(),
		stop: () => {
			stopped = true;
			kill();
		},
	};
}

export async function openCallAudio(source: CallAudioSource, options: CallPlayOptions = {}): Promise<CallAudio> {
	const data = await readSource(source);
	if (data.length === 0) {
		throw invalidAudio(CALL_AUDIO_ERROR_DETAILS.empty);
	}
	const packets = directPackets(data);
	if (packets) {
		return {packets: fromArray(packets), stop: () => undefined};
	}
	return transcode(data, options.ffmpegPath ?? CALL_AUDIO_FFMPEG_PATH);
}
