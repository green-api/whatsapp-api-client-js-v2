import { GreenApiWebhook } from "./webhooks";

/**
 * Common properties shared by all message types.
 */
export interface BaseMessage {
    chatId: string;
    quotedMessageId?: string;
}

export interface SendMessage extends BaseMessage {
    message: string;
    linkPreview?: boolean;
}

export interface SendFileByUrl extends BaseMessage {
    file: {
        url: string;
        fileName: string;
    };
    caption?: string;
}

export interface SendFileByUpload extends BaseMessage {
    file: {
        data: Blob | File;
        fileName: string;
    };
    caption?: string;
}

export interface SendPoll extends BaseMessage {
    message: string;
    options: PollOption[];
    multipleAnswers?: boolean;
}

export interface SendLocation extends BaseMessage {
    latitude: number;
    longitude: number;
    nameLocation?: string;
    address?: string;
}

export interface SendContact extends BaseMessage {
    contact: {
        phoneContact: number;
        firstName?: string;
        middleName?: string;
        lastName?: string;
        company?: string;
    };
}

export interface ForwardMessages {
    chatId: string;
    chatIdFrom: string;
    messages: string[];
}

export interface ReceiveNotificationResponse {
	receiptId: number;
	body: GreenApiWebhook;
}

export interface DeleteNotificationResponse {
	result: boolean;
}

export interface DownloadFileRequest {
	chatId: string;
	idMessage: string;
}

export interface DownloadFileResponse {
	downloadUrl: string;
}

export interface SendResponse {
	idMessage: string;
}

export interface SendFileByUploadResponse {
	idMessage: string;
	urlFile: string;
}

export interface ForwardMessagesResponse {
	messages: string[];
}

export interface PollOption {
	optionName: string;
}

export type QueueMessageType =
	| "sendMessage"
	| "sendPoll"
	| "sendFileByUrl"
	| "sendLocation"
	| "sendContact"
	| "ForwardMessages";

export type QueueMessageBody =
	| SendMessage
	| SendPoll
	| SendFileByUrl
	| SendLocation
	| SendContact
	| ForwardMessages;

export interface QueueMessage {
	messageID?: string;
	messagesIDs?: string[];
	type: QueueMessageType;
	body: QueueMessageBody;
}

export interface ClearMessagesQueue {
	isCleared: boolean;
}

export interface DownloadFileResponse {
	downloadUrl: string;
}

export interface EditMessageRequest {
	chatId: string;
	idMessage: string;
	message: string;
}

export interface EditMessageResponse {
	idMessage: string;
}

export interface DeleteMessageRequest {
	chatId: string;
	idMessage: string;
	onlySenderDelete?: boolean;
}

export interface ReadChat {
	chatId: string;
	idMessage?: string;
}

export interface ReadChatResponse {
	setRead: boolean;
}

export interface UploadFile {
	urlFile: string;
}

// Journal and message history types
export type MessageType =
	"textMessage"
	| "extendedTextMessage"
	| "imageMessage"
	| "videoMessage"
	| "documentMessage"
	| "audioMessage"
	| "contactMessage"
	| "locationMessage"
	| "contactsArrayMessage"
	| "pollMessage"
	| "reactionMessage"
	| "pollUpdateMessage"
	| "quotedMessage"
	| "stickerMessage"
	| "editedMessage"
	| "deletedMessage"
	| "buttonsMessage"
	| "listMessage"
	| "templateMessage"
	| "groupInviteMessage";

export interface GetMessage {
	chatId: string;
	idMessage: string;
}

export interface GetChatHistory {
	chatId: string;
	count?: number;
}

export interface BaseJournalMessage {
	idMessage: string;
	timestamp: number;
	typeMessage: MessageType;
	chatId: string;
	isForwarded: boolean;
	forwardingScore: number;
}

export interface IncomingJournalFields {
	type: "incoming";
	senderId: string;
	senderName: string;
	senderContactName: string;
}

export interface OutgoingJournalFields {
	type: "outgoing";
	statusMessage: OutgoingMessageStatus;
	sendByApi: boolean;
}

export type BaseIncomingJournalMessage = BaseJournalMessage & IncomingJournalFields;
export type BaseOutgoingJournalMessage = BaseJournalMessage & OutgoingJournalFields;
export type BaseJournalResponse = BaseIncomingJournalMessage | BaseOutgoingJournalMessage;

export type JournalMessageData<T> = T extends {
		typeMessage: "imageMessage" | "videoMessage" | "documentMessage" | "audioMessage" | "stickerMessage";
		fileMessageData: FileMessageData;
	}
	? Omit<T, "fileMessageData"> & FileMessageData
	: T;

export type OutgoingJournalResponse = BaseOutgoingJournalMessage & JournalMessageData<WebhookMessageData> & {
	quotedMessage?: QuotedMessage;
};

export type IncomingJournalResponse = BaseIncomingJournalMessage & JournalMessageData<WebhookMessageData> & {
	quotedMessage?: QuotedMessage;
};

export type JournalResponse = BaseJournalResponse & JournalMessageData<WebhookMessageData> & {
	quotedMessage?: QuotedMessage;
};

// Message data types
export interface ForwardableMessage {
	forwardingScore: number;
	isForwarded: boolean;
}

export interface MediaMessage extends ForwardableMessage {
	jpegThumbnail: string;
}

export interface TextMessageData {
	textMessage: string;
}

export interface EditedMessageData {
	textMessage?: string;
	caption?: string;
	stanzaId: string;
}

export interface DeletedMessageData {
	stanzaId: string;
}

export interface ReactionMessageData {
	text: string;
}

export interface ButtonData {
	buttonId: string;
	buttonText: string;
}

export interface ButtonsMessageData extends ForwardableMessage {
	contentText: string;
	footer: string;
	buttons: ButtonData[];
}

export interface ListRowData {
	title: string;
	rowId: string;
	description?: string;
}

export interface ListSectionData {
	title: string;
	rows: ListRowData[];
}

export interface ListMessageData extends ForwardableMessage {
	contentText: string;
	title?: string;
	footer?: string;
	buttonText?: string;
	sections: ListSectionData[];
}

export interface UrlButtonData {
	displayText: string;
	url: string;
}

export interface CallButtonData {
	displayText: string;
	phoneNumber: string;
}

export interface QuickReplyButtonData {
	displayText: string;
	id: string;
}

export interface TemplateButtonData {
	index: number;
	urlButton?: UrlButtonData;
	callButton?: CallButtonData;
	quickReplyButton?: QuickReplyButtonData;
}

export interface TemplateMessageData extends ForwardableMessage {
	namespace?: string;
	elementName?: string;
	contentText: string;
	footer?: string;
	buttons: TemplateButtonData[];
}

export interface GroupInviteMessageData {
	groupJid: string;
	inviteCode: string;
	inviteExpiration: string;
	groupName: string;
	caption: string;
	name: string;
	jpegThumbnail: string;
}

export interface ExtendedTextMessageData extends MediaMessage {
	text: string;
	description: string;
	title: string;
}

export interface FileMessageData extends MediaMessage {
	downloadUrl: string;
	caption: string;
	mimeType: string;
	fileName: string;
	isAnimated?: boolean;
}

export interface LocationMessageData extends MediaMessage {
	nameLocation: string;
	address: string;
	latitude: number;
	longitude: number;
}

export interface ContactMessageData extends ForwardableMessage {
	displayName: string;
	vcard: string;
}

export interface ContactsArrayMessageData extends ForwardableMessage {
	contacts: Array<{
		displayName: string;
		vcard: string;
	}>;
}

export interface PollMessageData {
	name: string;
	options: PollOption[];
	multipleAnswers: boolean;
}

export type QuotedMessage = {
	stanzaId: string;
	participant: string;
	typeMessage: MessageType;
} & ({
	typeMessage: "textMessage"; textMessage: string
} | {
	typeMessage: "extendedTextMessage";
	textMessage: string;
	extendedTextMessage: {
		description?: string;
		title?: string;
		previewType?: string;
		jpegThumbnail?: string | null;
	}
} | {
	typeMessage: "contactMessage"; contact: {
		displayName: string;
		vcard: string;
	}
} | {
	typeMessage: "contactsArrayMessage";
	contacts: Array<{
		displayName: string;
		vcard: string;
	}>;
} | {
	typeMessage: "locationMessage";
	location: {
		nameLocation: string;
		address: string;
		jpegThumbnail: string;
		latitude: number;
		longitude: number;
	};
} | {
	typeMessage: "imageMessage" | "videoMessage" | "documentMessage" | "audioMessage";
	downloadUrl: string;
	caption: string;
	jpegThumbnail: string;
} | {
	typeMessage: "stickerMessage";
	downloadUrl: string;
	caption: string;
	jpegThumbnail: string;
	isAnimated: boolean;
} | {
	typeMessage: "buttonsMessage";
	contentText: string;
	footer?: string;
	buttons: ButtonData[];
} | {
	typeMessage: "listMessage";
	contentText: string;
	title?: string;
	footer?: string;
	buttonText?: string;
	sections: ListSectionData[];
} | {
	typeMessage: "templateMessage";
	contentText: string;
	footer?: string;
	buttons: TemplateButtonData[];
} | {
	typeMessage: "groupInviteMessage";
	groupInviteMessageData: GroupInviteMessageData;
});

export interface PollVote {
	optionName: string;
	optionVoters: string[];
}

export interface PollUpdateMessageData {
	stanzaId: string;
	name: string;
	votes: PollVote[];
	multipleAnswers: boolean;
}

export type OutgoingMessageStatus =
	| "sent"
	| "delivered"
	| "read"
	| "failed"
	| "noAccount"
	| "notInGroup"
	| "yellowCard";

export type WebhookMessageData = {
	typeMessage: "textMessage";
	textMessageData: TextMessageData;
} | {
	typeMessage: "extendedTextMessage";
	extendedTextMessageData: ExtendedTextMessageData;
} | {
	typeMessage: "imageMessage" | "videoMessage" | "documentMessage" | "audioMessage";
	fileMessageData: FileMessageData;
} | {
	typeMessage: "quotedMessage";
	extendedTextMessageData: ExtendedTextMessageData;
	quotedMessage: QuotedMessage;
} | {
	typeMessage: "locationMessage";
	locationMessageData: LocationMessageData;
} | {
	typeMessage: "contactMessage";
	contactMessageData: ContactMessageData;
} | {
	typeMessage: "pollMessage";
	pollMessageData: PollMessageData;
} | {
	typeMessage: "pollUpdateMessage";
	pollMessageData: PollUpdateMessageData;
} | {
	typeMessage: "contactsArrayMessage";
	messageData: ContactsArrayMessageData;
} | {
	typeMessage: "editedMessage";
	editedMessageData: EditedMessageData;
} | {
	typeMessage: "deletedMessage";
	deletedMessageData: DeletedMessageData;
} | {
	typeMessage: "reactionMessage";
	extendedTextMessageData: ReactionMessageData;
	quotedMessage: QuotedMessage;
} | {
	typeMessage: "buttonsMessage";
	buttonsMessage: ButtonsMessageData;
} | {
	typeMessage: "listMessage";
	listMessage: ListMessageData;
} | {
	typeMessage: "templateMessage";
	templateMessage: TemplateMessageData;
} | {
	typeMessage: "stickerMessage";
	fileMessageData: FileMessageData;
} | {
	typeMessage: "groupInviteMessage";
	groupInviteMessageData: GroupInviteMessageData;
};
