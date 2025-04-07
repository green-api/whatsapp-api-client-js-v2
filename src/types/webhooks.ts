import {
    MessageType,
    OutgoingMessageStatus,
    QuotedMessage,
    WebhookMessageData
} from "./messages";
import { InstanceState } from "./instance";

export type WebhookType =
    "stateInstanceChanged"
    | "outgoingMessageStatus"
    | "outgoingAPIMessageReceived"
    | "outgoingMessageReceived"
    | "incomingMessageReceived"
    | "incomingCall";

/**
 * Webhook payload received when a message status changes.
 * Used to track delivery and read receipts.
 */
export interface OutgoingMessageStatusWebhook {
    typeWebhook: "outgoingMessageStatus";
    chatId: string;
    instanceData: {
        idInstance: number;
        wid: string;
        typeInstance: string;
    };
    timestamp: number;
    idMessage: string;
    status: OutgoingMessageStatus;
    description?: string;
    sendByApi: boolean;
}

export interface StateInstanceWebhook {
    typeWebhook: "stateInstanceChanged";
    instanceData: {
        idInstance: number;
        wid: string;  // Empty string when not authorized
        typeInstance: string;
    };
    timestamp: number;
    stateInstance: InstanceState;
}

export interface MessageWebhook {
    typeWebhook: "incomingMessageReceived" | "outgoingMessageReceived" | "outgoingAPIMessageReceived";
    instanceData: {
        idInstance: number;
        wid: string;
        typeInstance: string;
    };
    timestamp: number;
    idMessage: string;
    senderData: {
        chatId: string;
        sender: string;
        chatName: string;
        senderName: string;
        senderContactName?: string;
    };
    messageData: WebhookMessageData & {
        quotedMessage?: QuotedMessage;
    };
}

export type CallStatus = "offer" | "pickUp" | "hangUp" | "missed" | "declined";

export interface IncomingCallWebhook {
    from: string;
    typeWebhook: "incomingCall";
    instanceData: {
        idInstance: number;
        wid: string;
        typeInstance: string;
    };
    status: CallStatus;
    timestamp: number;
    idMessage: string;
}

/**
 * Primary webhook types received from GREEN-API.
 */
export type GreenApiWebhook =
    MessageWebhook
    | OutgoingMessageStatusWebhook
    | StateInstanceWebhook
    | IncomingCallWebhook;
