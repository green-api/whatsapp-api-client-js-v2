import { BaseClient } from "./base-client";
import {
	Instance,
	Settings,
	SendMessage,
	SendFileByUrl,
	SendFileByUpload,
	SendPoll,
	StateInstance,
	Reboot,
	Logout,
	QR,
	SendResponse,
	SendFileByUploadResponse,
	SetSettingsResponse,
	GetAuthorizationCode,
	SetProfilePicture,
	WaSettings,
	UploadFile,
	SendLocation,
	SendContact,
	ForwardMessages,
	ForwardMessagesResponse,
	QueueMessage,
	ClearMessagesQueue,
	ReadChatResponse,
	ReadChat,
	CheckWhatsapp,
	CheckWhatsappResponse,
	GetAvatarResponse,
	GetAvatar,
	Contact,
	ContactInfo,
	ArchiveChat,
	UnarchiveChat,
	SetDisappearingChat,
	SetDisappearingChatResponse,
	CreateGroupResponse,
	CreateGroup,
	UpdateGroupName,
	UpdateGroupNameResponse,
	GetGroupData,
	GroupData,
	AddGroupParticipant,
	AddGroupParticipantResponse,
	RemoveGroupParticipant,
	RemoveGroupParticipantResponse,
	SetGroupAdmin,
	SetGroupAdminResponse,
	RemoveAdminResponse,
	RemoveAdmin,
	SetGroupPicture,
	SetGroupPictureResponse,
	LeaveGroup,
	LeaveGroupResponse,
	GetMessage,
	JournalResponse,
	GetChatHistory,
	IncomingJournalResponse,
	OutgoingJournalResponse,
	DownloadFileResponse,
	DownloadFileRequest,
	DeleteNotificationResponse,
	ReceiveNotificationResponse, DeleteMessageRequest, EditMessageRequest, EditMessageResponse,
	DeleteStatus,
	GetIncomingStatusesParams,
	GetOutgoingStatusesParams,
	GetStatusStatistic,
	GetStatusStatisticResponse,
	IncomingStatusMessage, OutgoingStatusMessage,
	SendMediaStatus,
	SendMediaStatusResponse,
	SendTextStatus,
	SendTextStatusResponse,
	SendVoiceStatus,
	SendVoiceStatusResponse,
} from "../types";

/**
 * Client for direct interaction with GREEN-API's WhatsApp gateway.
 * Provides methods for sending messages, managing instances, and handling files.
 * For more information about the methods, refer to https://green-api.com/en/docs
 *
 * @example
 * ```typescript
 * const client = new GreenApiClient({
 *   idInstance: 12345,
 *   apiTokenInstance: "your-token"
 * });
 *
 * await client.sendMessage({
 *   chatId: "1234567890@c.us",
 *   message: "Hello from GREEN-API!"
 * });
 * ```
 */
export class GreenApiClient extends BaseClient {
	/**
	 * Creates a GREEN-API client instance.
	 *
	 * @param instance - Configuration containing idInstance and apiTokenInstance
	 */
	constructor(instance: Instance) {
		super(instance);
	}

	/**
	 * Validates that a phone number is a positive integer with correct length.
	 *
	 * @param phoneNumber - The phone number to validate
	 * @throws Error if validation fails
	 */
	private validatePhoneNumber(phoneNumber: number): void {
		if (!Number.isInteger(phoneNumber) || phoneNumber <= 0) {
			throw new Error("Phone number must be a positive integer");
		}

		const phoneStr = phoneNumber.toString();
		if (phoneStr.length < 10 || phoneStr.length > 15) {
			throw new Error("Phone number must be between 10 and 15 digits");
		}
	}

	// -------------------------------------------------------------------------
	// Message Sending Methods
	// -------------------------------------------------------------------------

	/**
	 * Sends a text message to a WhatsApp chat.
	 *
	 * @param message - Message data containing chat ID and text
	 * @returns Promise resolving to send response with message ID
	 *
	 * @example
	 * ```typescript
	 * await client.sendMessage({
	 *   chatId: "1234567890@c.us",
	 *   message: "Hello!",
	 *   quotedMessageId: "12345" // Optional: reply to a message
	 * });
	 * ```
	 */
	async sendMessage(message: SendMessage): Promise<SendResponse> {
		return this.makeRequest("post", "sendMessage", {
			chatId: message.chatId,
			message: message.message,
			quotedMessageId: message.quotedMessageId,
			linkPreview: message.linkPreview,
		});
	}

	/**
	 * Sends a file from a URL to a WhatsApp chat.
	 *
	 * @param message - Message data containing chat ID and file URL
	 * @returns Promise resolving to send response
	 *
	 * @example
	 * ```typescript
	 * await client.sendFileByUrl({
	 *   chatId: "1234567890@c.us",
	 *   file: {
	 *     url: "https://example.com/file.pdf",
	 *     fileName: "document.pdf"
	 *   },
	 *   caption: "Check this file" // Optional
	 * });
	 * ```
	 */
	async sendFileByUrl(message: SendFileByUrl): Promise<SendResponse> {
		return this.makeRequest("post", "sendFileByUrl", {
			chatId: message.chatId,
			urlFile: message.file.url,
			fileName: message.file.fileName,
			caption: message.caption,
			quotedMessageId: message.quotedMessageId,
		});
	}

	/**
	 * Sends a file from local data to a WhatsApp chat.
	 *
	 * @param message - Message data containing chat ID and file data
	 * @returns Promise resolving to send response with file URL
	 *
	 * @example
	 * ```typescript
	 * await client.sendFileByUpload({
	 *   chatId: "1234567890@c.us",
	 *   file: {
	 *     data: fileBlob,
	 *     fileName: "image.jpg"
	 *   },
	 *   caption: "Check this image"
	 * });
	 * ```
	 */
	async sendFileByUpload(message: SendFileByUpload): Promise<SendFileByUploadResponse> {
		const formData = new FormData();
		formData.append("file", message.file.data);
		formData.append("chatId", message.chatId);
		formData.append("fileName", message.file.fileName);
		if (message.caption) formData.append("caption", message.caption);
		if (message.quotedMessageId) formData.append("quotedMessageId", message.quotedMessageId);

		return this.makeFileUploadRequest("sendFileByUpload", formData);
	}

	/**
	 * Creates a poll in a WhatsApp chat.
	 *
	 * @param message - Poll data with question and options
	 * @returns Promise resolving to send response
	 *
	 * @example
	 * ```typescript
	 * await client.sendPoll({
	 *   chatId: "1234567890@c.us",
	 *   message: "What's your favorite color?",
	 *   options: [{ optionName: "Red" }, { optionName: "Blue" }, { optionName: "Green" }],
	 *   multipleAnswers: false
	 * });
	 * ```
	 */
	async sendPoll(message: SendPoll): Promise<SendResponse> {
		return this.makeRequest("post", "sendPoll", {
			chatId: message.chatId,
			message: message.message,
			options: message.options,
			multipleAnswers: message.multipleAnswers,
			quotedMessageId: message.quotedMessageId,
		});
	}

	/**
	 * Forwards messages from one chat to another.
	 *
	 * @param request - Forward request with source and target chat IDs
	 * @returns Promise resolving to forward response
	 *
	 * @example
	 * ```typescript
	 * await client.forwardMessages({
	 *   chatId: "1234567890@c.us", // Destination chat
	 *   chatIdFrom: "9876543210@c.us", // Source chat
	 *   messages: ["message-id-1", "message-id-2"]
	 * });
	 * ```
	 */
	async forwardMessages(request: ForwardMessages): Promise<ForwardMessagesResponse> {
		return this.makeRequest("post", "forwardMessages", {
			chatId: request.chatId,
			chatIdFrom: request.chatIdFrom,
			messages: request.messages,
		});
	}

	/**
	 * Sends a location to a WhatsApp chat.
	 *
	 * @param message - Location data with coordinates
	 * @returns Promise resolving to send response
	 *
	 * @example
	 * ```typescript
	 * await client.sendLocation({
	 *   chatId: "1234567890@c.us",
	 *   latitude: 51.5074,
	 *   longitude: -0.1278,
	 *   nameLocation: "London",
	 *   address: "London, UK"
	 * });
	 * ```
	 */
	async sendLocation(message: SendLocation): Promise<SendResponse> {
		return this.makeRequest("post", "sendLocation", {
			chatId: message.chatId,
			nameLocation: message.nameLocation,
			address: message.address,
			latitude: message.latitude,
			longitude: message.longitude,
			quotedMessageId: message.quotedMessageId,
		});
	}

	/**
	 * Sends a contact card to a WhatsApp chat.
	 *
	 * @param message - Contact data
	 * @returns Promise resolving to send response
	 *
	 * @example
	 * ```typescript
	 * await client.sendContact({
	 *   chatId: "1234567890@c.us",
	 *   contact: {
	 *     phoneContact: 1234567890,
	 *     firstName: "John",
	 *     lastName: "Doe"
	 *   }
	 * });
	 * ```
	 */
	async sendContact(message: SendContact): Promise<SendResponse> {
		return this.makeRequest("post", "sendContact", {
			chatId: message.chatId,
			contact: message.contact,
			quotedMessageId: message.quotedMessageId,
		});
	}

	/**
	 * Uploads a file to GREEN-API servers.
	 *
	 * @param file - File to upload
	 * @param customFileName - Optional custom name for the file
	 * @returns Promise resolving to upload response with file URL
	 */
	async uploadFile(file: Blob | File, customFileName?: string): Promise<UploadFile> {
		const formData = new FormData();
		formData.append("file", file);

		const headers: Record<string, string> = {};

		if (file instanceof File) {
			const mimeType = file.type;
			if (mimeType) {
				headers["Content-Type"] = mimeType;
			} else if (customFileName) {
				headers["GA-Filename"] = customFileName;
			}
		} else if (customFileName) {
			headers["GA-Filename"] = customFileName;
		}

		return this.makeFileUploadRequest("uploadFile", formData, headers);
	}

	// -------------------------------------------------------------------------
	// Account Management Methods
	// -------------------------------------------------------------------------

	/**
	 * Reboots the GREEN-API instance.
	 *
	 * @returns Promise resolving to reboot status
	 */
	async reboot(): Promise<Reboot> {
		return this.makeRequest("get", "reboot");
	}

	/**
	 * Logs out from the GREEN-API instance.
	 *
	 * @returns Promise resolving to logout status
	 */
	async logout(): Promise<Logout> {
		return this.makeRequest("get", "logout");
	}

	/**
	 * Gets the current state of the GREEN-API instance.
	 *
	 * @returns Promise resolving to instance state
	 */
	async getStateInstance(): Promise<StateInstance> {
		return this.makeRequest("get", "getStateInstance");
	}

	/**
	 * Gets the QR code for GREEN-API instance authentication.
	 *
	 * @returns Promise resolving to QR code data
	 */
	async getQR(): Promise<QR> {
		return this.makeRequest("get", "qr");
	}

	/**
	 * Gets current instance settings.
	 *
	 * @returns Promise resolving to settings object
	 */
	async getSettings(): Promise<Settings> {
		return this.makeRequest("get", "getSettings");
	}

	/**
	 * Updates instance settings.
	 *
	 * @param settings - New settings to apply
	 * @returns Promise resolving to settings update response
	 */
	async setSettings(settings: Settings): Promise<SetSettingsResponse> {
		return this.makeRequest("post", "setSettings", settings);
	}

	/**
	 * Gets WhatsApp-specific settings.
	 *
	 * @returns Promise resolving to WhatsApp settings
	 */
	async getWaSettings(): Promise<WaSettings> {
		return this.makeRequest("get", "getWaSettings");
	}

	/**
	 * Sets the profile picture for the WhatsApp account.
	 *
	 * @param file - Image file to use as profile picture
	 * @returns Promise resolving to profile picture update response
	 */
	async setProfilePicture(file: Blob | File): Promise<SetProfilePicture> {
		const formData = new FormData();
		formData.append("file", file);
		return this.makeFileUploadRequest("setProfilePicture", formData);
	}

	/**
	 * Gets authorization code for a phone number.
	 *
	 * @param phoneNumber - Phone number to get code for
	 * @returns Promise resolving to authorization code response
	 * @throws {Error} If phone number is invalid
	 */
	async getAuthorizationCode(phoneNumber: number): Promise<GetAuthorizationCode> {
		this.validatePhoneNumber(phoneNumber);
		return this.makeRequest("post", "getAuthorizationCode", {phoneNumber});
	}

	// -------------------------------------------------------------------------
	// Message Queue Methods
	// -------------------------------------------------------------------------

	/**
	 * Gets the list of messages in the sending queue.
	 * Messages are stored for 24 hours and will be sent immediately after phone authorization.
	 * The sending speed is regulated by the Message Sending Interval parameter.
	 *
	 * @returns Promise resolving to an array of queued messages
	 *
	 * @example
	 * ```typescript
	 * const queuedMessages = await client.showMessagesQueue();
	 * console.log(queuedMessages);
	 * ```
	 */
	async showMessagesQueue(): Promise<QueueMessage[]> {
		return this.makeRequest("get", "showMessagesQueue");
	}

	/**
	 * Clears the queue of messages waiting to be sent.
	 * Important when switching phone numbers to prevent sending queued messages with the new number.
	 *
	 * @returns Promise resolving to queue clearing status
	 *
	 * @example
	 * ```typescript
	 * const result = await client.clearMessagesQueue();
	 * if (result.isCleared) {
	 *   console.log('Queue successfully cleared');
	 * }
	 * ```
	 */
	async clearMessagesQueue(): Promise<ClearMessagesQueue> {
		return this.makeRequest("get", "clearMessagesQueue");
	}

	// -------------------------------------------------------------------------
	// Service Methods
	// -------------------------------------------------------------------------

	/**
	 * Marks messages in a chat as read.
	 * For this to work, "Receive webhooks on incoming messages and files" setting must be enabled.
	 * Note: Only messages received after enabling the setting can be marked as read.
	 *
	 * @param params - Parameters specifying which messages to mark as read
	 * @returns Promise resolving to read status
	 *
	 * @example
	 * ```typescript
	 * // Mark all messages in chat as read
	 * const result = await client.readChat({
	 *   chatId: "1234567890@c.us"
	 * });
	 *
	 * // Mark specific message as read
	 * const result = await client.readChat({
	 *   chatId: "1234567890@c.us",
	 *   idMessage: "B275A7AA0D6EF89BB9245169BDF174E6"
	 * });
	 * ```
	 */
	async readChat(params: ReadChat): Promise<ReadChatResponse> {
		return this.makeRequest("post", "readChat", params);
	}

	/**
	 * Checks WhatsApp account availability on a phone number.
	 *
	 * @param params - Parameters containing the phone number to check
	 * @returns Promise resolving to WhatsApp availability status
	 * @throws {Error} If phone number is invalid
	 *
	 * @example
	 * ```typescript
	 * const result = await client.checkWhatsapp({
	 *   phoneNumber: 11001234567
	 * });
	 *
	 * if (result.existsWhatsapp) {
	 *   console.log('WhatsApp account exists');
	 * }
	 * ```
	 */
	async checkWhatsapp(params: CheckWhatsapp): Promise<CheckWhatsappResponse> {
		this.validatePhoneNumber(params.phoneNumber);
		return this.makeRequest("post", "checkWhatsapp", params);
	}

	/**
	 * Gets a user or group chat avatar.
	 *
	 * @param params - Parameters containing the chat ID
	 * @returns Promise resolving to avatar information
	 */
	async getAvatar(params: GetAvatar): Promise<GetAvatarResponse> {
		return this.makeRequest("post", "getAvatar", params);
	}

	/**
	 * Gets a list of the current account contacts.
	 * Note: Contact information updates can take up to 5 minutes.
	 * If an empty array is received, retry the method call.
	 *
	 * @returns Promise resolving to array of contacts
	 */
	async getContacts(): Promise<Contact[]> {
		return this.makeRequest("get", "getContacts");
	}

	/**
	 * Gets detailed information about a contact.
	 * Note: This method does not support group chats, use getGroupData for groups.
	 *
	 * @param params - Parameters containing the chat ID
	 * @returns Promise resolving to contact information
	 */
	async getContactInfo(params: GetAvatar): Promise<ContactInfo> {
		return this.makeRequest("post", "getContactInfo", params);
	}

	/**
	 * Archives a chat. Chat must have at least one incoming message.
	 * Note: "Receive webhooks on incoming messages and files" setting must be enabled.
	 *
	 * @param params - Parameters containing the chat ID to archive
	 * @returns Promise resolving to void on success
	 */
	async archiveChat(params: ArchiveChat): Promise<void> {
		return this.makeRequest("post", "archiveChat", params);
	}

	/**
	 * Unarchives a chat.
	 *
	 * @param params - Parameters containing the chat ID to unarchive
	 * @returns Promise resolving to void on success
	 */
	async unarchiveChat(params: UnarchiveChat): Promise<void> {
		return this.makeRequest("post", "unarchiveChat", params);
	}

	/**
	 * Changes settings of disappearing messages in chats.
	 * Valid expiration times: 0 (off), 86400 (24h), 604800 (7d), 7776000 (90d)
	 *
	 * @param params - Parameters containing chat ID and message expiration time
	 * @returns Promise resolving to chat disappearing message settings
	 */
	async setDisappearingChat(params: SetDisappearingChat): Promise<SetDisappearingChatResponse> {
		return this.makeRequest("post", "setDisappearingChat", params);
	}

	/**
	 * Edits a text message in a personal or group chat.
	 * WhatsApp imposes the following restrictions:
	 * - There is a 15-minute time limit for editing messages
	 * - Editing a message won't send a new chat notification
	 * - You can't edit photos, videos, or other types of media
	 *
	 * @param params - Parameters containing chat ID, message ID and new text
	 * @returns Promise resolving to edited message ID
	 *
	 * @example
	 * ```typescript
	 * const result = await client.editMessage({
	 *   chatId: "1234567890@c.us",
	 *   idMessage: "BAE5367237E13A87",
	 *   message: "Edited message text"
	 * });
	 * console.log('Edited message ID:', result.idMessage);
	 * ```
	 */
	async editMessage(params: EditMessageRequest): Promise<EditMessageResponse> {
		if (params.message.length > 20000) {
			throw new Error("Message length must be less than or equal to 20000 characters");
		}
		return this.makeRequest("post", "editMessage", params);
	}

	/**
	 * Deletes a message from a chat.
	 *
	 * @param params - Parameters containing chat ID, message ID and deletion options
	 * @returns Promise resolving to void on success
	 *
	 * @example
	 * ```typescript
	 * // Delete message for everyone
	 * await client.deleteMessage({
	 *   chatId: "1234567890@c.us",
	 *   idMessage: "BAE5F4886F6F2D05"
	 * });
	 *
	 * // Delete message only for sender
	 * await client.deleteMessage({
	 *   chatId: "1234567890@c.us",
	 *   idMessage: "BAE5F4886F6F2D05",
	 *   onlySenderDelete: true
	 * });
	 * ```
	 */
	async deleteMessage(params: DeleteMessageRequest): Promise<void> {
		await this.makeRequest("post", "deleteMessage", params);
	}

	// -------------------------------------------------------------------------
	// Group Management Methods
	// -------------------------------------------------------------------------

	/**
	 * Creates a group chat.
	 * Note: Limited to creating 1 group per 5 minutes to simulate human behavior.
	 *
	 * @param params - Parameters containing group name and participant IDs
	 * @returns Promise resolving to group creation result
	 */
	async createGroup(params: CreateGroup): Promise<CreateGroupResponse> {
		return this.makeRequest("post", "createGroup", params);
	}

	/**
	 * Changes a group chat name.
	 *
	 * @param params - Parameters containing group ID and new name
	 * @returns Promise resolving to update status
	 */
	async updateGroupName(params: UpdateGroupName): Promise<UpdateGroupNameResponse> {
		return this.makeRequest("post", "updateGroupName", params);
	}

	/**
	 * Gets group chat data.
	 * Note: groupInviteLink will be empty if user is not an admin or owner.
	 *
	 * @param params - Parameters containing group ID
	 * @returns Promise resolving to group data
	 */
	async getGroupData(params: GetGroupData): Promise<GroupData> {
		return this.makeRequest("post", "getGroupData", params);
	}

	/**
	 * Adds a participant to a group chat.
	 * Note: Only group administrators can add members.
	 * The participant's number should be saved in the phonebook for reliable addition.
	 *
	 * @param params - Parameters containing group ID and participant ID
	 * @returns Promise resolving to addition status
	 */
	async addGroupParticipant(params: AddGroupParticipant): Promise<AddGroupParticipantResponse> {
		return this.makeRequest("post", "addGroupParticipant", params);
	}

	/**
	 * Removes a participant from a group chat.
	 *
	 * @param params - Parameters containing group ID and participant ID to remove
	 * @returns Promise resolving to removal status
	 */
	async removeGroupParticipant(params: RemoveGroupParticipant): Promise<RemoveGroupParticipantResponse> {
		return this.makeRequest("post", "removeGroupParticipant", params);
	}

	/**
	 * Sets a group chat participant as an administrator.
	 *
	 * @param params - Parameters containing group ID and participant ID to promote
	 * @returns Promise resolving to admin status change result
	 */
	async setGroupAdmin(params: SetGroupAdmin): Promise<SetGroupAdminResponse> {
		return this.makeRequest("post", "setGroupAdmin", params);
	}

	/**
	 * Removes administrator rights from a group chat participant.
	 *
	 * @param params - Parameters containing group ID and participant ID to demote
	 * @returns Promise resolving to admin removal status
	 */
	async removeAdmin(params: RemoveAdmin): Promise<RemoveAdminResponse> {
		return this.makeRequest("post", "removeAdmin", params);
	}

	/**
	 * Sets a group chat picture.
	 *
	 * @param params - Parameters containing group ID and picture file (jpg)
	 * @returns Promise resolving to picture update status
	 */
	async setGroupPicture(params: SetGroupPicture): Promise<SetGroupPictureResponse> {
		const formData = new FormData();
		formData.append("file", params.file);
		formData.append("groupId", params.groupId);

		return this.makeFileUploadRequest("setGroupPicture", formData);
	}

	/**
	 * Makes the current account leave a group chat.
	 *
	 * @param params - Parameters containing the group ID to leave
	 * @returns Promise resolving to leave status
	 */
	async leaveGroup(params: LeaveGroup): Promise<LeaveGroupResponse> {
		return this.makeRequest("post", "leaveGroup", params);
	}

	// -------------------------------------------------------------------------
	// Journal Methods
	// -------------------------------------------------------------------------

	/**
	 * Gets details of a specific message.
	 * Note: To receive incoming webhooks, requires "Receive webhooks on incoming messages and files" setting to be enabled.
	 * Note: To receive statuses of sent messsages, requires "Receive notifications about the statuses of sent messages" to be enabled.
	 * Messages can take up to 2 minutes to appear in the journal.
	 *
	 * @param params - Parameters containing chat ID and message ID
	 * @returns Promise resolving to message details
	 */
	async getMessage(params: GetMessage): Promise<JournalResponse> {
		return this.makeRequest("post", "getMessage", params);
	}

	/**
	 * Gets chat message history.
	 * Note: Requires "Receive webhooks" setting to be enabled.
	 * Messages can take up to 2 minutes to appear in history.
	 *
	 * @param params - Parameters containing chat ID and optional message count
	 * @returns Promise resolving to array of messages
	 */
	async getChatHistory(params: GetChatHistory): Promise<JournalResponse[]> {
		return this.makeRequest("post", "getChatHistory", params);
	}

	/**
	 * Gets last incoming messages for the specified time period.
	 * Default is 24 hours (1440 minutes).
	 * Note: Requires "Receive webhooks" setting to be enabled.
	 * Messages can take up to 2 minutes to appear in history.
	 *
	 * @param minutes - Optional time period in minutes
	 * @returns Promise resolving to array of incoming messages
	 */
	async lastIncomingMessages(minutes?: number): Promise<IncomingJournalResponse[]> {
		return this.makeRequest("get", "lastIncomingMessages", undefined, minutes ? {minutes} : undefined);
	}

	/**
	 * Gets last outgoing messages for the specified time period.
	 * Default is 24 hours (1440 minutes).
	 * Note: Requires "Receive webhooks" setting to be enabled.
	 * Messages can take up to 2 minutes to appear in history.
	 *
	 * @param minutes - Optional time period in minutes
	 * @returns Promise resolving to array of outgoing messages
	 */
	async lastOutgoingMessages(minutes?: number): Promise<OutgoingJournalResponse[]> {
		return this.makeRequest("get", "lastOutgoingMessages", undefined, minutes ? {minutes} : undefined);
	}

	// -------------------------------------------------------------------------
	// Message Receiving Methods
	// -------------------------------------------------------------------------

	/**
	 * Receives one incoming notification from the notification queue.
	 * The method waits for a notification for the specified timeout period (default 5 seconds).
	 * After receiving a notification, you need to delete it using deleteNotification method.
	 * Notifications are stored in the queue for 24 hours and sent in FIFO order.
	 *
	 * @param timeout - Optional timeout in seconds (5-60, default 5)
	 * @returns Promise resolving to notification data with receipt ID, or null if no notification is available
	 *
	 * @example
	 * ```typescript
	 * const notification = await client.receiveNotification(30);
	 * if (notification) {
	 *   // Process notification
	 *   // Then delete it from queue
	 *   await client.deleteNotification(notification.receiptId);
	 * }
	 * ```
	 */
	async receiveNotification(timeout?: number): Promise<ReceiveNotificationResponse | null> {
		const queryParams = timeout ? {receiveTimeout: timeout} : undefined;
		const response = await this.makeRequest<ReceiveNotificationResponse | null>(
			"get",
			"receiveNotification",
			undefined,
			queryParams,
		);

		// According to documentation, if timeout is reached, an empty response is returned
		return response || null;
	}

	/**
	 * Deletes an incoming notification from the notification queue.
	 * After calling this method, the notification is considered processed and permanently deleted.
	 *
	 * @param receiptId - Receipt ID of the notification to delete
	 * @returns Promise resolving to deletion result
	 *
	 * @example
	 * ```typescript
	 * const result = await client.deleteNotification(1234567);
	 * console.log(result.result); // true if successfully deleted
	 * ```
	 */
	async deleteNotification(receiptId: number): Promise<DeleteNotificationResponse> {
    	return this.makeRequest(
			"delete", "deleteNotification", undefined, undefined, undefined, receiptId.toString()
		);
	}

	/**
	 * Downloads a file from a message.
	 * Files are stored for a limited time by WhatsApp.
	 *
	 * @param params - Parameters containing chat ID and message ID
	 * @returns Promise resolving to download URL
	 *
	 * @example
	 * ```typescript
	 * const file = await client.downloadFile({
	 *   chatId: "1234567890@c.us",
	 *   idMessage: "A322F800D3F12CD4858CC947DAFB77A2"
	 * });
	 * console.log(file.downloadUrl);
	 * ```
	 */
	async downloadFile(params: DownloadFileRequest): Promise<DownloadFileResponse> {
		return this.makeRequest("post", "downloadFile", params);
	}

	// -------------------------------------------------------------------------
	// Status Methods
	// -------------------------------------------------------------------------

	/**
	 * Sends a text status update to WhatsApp (Beta feature).
	 * The status will be added to the queue and kept for 24 hours until the instance is authorized.
	 * For recipients to see the status, both parties must save each other's numbers in their contact lists.
	 *
	 * @param params - Text status parameters including message, styling, and recipient list
	 * @returns Promise resolving to status send response with message ID
	 *
	 * @example
	 * ```typescript
	 * await client.sendTextStatus({
	 *   message: "I use Green-API to send this Status!",
	 *   backgroundColor: "#228B22", // Use any color except white
	 *   font: "SERIF",
	 *   participants: ["70000001234@c.us"] // Optional: limit visibility to specific contacts
	 * });
	 * ```
	 */
	async sendTextStatus(params: SendTextStatus): Promise<SendTextStatusResponse> {
		if (params.message.length > 500) {
			throw new Error("Status message must not exceed 500 characters");
		}

		return this.makeRequest("post", "sendTextStatus", {
			message: params.message,
			backgroundColor: params.backgroundColor,
			font: params.font,
			participants: params.participants,
		});
	}

	/**
	 * Sends a voice status update to WhatsApp (Beta feature).
	 * The status will be added to the queue and kept for 24 hours until the instance is authorized.
	 * Recommended audio format is MP3, and audio longer than one minute will be cut.
	 * For recipients to see the status, both parties must save each other's numbers in their contact lists.
	 *
	 * @param params - Voice status parameters including file URL, name, styling, and recipient list
	 * @returns Promise resolving to status send response with message ID
	 *
	 * @example
	 * ```typescript
	 * await client.sendVoiceStatus({
	 *   urlFile: "https://my.site.com/audio/voice.mp3",
	 *   fileName: "voice.mp3",
	 *   backgroundColor: "#228B22",
	 *   participants: ["70000001234@c.us"] // Optional: limit visibility to specific contacts
	 * });
	 * ```
	 */
	async sendVoiceStatus(params: SendVoiceStatus): Promise<SendVoiceStatusResponse> {
		return this.makeRequest("post", "sendVoiceStatus", {
			urlFile: params.urlFile,
			fileName: params.fileName,
			backgroundColor: params.backgroundColor,
			participants: params.participants,
		});
	}

	/**
	 * Sends a picture or video status update to WhatsApp (Beta feature).
	 * The status will be added to the queue and kept for 24 hours until the instance is authorized.
	 * Videos longer than one minute will be cut, and the recommended image aspect ratio is 9:16 (vertical).
	 * For recipients to see the status, both parties must save each other's numbers in their contact lists.
	 *
	 * @param params - Media status parameters including file URL, name, caption, and recipient list
	 * @returns Promise resolving to status send response with message ID
	 *
	 * @example
	 * ```typescript
	 * await client.sendMediaStatus({
	 *   urlFile: "https://my.site.com/img/picture.png",
	 *   fileName: "picture.png",
	 *   caption: "Check this out!",
	 *   participants: ["70000001234@c.us"] // Optional: limit visibility to specific contacts
	 * });
	 * ```
	 */
	async sendMediaStatus(params: SendMediaStatus): Promise<SendMediaStatusResponse> {
		if (params.caption && params.caption.length > 1024) {
			throw new Error("Media status caption must not exceed 1024 characters");
		}

		return this.makeRequest("post", "sendMediaStatus", {
			urlFile: params.urlFile,
			fileName: params.fileName,
			caption: params.caption,
			participants: params.participants,
		});
	}

	/**
	 * Deletes a previously sent status (Beta feature).
	 *
	 * @param params - Parameters containing the ID of the status to delete
	 * @returns Promise resolving to void on successful deletion
	 *
	 * @example
	 * ```typescript
	 * await client.deleteStatus({
	 *   idMessage: "BAE5F4886F6F2D05"
	 * });
	 * ```
	 */
	async deleteStatus(params: DeleteStatus): Promise<void> {
		await this.makeRequest("post", "deleteStatus", params);
	}

	/**
	 * Gets statistics for a previously sent status (Beta feature).
	 * Returns an array of recipients with sent/delivered/read statuses.
	 * Statistics on statuses are stored for 30 days from the date of their receipt.
	 * Requires the "Receive webhooks on sent messages statuses" setting to be enabled.
	 *
	 * @param params - Parameters containing the ID of the status to get statistics for
	 * @returns Promise resolving to an array of status statistics
	 *
	 * @example
	 * ```typescript
	 * const statistics = await client.getStatusStatistic({
	 *   idMessage: "BAE5F4886F6F2D05"
	 * });
	 *
	 * statistics.forEach(stat => {
	 *   console.log(`${stat.participant}: ${stat.status} at ${new Date(stat.timestamp * 1000)}`);
	 * });
	 * ```
	 */
	async getStatusStatistic(params: GetStatusStatistic): Promise<GetStatusStatisticResponse> {
		return this.makeRequest("get", "getStatusStatistic", undefined, {idMessage: params.idMessage});
	}

	/**
	 * Gets incoming status messages from contacts (Beta feature).
	 * Returns statuses that were received by the current WhatsApp account.
	 * By default, returns incoming statuses for the last 24 hours (1440 minutes).
	 * Statuses can only be received from numbers in the contact list and are stored for 30 days.
	 *
	 * @param params - Optional parameters to specify time period in minutes
	 * @returns Promise resolving to an array of incoming status messages
	 *
	 * @example
	 * ```typescript
	 * // Get statuses from last 24 hours (default)
	 * const statuses = await client.getIncomingStatuses();
	 *
	 * // Get statuses from last hour
	 * const recentStatuses = await client.getIncomingStatuses({ minutes: 60 });
	 *
	 * statuses.forEach(status => {
	 *   if (status.typeMessage === "extendedTextMessage") {
	 *     console.log(`Text status from ${status.senderName}: ${status.textMessage}`);
	 *   } else {
	 *     console.log(`Media status from ${status.senderName}: ${status.downloadUrl}`);
	 *   }
	 * });
	 * ```
	 */
	async getIncomingStatuses(params?: GetIncomingStatusesParams): Promise<IncomingStatusMessage[]> {
		const queryParams = params?.minutes ? {minutes: params.minutes} : undefined;
		return this.makeRequest("get", "getIncomingStatuses", undefined, queryParams);
	}

	/**
	 * Gets outgoing status messages sent by the current account (Beta feature).
	 * By default, returns outgoing statuses for the last 24 hours (1440 minutes).
	 * Requires the "Receive webhooks on sent messages statuses" setting to be enabled.
	 * Statuses are stored in journals for 30 days from the date of their sending.
	 *
	 * @param params - Optional parameters to specify time period in minutes
	 * @returns Promise resolving to an array of outgoing status messages
	 *
	 * @example
	 * ```typescript
	 * // Get statuses from last 24 hours (default)
	 * const statuses = await client.getOutgoingStatuses();
	 *
	 * // Get statuses from last hour
	 * const recentStatuses = await client.getOutgoingStatuses({ minutes: 60 });
	 *
	 * statuses.forEach(status => {
	 *   if (status.typeMessage === "extendedTextMessage") {
	 *     console.log(`Text status: ${status.textMessage} - ${status.statusMessage}`);
	 *   } else {
	 *     console.log(`Media status: ${status.downloadUrl} - ${status.statusMessage}`);
	 *   }
	 * });
	 * ```
	 */
	async getOutgoingStatuses(params?: GetOutgoingStatusesParams): Promise<OutgoingStatusMessage[]> {
		const queryParams = params?.minutes ? {minutes: params.minutes} : undefined;
		return this.makeRequest("get", "getOutgoingStatuses", undefined, queryParams);
	}
}
