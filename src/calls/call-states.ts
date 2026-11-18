import { CallStateKind, CallWebhook, GreenApiWebhook } from "../types";
import { CALL_ACTIVE_STATES, CALL_END_REASON_DESCRIPTIONS } from "./defaults";

/**
 * Checks whether a call state means a call is ringing or running.
 *
 * @param state - The call state
 * @returns True for inc-call, out-call and on-call
 */
export function isActiveCallState(state: CallStateKind | undefined): boolean {
	return state !== undefined && CALL_ACTIVE_STATES.includes(state);
}

/**
 * Describes why a call ended, from the reason GREEN-API sends with the idle state.
 * Reasons the SDK does not know are returned as they came.
 *
 * @param reason - The reason from the idle call state
 * @returns Human-readable reason, or undefined when there is none
 */
export function describeCallEndReason(reason?: string): string | undefined {
	if (!reason) {
		return undefined;
	}
	const [kind, detail] = reason.split(/:(.*)/s);
	const description = CALL_END_REASON_DESCRIPTIONS[reason] ?? CALL_END_REASON_DESCRIPTIONS[kind];
	if (!description) {
		return reason;
	}
	return detail ? `${description}: ${detail}` : description;
}

/**
 * Checks whether a webhook is an incomingCall or outgoingCall webhook.
 *
 * @param webhook - The webhook from GREEN-API
 * @returns True for call webhooks
 */
export function isCallWebhook(webhook: GreenApiWebhook): webhook is CallWebhook {
	return webhook.typeWebhook === "incomingCall" || webhook.typeWebhook === "outgoingCall";
}
