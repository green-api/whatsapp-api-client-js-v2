import { GreenApiError } from "../client/errors";
import { CallErrorCode } from "../types";
import { CALL_ERROR_MATCHERS, CALL_ERROR_MESSAGES } from "./defaults";

export interface CallErrorOptions {
	message?: string;
	statusCode?: number;
	response?: unknown;
	serverMessage?: string;
}

/**
 * Error thrown by the calls methods and the calls connection.
 * code tells what went wrong, serverMessage keeps the text GREEN-API sent.
 *
 * @example
 * ```typescript
 * try {
 *   await client.callsDial({chatId: "79001234567@c.us"});
 * } catch (error) {
 *   if (error instanceof CallError && error.code === "NO_RECENT_CONTACT") {
 *     console.log(error.message);
 *   }
 * }
 * ```
 */
export class CallError extends GreenApiError {
	readonly serverMessage?: string;

	/**
	 * Creates a call error.
	 *
	 * @param code - What went wrong
	 * @param options - Message, HTTP status and response from GREEN-API
	 */
	constructor(readonly code: CallErrorCode, options: CallErrorOptions = {}) {
		super(options.message ?? CALL_ERROR_MESSAGES[code], options.statusCode, options.response);
		this.name = "CallError";
		this.serverMessage = options.serverMessage;
	}
}

function serverMessageOf(response: unknown): string | undefined {
	if (typeof response === "string") {
		return response || undefined;
	}
	if (response && typeof response === "object" && typeof (response as {message?: unknown}).message === "string") {
		return (response as {message: string}).message;
	}
	return undefined;
}

function callErrorCode(statusCode: number, serverMessage: string, method?: string): CallErrorCode {
	const text = serverMessage.toLowerCase();
	switch (statusCode) {
		case 400:
			return method === "callsDial" ? "INVALID_CHAT_ID" : "INVALID_REQUEST";
		case 401:
			return "INVALID_CREDENTIALS";
		case 403:
			if (text.includes(CALL_ERROR_MATCHERS.noRecentContact)) {
				return "NO_RECENT_CONTACT";
			}
			if (text.includes(CALL_ERROR_MATCHERS.notInTariff)) {
				return "NOT_IN_TARIFF";
			}
			return "CALLS_NOT_ENABLED";
		case 409:
			if (text.includes(CALL_ERROR_MATCHERS.alreadyInCall)) {
				return "ALREADY_IN_CALL";
			}
			if (text.includes(CALL_ERROR_MATCHERS.noIncomingCall)) {
				return "NO_INCOMING_CALL";
			}
			if (text.includes(CALL_ERROR_MATCHERS.noActiveCall)) {
				return "NO_ACTIVE_CALL";
			}
			if (text.includes(CALL_ERROR_MATCHERS.notInitialized)) {
				return "INSTANCE_NOT_READY";
			}
			return "CALL_ENDED";
		case 429:
			return "RATE_LIMITED";
		case 503:
			return "CALL_REFUSED";
		case 504:
			return "TIMEOUT";
		default:
			return "CALL_FAILED";
	}
}

/**
 * Converts an error from a calls request into a CallError.
 *
 * @param error - Error thrown by a GREEN-API request
 * @param method - GREEN-API method that failed
 * @returns The call error
 */
export function toCallError(error: unknown, method?: string): CallError {
	if (error instanceof CallError) {
		return error;
	}
	if (!(error instanceof GreenApiError)) {
		const text = error instanceof Error ? error.message : String(error);
		return new CallError("CALL_FAILED", {message: `${CALL_ERROR_MESSAGES.CALL_FAILED}: ${text}`});
	}
	if (error.statusCode === undefined) {
		return new CallError("CONNECTION_FAILED", {serverMessage: error.message});
	}
	const serverMessage = serverMessageOf(error.response);
	return new CallError(callErrorCode(error.statusCode, serverMessage ?? "", method), {
		statusCode: error.statusCode,
		response: error.response,
		serverMessage,
	});
}
