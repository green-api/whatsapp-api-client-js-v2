import { EventEmitter } from "events";
import type WebSocket from "ws";
import { GreenApiLogger } from "../utils/logger";
import { CallsDisconnectDetail, CallsRtcClientFrame, CallsRtcServerFrame } from "../types";
import { CallError } from "./call-errors";
import {
	CALLS_RTC_CLOSE_NORMAL,
	CALLS_RTC_FORBIDDEN_STATUS,
	CALLS_RTC_HEARTBEAT_MS,
	CALLS_RTC_PERMANENT_CLOSE_CODES,
	CALLS_RTC_RECONNECT_DELAYS_MS,
	CALLS_RTC_REFUSAL_CODES,
	CALLS_RTC_UNAUTHORIZED_STATUS,
	CALL_ERROR_MATCHERS,
} from "./defaults";
import { loadWs } from "./optional-dependencies";

function closeRefusal(code: number, reason: string): CallError | undefined {
	if (code < CALLS_RTC_PERMANENT_CLOSE_CODES.min || code > CALLS_RTC_PERMANENT_CLOSE_CODES.max) {
		return undefined;
	}
	const notInTariff = code === CALLS_RTC_REFUSAL_CODES.notInTariff || reason.toLowerCase().includes(CALL_ERROR_MATCHERS.notInTariff);
	return new CallError(notInTariff ? "NOT_IN_TARIFF" : "CALLS_NOT_ENABLED", {statusCode: code, serverMessage: reason || undefined});
}

function handshakeRefusal(statusCode: number | undefined): CallError | undefined {
	if (statusCode === CALLS_RTC_UNAUTHORIZED_STATUS) {
		return new CallError("INVALID_CREDENTIALS", {statusCode});
	}
	if (statusCode === CALLS_RTC_FORBIDDEN_STATUS) {
		return new CallError("CALLS_NOT_ENABLED", {statusCode});
	}
	return undefined;
}

export class CallsSocket extends EventEmitter {
	private readonly logger = GreenApiLogger.getInstance(CallsSocket.name);
	private socket?: WebSocket;
	private closedByUser = false;
	private reconnectDelay: number = CALLS_RTC_RECONNECT_DELAYS_MS.first;
	private reconnectTimer?: NodeJS.Timeout;
	private heartbeat?: NodeJS.Timeout;
	private pendingOpen?: {resolve: () => void; reject: (error: Error) => void};

	constructor(private readonly url: string) {
		super();
	}

	get isOpen(): boolean {
		return this.socket !== undefined && this.socket.readyState === loadWs().OPEN;
	}

	open(): Promise<void> {
		if (this.socket) {
			return this.isOpen ? Promise.resolve() : Promise.reject(new CallError("CONNECTION_FAILED", {message: "The calls connection is already opening"}));
		}
		this.closedByUser = false;
		return new Promise((resolve, reject) => {
			this.pendingOpen = {resolve, reject};
			this.connect();
		});
	}

	send(frame: CallsRtcClientFrame): boolean {
		if (!this.socket || !this.isOpen) {
			return false;
		}
		this.socket.send(JSON.stringify(frame));
		return true;
	}

	close(): void {
		this.closedByUser = true;
		clearTimeout(this.reconnectTimer);
		this.stopHeartbeat();
		const socket = this.socket;
		this.socket = undefined;
		socket?.close(CALLS_RTC_CLOSE_NORMAL);
		this.pendingOpen?.reject(new CallError("CONNECTION_FAILED", {message: "The calls connection was closed"}));
		this.pendingOpen = undefined;
	}

	private connect(): void {
		const WebSocketClass = loadWs();
		const socket = new WebSocketClass(this.url);
		this.socket = socket;
		let refusal: CallError | undefined;
		let alive = true;

		socket.on("unexpected-response", (_request, response) => {
			refusal = handshakeRefusal(response.statusCode);
			response.resume();
			socket.terminate();
		});

		socket.on("open", () => {
			this.reconnectDelay = CALLS_RTC_RECONNECT_DELAYS_MS.first;
			this.pendingOpen?.resolve();
			this.pendingOpen = undefined;
			this.stopHeartbeat();
			this.heartbeat = setInterval(() => {
				if (!alive) {
					socket.terminate();
					return;
				}
				alive = false;
				socket.ping();
			}, CALLS_RTC_HEARTBEAT_MS);
			this.emit("connect");
		});

		socket.on("pong", () => {
			alive = true;
		});

		socket.on("message", (data) => {
			let frame: CallsRtcServerFrame;
			try {
				frame = JSON.parse(data.toString());
			} catch {
				this.logger.warn("Skipping a callsRtc frame that is not JSON");
				return;
			}
			this.emit("frame", frame);
		});

		socket.on("error", (error) => {
			this.logger.debug("callsRtc connection error", {error: error.message});
		});

		socket.on("close", (code, reasonBuffer) => {
			if (this.socket !== socket) {
				return;
			}
			this.socket = undefined;
			this.stopHeartbeat();
			if (this.closedByUser) {
				return;
			}
			const reason = reasonBuffer.toString();
			const error = refusal ?? closeRefusal(code, reason);
			if (error) {
				this.disconnected({reason: error.message, code, permanent: true, error});
				return;
			}
			if (this.pendingOpen) {
				this.disconnected({
					reason: `Could not connect to the calls server (code ${code})`,
					code,
					permanent: true,
					error: new CallError("CONNECTION_FAILED", {statusCode: code, serverMessage: reason || undefined}),
				});
				return;
			}
			this.disconnected({reason: reason || `Connection lost (code ${code})`, code, permanent: false});
			this.reconnectTimer = setTimeout(() => this.connect(), this.reconnectDelay);
			this.reconnectDelay = Math.min(this.reconnectDelay * 2, CALLS_RTC_RECONNECT_DELAYS_MS.max);
		});
	}

	private disconnected(detail: CallsDisconnectDetail): void {
		if (this.pendingOpen && detail.error) {
			this.pendingOpen.reject(detail.error);
			this.pendingOpen = undefined;
		}
		this.emit("disconnect", detail);
	}

	private stopHeartbeat(): void {
		clearInterval(this.heartbeat);
		this.heartbeat = undefined;
	}
}
