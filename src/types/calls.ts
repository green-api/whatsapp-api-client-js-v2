import type { Readable } from "stream";
import type { CallError } from "../calls/call-errors";

export type IncomingCallStatus = "pickUp" | "hungUp" | "hangUp" | "declined" | "missed";
export type OutgoingCallStatus = "pickUp" | "hungUp" | "hangUp" | "invalid" | "declined" | "missed";

export interface IncomingCall {
	type: "incoming";
	idMessage: string;
	timestamp: number;
	typeMessage: "incomingCall";
	chatId: string;
	isVideo: boolean;
	status: IncomingCallStatus;
	isGroup: boolean;
	duration?: number;
	sendByApi?: boolean;
}

export interface OutgoingCallParticipant {
	id: string;
	status: OutgoingCallStatus;
}

export interface OutgoingCall {
	type: "outgoing";
	idMessage: string;
	timestamp: number;
	typeMessage: "outgoingCall";
	chatId: string;
	duration: number;
	isVideo: boolean;
	status: OutgoingCallStatus;
	participants: OutgoingCallParticipant[];
	sendByApi?: boolean;
}

/**
 * Call state of the instance: idle, inc-call (ringing in), out-call (ringing out) or on-call (talking).
 */
export type CallStateKind = "idle" | "inc-call" | "out-call" | "on-call";

export interface CallInfo {
	id: string;
	wid: string;
	name?: string;
}

/**
 * Call state from callsState and the calls connection.
 * reason comes only with the idle state that ends a call, and only on the calls connection.
 */
export interface CallState {
	state: CallStateKind;
	info?: CallInfo;
	reason?: string;
}

export interface CallsDial {
	chatId: string;
}

export interface CallIdResponse {
	callId: string;
}

export interface IceServer {
	urls: string | string[];
	username?: string;
	credential?: string;
}

export interface GetCallRecording {
	idMessage: string;
}

export interface CallRecording {
	status: "processing" | "ready" | "notFound" | "failed";
	downloadUrl?: string;
	expireAt?: number;
	durationMs?: number;
	sizeBytes?: number;
}

export type CallErrorCode =
	| "INVALID_CREDENTIALS"
	| "INVALID_CHAT_ID"
	| "INVALID_REQUEST"
	| "CALLS_NOT_ENABLED"
	| "NOT_IN_TARIFF"
	| "NO_RECENT_CONTACT"
	| "INSTANCE_NOT_READY"
	| "ALREADY_IN_CALL"
	| "NO_INCOMING_CALL"
	| "NO_ACTIVE_CALL"
	| "CALL_ENDED"
	| "CALL_REFUSED"
	| "CALL_FAILED"
	| "TIMEOUT"
	| "RATE_LIMITED"
	| "CONNECTION_FAILED"
	| "AUDIO_NOT_STARTED"
	| "AUDIO_BUSY"
	| "AUDIO_FAILED"
	| "INVALID_AUDIO"
	| "MISSING_DEPENDENCY"
	| "MISSING_OPUS_CODEC"
	| "FFMPEG_NOT_FOUND";

export interface CallsRtcIceCandidate {
	candidate: string;
	sdpMid?: string | null;
	sdpMLineIndex?: number | null;
}

export type CallsRtcServerFrame =
	| {type: "state"; state: CallState}
	| {type: "answer"; answer: {type: "answer"; sdp: string}}
	| {type: "ice-candidate"; candidate: CallsRtcIceCandidate}
	| {type: "error"; message: string};

export type CallsRtcClientFrame =
	| {type: "offer"; offer: {type: "offer"; sdp: string}}
	| {type: "ice-candidate"; candidate: CallsRtcIceCandidate}
	| {type: "stop"};

/**
 * Why the calls connection dropped. permanent means GREEN-API refused it and it will not reconnect.
 */
export interface CallsDisconnectDetail {
	reason: string;
	code?: number;
	permanent?: boolean;
	error?: CallError;
}

/**
 * How a call ended. reason is call-ended when GREEN-API ended it, connection-lost when the calls connection dropped.
 * cause is GREEN-API's own word (hangup, timeout, rejected, accepted_elsewhere...), description is readable text.
 */
export interface CallEndDetail {
	reason: "call-ended" | "connection-lost";
	cause?: string;
	description: string;
}

/**
 * One Opus packet of the other side's audio.
 */
export interface CallRemoteAudio {
	payload: Buffer;
	sequenceNumber: number;
	timestamp: number;
}

/**
 * Audio to play into a call: path or http(s) URL of a file, a Buffer, or a readable stream.
 */
export type CallAudioSource = string | Buffer | Readable;

export interface CallPlayOptions {
	ffmpegPath?: string;
}

/**
 * Sample rates of live PCM audio. Opus works with them directly, no resampling.
 */
export type CallPcmSampleRate = 8000 | 12000 | 16000 | 24000 | 48000;

export interface CallsConnectionOptions {
	/**
	 * Sample rate of the PCM audio for sendPcm and the remote-pcm event, 24000 by default.
	 */
	pcmSampleRate?: CallPcmSampleRate;
}

export interface CallsConnectionEvents {
	connect: [];
	disconnect: [detail: CallsDisconnectDetail];
	state: [state: CallState];
	"incoming-call": [info: CallInfo];
	"end-call": [detail: CallEndDetail];
	"remote-audio": [audio: CallRemoteAudio];
	"remote-pcm": [pcm: Buffer];
	error: [error: CallError];
}
