export type IncomingCallStatus = "pickUp" | "hungUp" | "declined";
export type OutgoingCallStatus = "pickUp" | "hungUp" | "invalid" | "declined";

export interface IncomingCall {
	type: "incoming";
	idMessage: string;
	timestamp: number;
	typeMessage: "incomingCall";
	chatId: string;
	isVideo: boolean;
	status: IncomingCallStatus;
	isGroup: boolean;
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
}
