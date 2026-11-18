import { CallErrorCode, CallStateKind } from "../types";

export const CALL_ERROR_MESSAGES: Record<CallErrorCode, string> = {
	INVALID_CREDENTIALS: "Wrong idInstance or apiTokenInstance",
	INVALID_CHAT_ID: "Invalid chatId for a call, use 79001234567@c.us or 123456789012345@lid",
	INVALID_REQUEST: "GREEN-API rejected the request",
	CALLS_NOT_ENABLED: "Calls are not enabled for this instance",
	NOT_IN_TARIFF: "The instance plan does not include calls",
	NO_RECENT_CONTACT: "Outgoing calls are allowed only to chats that wrote or called in the last 72 hours",
	INSTANCE_NOT_READY: "The instance is not running yet, try again later",
	ALREADY_IN_CALL: "The instance is already in a call",
	NO_INCOMING_CALL: "There is no incoming call to answer",
	NO_ACTIVE_CALL: "There is no active call",
	CALL_ENDED: "The call has already ended",
	CALL_REFUSED: "WhatsApp refused the call",
	CALL_FAILED: "The call could not be completed",
	TIMEOUT: "The calls server did not answer in time",
	RATE_LIMITED: "Too many requests to GREEN-API, try again later",
	CONNECTION_FAILED: "Could not connect to GREEN-API",
	AUDIO_NOT_STARTED: "There is no call audio, start it with startAudioBridge() after dialing or accepting",
	AUDIO_BUSY: "The call audio is already starting or running",
	AUDIO_FAILED: "The call audio could not be connected",
	INVALID_AUDIO: "The audio could not be played",
	MISSING_DEPENDENCY: "Call audio needs the optional dependencies, install them with: npm install werift@^0.25.2 ws",
	MISSING_OPUS_CODEC: "Live PCM audio needs the optional Opus codec, install it with: npm install opusscript",
	FFMPEG_NOT_FOUND: "ffmpeg was not found. Install ffmpeg, pass ffmpegPath, or play an Ogg Opus file",
};

export const CALL_ERROR_MATCHERS = {
	noRecentContact: "72 hours",
	notInTariff: "tariff",
	alreadyInCall: "already in a call",
	noIncomingCall: "no incoming call",
	noActiveCall: "no active call",
	notInitialized: "not initialized",
} as const;

export const CALL_END_REASON_DESCRIPTIONS: Record<string, string> = {
	hungUp: "Call ended",
	hangup: "Call ended",
	timeout: "No answer",
	rejected: "Call declined",
	accepted_elsewhere: "Answered on another device",
	rejected_elsewhere: "Declined on another device",
	"no-media": "No audio was transmitted",
	"connect-timeout": "The audio connection could not be established",
	"instance-gone": "The instance became unavailable",
};

export const CALL_ENDED_DESCRIPTION = "Call ended";
export const CALL_CONNECTION_LOST_DESCRIPTION = "The calls connection was lost";

export const CALL_AUDIO_ERROR_DETAILS = {
	notOgg: "the data is not an Ogg stream",
	notOpus: "the Ogg stream does not contain Opus audio",
	badPacket: "the Opus stream has a broken packet",
	empty: "the audio is empty",
	tooLarge: "the audio is larger than",
	download: "the audio could not be downloaded",
	ffmpeg: "ffmpeg could not convert the audio",
	audioStopped: "the call audio was stopped",
	callEnded: "the call ended before the audio connected",
	connectionLost: "the calls connection was lost while the audio was connecting",
	notConnected: "the audio connection was not established in time",
	connectionFailed: "the audio connection failed",
	sampleRate: "pcmSampleRate must be one of 8000, 12000, 16000, 24000, 48000",
} as const;

export const CALL_ACTIVE_STATES: readonly CallStateKind[] = ["inc-call", "out-call", "on-call"];

export const CALLS_RTC_ENDPOINT = "callsRtc";
export const CALLS_RTC_PERMANENT_CLOSE_CODES = {min: 4000, max: 4999} as const;
export const CALLS_RTC_REFUSAL_CODES = {notInTariff: 4403, disabled: 4501} as const;
export const CALLS_RTC_RECONNECT_DELAYS_MS = {first: 500, max: 10000} as const;
export const CALLS_RTC_HEARTBEAT_MS = 20000;
export const CALLS_RTC_CLOSE_NORMAL = 1000;
export const CALLS_RTC_UNAUTHORIZED_STATUS = 401;
export const CALLS_RTC_FORBIDDEN_STATUS = 403;

export const CALL_AUDIO_OPUS_CODEC = {mimeType: "audio/opus", clockRate: 48000, channels: 2} as const;
export const CALL_AUDIO_CLOCK_RATE_PER_MS = 48;
export const CALL_AUDIO_GATHER_WAIT_MS = 1000;
export const CALL_AUDIO_CONNECT_TIMEOUT_MS = 15000;
export const CALL_AUDIO_REMOTE_WAIT_MS = 3000;
export const CALL_AUDIO_MAX_SEND_LAG_MS = 200;
export const CALL_AUDIO_MAX_SOURCE_BYTES = 50 * 1024 * 1024;
export const CALL_AUDIO_SEQUENCE_RANGE = 0x10000;
export const CALL_AUDIO_TIMESTAMP_RANGE = 0x100000000;

export const CALL_PCM_SAMPLE_RATES = [8000, 12000, 16000, 24000, 48000] as const;
export const CALL_PCM_DEFAULT_SAMPLE_RATE = 24000;
export const CALL_PCM_FRAME_MS = 20;
export const CALL_PCM_FRAMES_PER_SECOND = 1000 / CALL_PCM_FRAME_MS;
export const CALL_PCM_BYTES_PER_SAMPLE = 2;
export const CALL_PCM_BITRATE = 32000;
export const CALL_PCM_MAX_GAP_FILL_MS = 10000;
export const CALL_SEQUENCE_HALF_RANGE = 0x8000;

export const CALL_AUDIO_FFMPEG_PATH = "ffmpeg";
export const CALL_AUDIO_FFMPEG_STDIN = "pipe:0";
export const CALL_AUDIO_FFMPEG_STDOUT = "pipe:1";
export const CALL_AUDIO_FFMPEG_INPUT_ARGS = ["-hide_banner", "-loglevel", "error"];
export const CALL_AUDIO_FFMPEG_OUTPUT_ARGS = [
	"-vn", "-ac", "1", "-ar", "48000", "-c:a", "libopus", "-b:a", "32k",
	"-application", "lowdelay", "-frame_duration", "20", "-f", "ogg",
];
export const CALL_AUDIO_URL_PATTERN = /^https?:\/\//i;

export const OGG_CAPTURE_PATTERN = "OggS";
export const OGG_PAGE_HEADER_SIZE = 27;
export const OGG_LACING_CONTINUES = 255;
export const OPUS_HEAD_MAGIC = "OpusHead";
export const OPUS_TAGS_MAGIC = "OpusTags";
export const OPUS_FIRST_HYBRID_CONFIG = 12;
export const OPUS_FIRST_CELT_CONFIG = 16;
export const OPUS_SILK_FRAME_MS = [10, 20, 40, 60] as const;
export const OPUS_HYBRID_FRAME_MS = [10, 20] as const;
export const OPUS_CELT_FRAME_MS = [2.5, 5, 10, 20] as const;
export const OPUS_FRAME_CODE_MASK = 0x03;
export const OPUS_FRAME_COUNT_MASK = 0x3f;
