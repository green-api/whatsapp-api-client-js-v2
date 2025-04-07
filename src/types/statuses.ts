import { OutgoingMessageStatus } from "./messages";

export interface SendTextStatus {
	message: string;
	backgroundColor?: string;
	font?: string;
	participants?: string[];
}

export interface SendTextStatusResponse {
	idMessage: string;
}

export interface SendVoiceStatus {
	urlFile: string;
	fileName: string;
	backgroundColor?: string;
	participants?: string[];
}

export interface SendVoiceStatusResponse {
	idMessage: string;
}

export interface SendMediaStatus {
	urlFile: string;
	fileName: string;
	caption?: string;
	participants?: string[];
}

export interface SendMediaStatusResponse {
	idMessage: string;
}

export interface DeleteStatus {
	idMessage: string;
}

export interface GetStatusStatistic {
	idMessage: string;
}

export interface StatusStatisticItem {
	participant: string;
	timestamp: number;
	status: OutgoingMessageStatus;
}

export type GetStatusStatisticResponse = StatusStatisticItem[];

export interface GetIncomingStatusesParams {
	minutes?: number;
}

export interface ExtendedTextMessageDataStatus {
	text: string;
	backgroundColor: string;
	font?: string;
}

export interface IncomingStatusBase {
	type: "incoming";
	idMessage: string;
	timestamp: number;
	typeMessage: "extendedTextMessage" | "imageMessage" | "videoMessage" | "audioMessage";
	chatId: string;
	senderId: string;
	senderName: string;
	senderContactName: string;
}

export interface IncomingTextStatusMessage extends IncomingStatusBase {
	typeMessage: "extendedTextMessage";
	textMessage: string;
	extendedTextMessage: ExtendedTextMessageDataStatus;
}

export interface IncomingMediaStatusMessage extends IncomingStatusBase {
	typeMessage: "imageMessage" | "videoMessage" | "audioMessage";
	downloadUrl: string;
	caption?: string;
	fileName: string;
	jpegThumbnail?: string;
	mimeType: string;
}

export type IncomingStatusMessage = IncomingTextStatusMessage | IncomingMediaStatusMessage;

export interface GetOutgoingStatusesParams {
	minutes?: number;
}

export interface OutgoingStatusBase {
	type: "outgoing";
	idMessage: string;
	timestamp: number;
	typeMessage: "extendedTextMessage" | "imageMessage" | "videoMessage" | "audioMessage";
	chatId: string;
	statusMessage: OutgoingMessageStatus;
	sendByApi: boolean;
	participants?: string[];
}

export interface OutgoingTextStatusMessage extends OutgoingStatusBase {
	typeMessage: "extendedTextMessage";
	textMessage: string;
	extendedTextMessage: ExtendedTextMessageDataStatus & {
		participants?: string[];
	};
}

export interface OutgoingMediaStatusMessage extends OutgoingStatusBase {
	typeMessage: "imageMessage" | "videoMessage" | "audioMessage";
	downloadUrl: string;
	caption?: string;
	fileName: string;
	jpegThumbnail?: string;
	mimeType: string;
}

export type OutgoingStatusMessage = OutgoingTextStatusMessage | OutgoingMediaStatusMessage;
