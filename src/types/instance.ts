/**
 * Represents the authentication credentials for a GREEN-API WhatsApp instance.
 */
export interface Instance {
	idInstance: number | bigint;
	apiTokenInstance: string;
}

/**
 * Represents an instance state in the GREEN-API system.
 */
export type InstanceState =
	| "notAuthorized"
	| "authorized"
	| "blocked"
	| "starting"
	| "yellowCard";

export interface StateInstance {
	stateInstance: InstanceState;
}

export interface Reboot {
	isReboot: boolean;
}

export interface Logout {
	isLogout: boolean;
}

export interface WaSettings {
	avatar: string;
	phone: string;
	stateInstance: InstanceState;
	deviceId: string;
}

/**
 * Configuration settings for a GREEN-API instance.
 * Controls webhook behavior, message handling, and other instance features.
 */
export interface Settings {
	wid?: string;
	webhookUrl?: string;
	webhookUrlToken?: string;
	delaySendMessagesMilliseconds?: number;
	markIncomingMessagesReaded?: "yes" | "no";
	markIncomingMessagesReadedOnReply?: "yes" | "no";
	outgoingWebhook?: "yes" | "no";
	outgoingMessageWebhook?: "yes" | "no";
	outgoingAPIMessageWebhook?: "yes" | "no";
	stateWebhook?: "yes" | "no";
	incomingWebhook?: "yes" | "no";
	keepOnlineStatus?: "yes" | "no";
	pollMessageWebhook?: "yes" | "no";
	incomingCallWebhook?: "yes" | "no";
	incomingBlockWebhook?: "yes" | "no";
	editedMessageWebhook?: "yes" | "no";
	deletedMessageWebhook?: "yes" | "no";
}

export interface SetSettingsResponse {
	saveSettings: boolean;
}

export interface QR {
	type: "qrCode" | "error" | "alreadyLogged";
	message: string;
}

export interface GetAuthorizationCode {
	status: boolean;
	code: string;
}

export interface SetProfilePicture {
	reason: string | null;
	urlAvatar: string;
	setProfilePicture: boolean;
}
