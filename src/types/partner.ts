export interface PartnerCredentials {
	partnerToken: string;
	partnerApiUrl?: string;
}

export interface PartnerInstance {
	idInstance: number;
	name: string;
	typeInstance: string;
	timeCreated: string;
	timeDeleted: string;
	apiTokenInstance: string;
	deleted: boolean;
	tariff: string;
	isFree: boolean;
	isPartner: boolean;
	expirationDate: string;
	isExpired: boolean;
}

export interface CreateInstanceParams {
	name?: string;
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
	deviceWebhook?: "yes" | "no";
	keepOnlineStatus?: "yes" | "no";
	pollMessageWebhook?: "yes" | "no";
	incomingBlockWebhook?: "yes" | "no";
	incomingCallWebhook?: "yes" | "no";
	editedMessageWebhook?: "yes" | "no";
	deletedMessageWebhook?: "yes" | "no";
}

export interface CreateInstanceResponse {
	idInstance: number;
	apiTokenInstance: string;
	typeInstance: string;
}

export interface DeleteInstanceAccountParams {
    idInstance: number;
}

export interface DeleteInstanceAccountResponse {
    deleteInstanceAccount: boolean;
}
