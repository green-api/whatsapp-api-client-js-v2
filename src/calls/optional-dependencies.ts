import type OpusScript from "opusscript";
import type * as Werift from "werift";
import type WebSocket from "ws";
import { CallErrorCode } from "../types";
import { CallError } from "./call-errors";

function loadOptional<T>(name: string, code: CallErrorCode = "MISSING_DEPENDENCY"): T {
	try {
		return require(name);
	} catch {
		throw new CallError(code);
	}
}

export function loadWerift(): typeof Werift {
	return loadOptional<typeof Werift>("werift");
}

export function loadWs(): typeof WebSocket {
	return loadOptional<typeof WebSocket>("ws");
}

export function loadOpusScript(): typeof OpusScript {
	return loadOptional<typeof OpusScript>("opusscript", "MISSING_OPUS_CODEC");
}
