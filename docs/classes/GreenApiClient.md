[**GREEN-API WhatsApp SDK v2 v1.0.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / GreenApiClient

# Class: GreenApiClient

Defined in: [client/green-api-client.ts:97](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L97)

Client for direct interaction with GREEN-API's WhatsApp gateway.
Provides methods for sending messages, managing instances, and handling files.
For more information about the methods, refer to https://green-api.com/en/docs

## Example

```typescript
const client = new GreenApiClient({
  idInstance: 12345,
  apiTokenInstance: "your-token"
});

await client.sendMessage({
  chatId: "1234567890@c.us",
  message: "Hello from GREEN-API!"
});
```

## Extends

- `BaseClient`

## Constructors

### Constructor

> **new GreenApiClient**(`instance`): `GreenApiClient`

Defined in: [client/green-api-client.ts:103](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L103)

Creates a GREEN-API client instance.

#### Parameters

##### instance

[`Instance`](../interfaces/Instance.md)

Configuration containing idInstance and apiTokenInstance

#### Returns

`GreenApiClient`

#### Overrides

`BaseClient.constructor`

## Methods

### addGroupParticipant()

> **addGroupParticipant**(`params`): `Promise`\<[`AddGroupParticipantResponse`](../interfaces/AddGroupParticipantResponse.md)\>

Defined in: [client/green-api-client.ts:684](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L684)

Adds a participant to a group chat.
Note: Only group administrators can add members.
The participant's number should be saved in the phonebook for reliable addition.

#### Parameters

##### params

[`AddGroupParticipant`](../interfaces/AddGroupParticipant.md)

Parameters containing group ID and participant ID

#### Returns

`Promise`\<[`AddGroupParticipantResponse`](../interfaces/AddGroupParticipantResponse.md)\>

Promise resolving to addition status

***

### archiveChat()

> **archiveChat**(`params`): `Promise`\<`void`\>

Defined in: [client/green-api-client.ts:562](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L562)

Archives a chat. Chat must have at least one incoming message.
Note: "Receive webhooks on incoming messages and files" setting must be enabled.

#### Parameters

##### params

[`ArchiveChat`](../interfaces/ArchiveChat.md)

Parameters containing the chat ID to archive

#### Returns

`Promise`\<`void`\>

Promise resolving to void on success

***

### checkWhatsapp()

> **checkWhatsapp**(`params`): `Promise`\<[`CheckWhatsappResponse`](../interfaces/CheckWhatsappResponse.md)\>

Defined in: [client/green-api-client.ts:518](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L518)

Checks WhatsApp account availability on a phone number.

#### Parameters

##### params

[`CheckWhatsapp`](../interfaces/CheckWhatsapp.md)

Parameters containing the phone number to check

#### Returns

`Promise`\<[`CheckWhatsappResponse`](../interfaces/CheckWhatsappResponse.md)\>

Promise resolving to WhatsApp availability status

#### Throws

If phone number is invalid

#### Example

```typescript
const result = await client.checkWhatsapp({
  phoneNumber: 11001234567
});

if (result.existsWhatsapp) {
  console.log('WhatsApp account exists');
}
```

***

### clearMessagesQueue()

> **clearMessagesQueue**(): `Promise`\<[`ClearMessagesQueue`](../interfaces/ClearMessagesQueue.md)\>

Defined in: [client/green-api-client.ts:466](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L466)

Clears the queue of messages waiting to be sent.
Important when switching phone numbers to prevent sending queued messages with the new number.

#### Returns

`Promise`\<[`ClearMessagesQueue`](../interfaces/ClearMessagesQueue.md)\>

Promise resolving to queue clearing status

#### Example

```typescript
const result = await client.clearMessagesQueue();
if (result.isCleared) {
  console.log('Queue successfully cleared');
}
```

***

### createGroup()

> **createGroup**(`params`): `Promise`\<[`CreateGroupResponse`](../interfaces/CreateGroupResponse.md)\>

Defined in: [client/green-api-client.ts:651](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L651)

Creates a group chat.
Note: Limited to creating 1 group per 5 minutes to simulate human behavior.

#### Parameters

##### params

[`CreateGroup`](../interfaces/CreateGroup.md)

Parameters containing group name and participant IDs

#### Returns

`Promise`\<[`CreateGroupResponse`](../interfaces/CreateGroupResponse.md)\>

Promise resolving to group creation result

***

### deleteMessage()

> **deleteMessage**(`params`): `Promise`\<`void`\>

Defined in: [client/green-api-client.ts:636](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L636)

Deletes a message from a chat.

#### Parameters

##### params

[`DeleteMessageRequest`](../interfaces/DeleteMessageRequest.md)

Parameters containing chat ID, message ID and deletion options

#### Returns

`Promise`\<`void`\>

Promise resolving to void on success

#### Example

```typescript
// Delete message for everyone
await client.deleteMessage({
  chatId: "1234567890@c.us",
  idMessage: "BAE5F4886F6F2D05"
});

// Delete message only for sender
await client.deleteMessage({
  chatId: "1234567890@c.us",
  idMessage: "BAE5F4886F6F2D05",
  onlySenderDelete: true
});
```

***

### deleteNotification()

> **deleteNotification**(`receiptId`): `Promise`\<[`DeleteNotificationResponse`](../interfaces/DeleteNotificationResponse.md)\>

Defined in: [client/green-api-client.ts:846](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L846)

Deletes an incoming notification from the notification queue.
After calling this method, the notification is considered processed and permanently deleted.

#### Parameters

##### receiptId

`number`

Receipt ID of the notification to delete

#### Returns

`Promise`\<[`DeleteNotificationResponse`](../interfaces/DeleteNotificationResponse.md)\>

Promise resolving to deletion result

#### Example

```typescript
const result = await client.deleteNotification(1234567);
console.log(result.result); // true if successfully deleted
```

***

### deleteStatus()

> **deleteStatus**(`params`): `Promise`\<`void`\>

Defined in: [client/green-api-client.ts:980](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L980)

Deletes a previously sent status (Beta feature).

#### Parameters

##### params

[`DeleteStatus`](../interfaces/DeleteStatus.md)

Parameters containing the ID of the status to delete

#### Returns

`Promise`\<`void`\>

Promise resolving to void on successful deletion

#### Example

```typescript
await client.deleteStatus({
  idMessage: "BAE5F4886F6F2D05"
});
```

***

### downloadFile()

> **downloadFile**(`params`): `Promise`\<[`DownloadFileResponse`](../interfaces/DownloadFileResponse.md)\>

Defined in: [client/green-api-client.ts:868](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L868)

Downloads a file from a message.
Files are stored for a limited time by WhatsApp.

#### Parameters

##### params

[`DownloadFileRequest`](../interfaces/DownloadFileRequest.md)

Parameters containing chat ID and message ID

#### Returns

`Promise`\<[`DownloadFileResponse`](../interfaces/DownloadFileResponse.md)\>

Promise resolving to download URL

#### Example

```typescript
const file = await client.downloadFile({
  chatId: "1234567890@c.us",
  idMessage: "A322F800D3F12CD4858CC947DAFB77A2"
});
console.log(file.downloadUrl);
```

***

### editMessage()

> **editMessage**(`params`): `Promise`\<[`EditMessageResponse`](../interfaces/EditMessageResponse.md)\>

Defined in: [client/green-api-client.ts:607](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L607)

Edits a text message in a personal or group chat.
WhatsApp imposes the following restrictions:
- There is a 15-minute time limit for editing messages
- Editing a message won't send a new chat notification
- You can't edit photos, videos, or other types of media

#### Parameters

##### params

[`EditMessageRequest`](../interfaces/EditMessageRequest.md)

Parameters containing chat ID, message ID and new text

#### Returns

`Promise`\<[`EditMessageResponse`](../interfaces/EditMessageResponse.md)\>

Promise resolving to edited message ID

#### Example

```typescript
const result = await client.editMessage({
  chatId: "1234567890@c.us",
  idMessage: "BAE5367237E13A87",
  message: "Edited message text"
});
console.log('Edited message ID:', result.idMessage);
```

***

### forwardMessages()

> **forwardMessages**(`request`): `Promise`\<[`ForwardMessagesResponse`](../interfaces/ForwardMessagesResponse.md)\>

Defined in: [client/green-api-client.ts:250](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L250)

Forwards messages from one chat to another.

#### Parameters

##### request

[`ForwardMessages`](../interfaces/ForwardMessages.md)

Forward request with source and target chat IDs

#### Returns

`Promise`\<[`ForwardMessagesResponse`](../interfaces/ForwardMessagesResponse.md)\>

Promise resolving to forward response

#### Example

```typescript
await client.forwardMessages({
  chatId: "1234567890@c.us", // Destination chat
  chatIdFrom: "9876543210@c.us", // Source chat
  messages: ["message-id-1", "message-id-2"]
});
```

***

### getAuthorizationCode()

> **getAuthorizationCode**(`phoneNumber`): `Promise`\<[`GetAuthorizationCode`](../interfaces/GetAuthorizationCode.md)\>

Defined in: [client/green-api-client.ts:426](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L426)

Gets authorization code for a phone number.

#### Parameters

##### phoneNumber

`number`

Phone number to get code for

#### Returns

`Promise`\<[`GetAuthorizationCode`](../interfaces/GetAuthorizationCode.md)\>

Promise resolving to authorization code response

#### Throws

If phone number is invalid

***

### getAvatar()

> **getAvatar**(`params`): `Promise`\<[`GetAvatarResponse`](../interfaces/GetAvatarResponse.md)\>

Defined in: [client/green-api-client.ts:529](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L529)

Gets a user or group chat avatar.

#### Parameters

##### params

[`GetAvatar`](../interfaces/GetAvatar.md)

Parameters containing the chat ID

#### Returns

`Promise`\<[`GetAvatarResponse`](../interfaces/GetAvatarResponse.md)\>

Promise resolving to avatar information

***

### getChatHistory()

> **getChatHistory**(`params`): `Promise`\<[`JournalResponse`](../type-aliases/JournalResponse.md)[]\>

Defined in: [client/green-api-client.ts:767](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L767)

Gets chat message history.
Note: Requires "Receive webhooks" setting to be enabled.
Messages can take up to 2 minutes to appear in history.

#### Parameters

##### params

[`GetChatHistory`](../interfaces/GetChatHistory.md)

Parameters containing chat ID and optional message count

#### Returns

`Promise`\<[`JournalResponse`](../type-aliases/JournalResponse.md)[]\>

Promise resolving to array of messages

***

### getContactInfo()

> **getContactInfo**(`params`): `Promise`\<[`ContactInfo`](../interfaces/ContactInfo.md)\>

Defined in: [client/green-api-client.ts:551](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L551)

Gets detailed information about a contact.
Note: This method does not support group chats, use getGroupData for groups.

#### Parameters

##### params

[`GetAvatar`](../interfaces/GetAvatar.md)

Parameters containing the chat ID

#### Returns

`Promise`\<[`ContactInfo`](../interfaces/ContactInfo.md)\>

Promise resolving to contact information

***

### getContacts()

> **getContacts**(): `Promise`\<[`Contact`](../interfaces/Contact.md)[]\>

Defined in: [client/green-api-client.ts:540](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L540)

Gets a list of the current account contacts.
Note: Contact information updates can take up to 5 minutes.
If an empty array is received, retry the method call.

#### Returns

`Promise`\<[`Contact`](../interfaces/Contact.md)[]\>

Promise resolving to array of contacts

***

### getGroupData()

> **getGroupData**(`params`): `Promise`\<[`GroupData`](../interfaces/GroupData.md)\>

Defined in: [client/green-api-client.ts:672](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L672)

Gets group chat data.
Note: groupInviteLink will be empty if user is not an admin or owner.

#### Parameters

##### params

[`GetGroupData`](../interfaces/GetGroupData.md)

Parameters containing group ID

#### Returns

`Promise`\<[`GroupData`](../interfaces/GroupData.md)\>

Promise resolving to group data

***

### getIncomingStatuses()

> **getIncomingStatuses**(`params`?): `Promise`\<[`IncomingStatusMessage`](../type-aliases/IncomingStatusMessage.md)[]\>

Defined in: [client/green-api-client.ts:1034](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L1034)

Gets incoming status messages from contacts (Beta feature).
Returns statuses that were received by the current WhatsApp account.
By default, returns incoming statuses for the last 24 hours (1440 minutes).
Statuses can only be received from numbers in the contact list and are stored for 30 days.

#### Parameters

##### params?

[`GetIncomingStatusesParams`](../interfaces/GetIncomingStatusesParams.md)

Optional parameters to specify time period in minutes

#### Returns

`Promise`\<[`IncomingStatusMessage`](../type-aliases/IncomingStatusMessage.md)[]\>

Promise resolving to an array of incoming status messages

#### Example

```typescript
// Get statuses from last 24 hours (default)
const statuses = await client.getIncomingStatuses();

// Get statuses from last hour
const recentStatuses = await client.getIncomingStatuses({ minutes: 60 });

statuses.forEach(status => {
  if (status.typeMessage === "extendedTextMessage") {
    console.log(`Text status from ${status.senderName}: ${status.textMessage}`);
  } else {
    console.log(`Media status from ${status.senderName}: ${status.downloadUrl}`);
  }
});
```

***

### getMessage()

> **getMessage**(`params`): `Promise`\<[`JournalResponse`](../type-aliases/JournalResponse.md)\>

Defined in: [client/green-api-client.ts:755](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L755)

Gets details of a specific message.
Note: To receive incoming webhooks, requires "Receive webhooks on incoming messages and files" setting to be enabled.
Note: To receive statuses of sent messsages, requires "Receive notifications about the statuses of sent messages" to be enabled.
Messages can take up to 2 minutes to appear in the journal.

#### Parameters

##### params

[`GetMessage`](../interfaces/GetMessage.md)

Parameters containing chat ID and message ID

#### Returns

`Promise`\<[`JournalResponse`](../type-aliases/JournalResponse.md)\>

Promise resolving to message details

***

### getOutgoingStatuses()

> **getOutgoingStatuses**(`params`?): `Promise`\<[`OutgoingStatusMessage`](../type-aliases/OutgoingStatusMessage.md)[]\>

Defined in: [client/green-api-client.ts:1065](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L1065)

Gets outgoing status messages sent by the current account (Beta feature).
By default, returns outgoing statuses for the last 24 hours (1440 minutes).
Requires the "Receive webhooks on sent messages statuses" setting to be enabled.
Statuses are stored in journals for 30 days from the date of their sending.

#### Parameters

##### params?

[`GetOutgoingStatusesParams`](../interfaces/GetOutgoingStatusesParams.md)

Optional parameters to specify time period in minutes

#### Returns

`Promise`\<[`OutgoingStatusMessage`](../type-aliases/OutgoingStatusMessage.md)[]\>

Promise resolving to an array of outgoing status messages

#### Example

```typescript
// Get statuses from last 24 hours (default)
const statuses = await client.getOutgoingStatuses();

// Get statuses from last hour
const recentStatuses = await client.getOutgoingStatuses({ minutes: 60 });

statuses.forEach(status => {
  if (status.typeMessage === "extendedTextMessage") {
    console.log(`Text status: ${status.textMessage} - ${status.statusMessage}`);
  } else {
    console.log(`Media status: ${status.downloadUrl} - ${status.statusMessage}`);
  }
});
```

***

### getQR()

> **getQR**(): `Promise`\<[`QR`](../interfaces/QR.md)\>

Defined in: [client/green-api-client.ts:375](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L375)

Gets the QR code for GREEN-API instance authentication.

#### Returns

`Promise`\<[`QR`](../interfaces/QR.md)\>

Promise resolving to QR code data

***

### getSettings()

> **getSettings**(): `Promise`\<[`Settings`](../interfaces/Settings.md)\>

Defined in: [client/green-api-client.ts:384](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L384)

Gets current instance settings.

#### Returns

`Promise`\<[`Settings`](../interfaces/Settings.md)\>

Promise resolving to settings object

***

### getStateInstance()

> **getStateInstance**(): `Promise`\<[`StateInstance`](../interfaces/StateInstance.md)\>

Defined in: [client/green-api-client.ts:366](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L366)

Gets the current state of the GREEN-API instance.

#### Returns

`Promise`\<[`StateInstance`](../interfaces/StateInstance.md)\>

Promise resolving to instance state

***

### getStatusStatistic()

> **getStatusStatistic**(`params`): `Promise`\<[`GetStatusStatisticResponse`](../type-aliases/GetStatusStatisticResponse.md)\>

Defined in: [client/green-api-client.ts:1004](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L1004)

Gets statistics for a previously sent status (Beta feature).
Returns an array of recipients with sent/delivered/read statuses.
Statistics on statuses are stored for 30 days from the date of their receipt.
Requires the "Receive webhooks on sent messages statuses" setting to be enabled.

#### Parameters

##### params

[`GetStatusStatistic`](../interfaces/GetStatusStatistic.md)

Parameters containing the ID of the status to get statistics for

#### Returns

`Promise`\<[`GetStatusStatisticResponse`](../type-aliases/GetStatusStatisticResponse.md)\>

Promise resolving to an array of status statistics

#### Example

```typescript
const statistics = await client.getStatusStatistic({
  idMessage: "BAE5F4886F6F2D05"
});

statistics.forEach(stat => {
  console.log(`${stat.participant}: ${stat.status} at ${new Date(stat.timestamp * 1000)}`);
});
```

***

### getWaSettings()

> **getWaSettings**(): `Promise`\<[`WaSettings`](../interfaces/WaSettings.md)\>

Defined in: [client/green-api-client.ts:403](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L403)

Gets WhatsApp-specific settings.

#### Returns

`Promise`\<[`WaSettings`](../interfaces/WaSettings.md)\>

Promise resolving to WhatsApp settings

***

### lastIncomingMessages()

> **lastIncomingMessages**(`minutes`?): `Promise`\<[`IncomingJournalResponse`](../type-aliases/IncomingJournalResponse.md)[]\>

Defined in: [client/green-api-client.ts:780](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L780)

Gets last incoming messages for the specified time period.
Default is 24 hours (1440 minutes).
Note: Requires "Receive webhooks" setting to be enabled.
Messages can take up to 2 minutes to appear in history.

#### Parameters

##### minutes?

`number`

Optional time period in minutes

#### Returns

`Promise`\<[`IncomingJournalResponse`](../type-aliases/IncomingJournalResponse.md)[]\>

Promise resolving to array of incoming messages

***

### lastOutgoingMessages()

> **lastOutgoingMessages**(`minutes`?): `Promise`\<[`OutgoingJournalResponse`](../type-aliases/OutgoingJournalResponse.md)[]\>

Defined in: [client/green-api-client.ts:793](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L793)

Gets last outgoing messages for the specified time period.
Default is 24 hours (1440 minutes).
Note: Requires "Receive webhooks" setting to be enabled.
Messages can take up to 2 minutes to appear in history.

#### Parameters

##### minutes?

`number`

Optional time period in minutes

#### Returns

`Promise`\<[`OutgoingJournalResponse`](../type-aliases/OutgoingJournalResponse.md)[]\>

Promise resolving to array of outgoing messages

***

### leaveGroup()

> **leaveGroup**(`params`): `Promise`\<[`LeaveGroupResponse`](../interfaces/LeaveGroupResponse.md)\>

Defined in: [client/green-api-client.ts:738](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L738)

Makes the current account leave a group chat.

#### Parameters

##### params

[`LeaveGroup`](../interfaces/LeaveGroup.md)

Parameters containing the group ID to leave

#### Returns

`Promise`\<[`LeaveGroupResponse`](../interfaces/LeaveGroupResponse.md)\>

Promise resolving to leave status

***

### logout()

> **logout**(): `Promise`\<[`Logout`](../interfaces/Logout.md)\>

Defined in: [client/green-api-client.ts:357](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L357)

Logs out from the GREEN-API instance.

#### Returns

`Promise`\<[`Logout`](../interfaces/Logout.md)\>

Promise resolving to logout status

***

### readChat()

> **readChat**(`params`): `Promise`\<[`ReadChatResponse`](../interfaces/ReadChatResponse.md)\>

Defined in: [client/green-api-client.ts:496](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L496)

Marks messages in a chat as read.
For this to work, "Receive webhooks on incoming messages and files" setting must be enabled.
Note: Only messages received after enabling the setting can be marked as read.

#### Parameters

##### params

[`ReadChat`](../interfaces/ReadChat.md)

Parameters specifying which messages to mark as read

#### Returns

`Promise`\<[`ReadChatResponse`](../interfaces/ReadChatResponse.md)\>

Promise resolving to read status

#### Example

```typescript
// Mark all messages in chat as read
const result = await client.readChat({
  chatId: "1234567890@c.us"
});

// Mark specific message as read
const result = await client.readChat({
  chatId: "1234567890@c.us",
  idMessage: "B275A7AA0D6EF89BB9245169BDF174E6"
});
```

***

### reboot()

> **reboot**(): `Promise`\<[`Reboot`](../interfaces/Reboot.md)\>

Defined in: [client/green-api-client.ts:348](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L348)

Reboots the GREEN-API instance.

#### Returns

`Promise`\<[`Reboot`](../interfaces/Reboot.md)\>

Promise resolving to reboot status

***

### receiveNotification()

> **receiveNotification**(`timeout`?): `Promise`\<`null` \| [`ReceiveNotificationResponse`](../interfaces/ReceiveNotificationResponse.md)\>

Defined in: [client/green-api-client.ts:820](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L820)

Receives one incoming notification from the notification queue.
The method waits for a notification for the specified timeout period (default 5 seconds).
After receiving a notification, you need to delete it using deleteNotification method.
Notifications are stored in the queue for 24 hours and sent in FIFO order.

#### Parameters

##### timeout?

`number`

Optional timeout in seconds (5-60, default 5)

#### Returns

`Promise`\<`null` \| [`ReceiveNotificationResponse`](../interfaces/ReceiveNotificationResponse.md)\>

Promise resolving to notification data with receipt ID, or null if no notification is available

#### Example

```typescript
const notification = await client.receiveNotification(30);
if (notification) {
  // Process notification
  // Then delete it from queue
  await client.deleteNotification(notification.receiptId);
}
```

***

### removeAdmin()

> **removeAdmin**(`params`): `Promise`\<[`RemoveAdminResponse`](../interfaces/RemoveAdminResponse.md)\>

Defined in: [client/green-api-client.ts:714](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L714)

Removes administrator rights from a group chat participant.

#### Parameters

##### params

[`RemoveAdmin`](../interfaces/RemoveAdmin.md)

Parameters containing group ID and participant ID to demote

#### Returns

`Promise`\<[`RemoveAdminResponse`](../interfaces/RemoveAdminResponse.md)\>

Promise resolving to admin removal status

***

### removeGroupParticipant()

> **removeGroupParticipant**(`params`): `Promise`\<[`RemoveGroupParticipantResponse`](../interfaces/RemoveGroupParticipantResponse.md)\>

Defined in: [client/green-api-client.ts:694](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L694)

Removes a participant from a group chat.

#### Parameters

##### params

[`RemoveGroupParticipant`](../interfaces/RemoveGroupParticipant.md)

Parameters containing group ID and participant ID to remove

#### Returns

`Promise`\<[`RemoveGroupParticipantResponse`](../interfaces/RemoveGroupParticipantResponse.md)\>

Promise resolving to removal status

***

### sendContact()

> **sendContact**(`message`): `Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Defined in: [client/green-api-client.ts:304](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L304)

Sends a contact card to a WhatsApp chat.

#### Parameters

##### message

[`SendContact`](../interfaces/SendContact.md)

Contact data

#### Returns

`Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Promise resolving to send response

#### Example

```typescript
await client.sendContact({
  chatId: "1234567890@c.us",
  contact: {
    phoneContact: 1234567890,
    firstName: "John",
    lastName: "Doe"
  }
});
```

***

### sendFileByUpload()

> **sendFileByUpload**(`message`): `Promise`\<[`SendFileByUploadResponse`](../interfaces/SendFileByUploadResponse.md)\>

Defined in: [client/green-api-client.ts:198](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L198)

Sends a file from local data to a WhatsApp chat.

#### Parameters

##### message

[`SendFileByUpload`](../interfaces/SendFileByUpload.md)

Message data containing chat ID and file data

#### Returns

`Promise`\<[`SendFileByUploadResponse`](../interfaces/SendFileByUploadResponse.md)\>

Promise resolving to send response with file URL

#### Example

```typescript
await client.sendFileByUpload({
  chatId: "1234567890@c.us",
  file: {
    data: fileBlob,
    fileName: "image.jpg"
  },
  caption: "Check this image"
});
```

***

### sendFileByUrl()

> **sendFileByUrl**(`message`): `Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Defined in: [client/green-api-client.ts:170](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L170)

Sends a file from a URL to a WhatsApp chat.

#### Parameters

##### message

[`SendFileByUrl`](../interfaces/SendFileByUrl.md)

Message data containing chat ID and file URL

#### Returns

`Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Promise resolving to send response

#### Example

```typescript
await client.sendFileByUrl({
  chatId: "1234567890@c.us",
  file: {
    url: "https://example.com/file.pdf",
    fileName: "document.pdf"
  },
  caption: "Check this file" // Optional
});
```

***

### sendLocation()

> **sendLocation**(`message`): `Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Defined in: [client/green-api-client.ts:275](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L275)

Sends a location to a WhatsApp chat.

#### Parameters

##### message

[`SendLocation`](../interfaces/SendLocation.md)

Location data with coordinates

#### Returns

`Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Promise resolving to send response

#### Example

```typescript
await client.sendLocation({
  chatId: "1234567890@c.us",
  latitude: 51.5074,
  longitude: -0.1278,
  nameLocation: "London",
  address: "London, UK"
});
```

***

### sendMediaStatus()

> **sendMediaStatus**(`params`): `Promise`\<[`SendMediaStatusResponse`](../interfaces/SendMediaStatusResponse.md)\>

Defined in: [client/green-api-client.ts:954](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L954)

Sends a picture or video status update to WhatsApp (Beta feature).
The status will be added to the queue and kept for 24 hours until the instance is authorized.
Videos longer than one minute will be cut, and the recommended image aspect ratio is 9:16 (vertical).
For recipients to see the status, both parties must save each other's numbers in their contact lists.

#### Parameters

##### params

[`SendMediaStatus`](../interfaces/SendMediaStatus.md)

Media status parameters including file URL, name, caption, and recipient list

#### Returns

`Promise`\<[`SendMediaStatusResponse`](../interfaces/SendMediaStatusResponse.md)\>

Promise resolving to status send response with message ID

#### Example

```typescript
await client.sendMediaStatus({
  urlFile: "https://my.site.com/img/picture.png",
  fileName: "picture.png",
  caption: "Check this out!",
  participants: ["70000001234@c.us"] // Optional: limit visibility to specific contacts
});
```

***

### sendMessage()

> **sendMessage**(`message`): `Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Defined in: [client/green-api-client.ts:143](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L143)

Sends a text message to a WhatsApp chat.

#### Parameters

##### message

[`SendMessage`](../interfaces/SendMessage.md)

Message data containing chat ID and text

#### Returns

`Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Promise resolving to send response with message ID

#### Example

```typescript
await client.sendMessage({
  chatId: "1234567890@c.us",
  message: "Hello!",
  quotedMessageId: "12345" // Optional: reply to a message
});
```

***

### sendPoll()

> **sendPoll**(`message`): `Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Defined in: [client/green-api-client.ts:225](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L225)

Creates a poll in a WhatsApp chat.

#### Parameters

##### message

[`SendPoll`](../interfaces/SendPoll.md)

Poll data with question and options

#### Returns

`Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Promise resolving to send response

#### Example

```typescript
await client.sendPoll({
  chatId: "1234567890@c.us",
  message: "What's your favorite color?",
  options: [{ optionName: "Red" }, { optionName: "Blue" }, { optionName: "Green" }],
  multipleAnswers: false
});
```

***

### sendTextStatus()

> **sendTextStatus**(`params`): `Promise`\<[`SendTextStatusResponse`](../interfaces/SendTextStatusResponse.md)\>

Defined in: [client/green-api-client.ts:894](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L894)

Sends a text status update to WhatsApp (Beta feature).
The status will be added to the queue and kept for 24 hours until the instance is authorized.
For recipients to see the status, both parties must save each other's numbers in their contact lists.

#### Parameters

##### params

[`SendTextStatus`](../interfaces/SendTextStatus.md)

Text status parameters including message, styling, and recipient list

#### Returns

`Promise`\<[`SendTextStatusResponse`](../interfaces/SendTextStatusResponse.md)\>

Promise resolving to status send response with message ID

#### Example

```typescript
await client.sendTextStatus({
  message: "I use Green-API to send this Status!",
  backgroundColor: "#228B22", // Use any color except white
  font: "SERIF",
  participants: ["70000001234@c.us"] // Optional: limit visibility to specific contacts
});
```

***

### sendVoiceStatus()

> **sendVoiceStatus**(`params`): `Promise`\<[`SendVoiceStatusResponse`](../interfaces/SendVoiceStatusResponse.md)\>

Defined in: [client/green-api-client.ts:926](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L926)

Sends a voice status update to WhatsApp (Beta feature).
The status will be added to the queue and kept for 24 hours until the instance is authorized.
Recommended audio format is MP3, and audio longer than one minute will be cut.
For recipients to see the status, both parties must save each other's numbers in their contact lists.

#### Parameters

##### params

[`SendVoiceStatus`](../interfaces/SendVoiceStatus.md)

Voice status parameters including file URL, name, styling, and recipient list

#### Returns

`Promise`\<[`SendVoiceStatusResponse`](../interfaces/SendVoiceStatusResponse.md)\>

Promise resolving to status send response with message ID

#### Example

```typescript
await client.sendVoiceStatus({
  urlFile: "https://my.site.com/audio/voice.mp3",
  fileName: "voice.mp3",
  backgroundColor: "#228B22",
  participants: ["70000001234@c.us"] // Optional: limit visibility to specific contacts
});
```

***

### setDisappearingChat()

> **setDisappearingChat**(`params`): `Promise`\<[`SetDisappearingChatResponse`](../interfaces/SetDisappearingChatResponse.md)\>

Defined in: [client/green-api-client.ts:583](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L583)

Changes settings of disappearing messages in chats.
Valid expiration times: 0 (off), 86400 (24h), 604800 (7d), 7776000 (90d)

#### Parameters

##### params

[`SetDisappearingChat`](../interfaces/SetDisappearingChat.md)

Parameters containing chat ID and message expiration time

#### Returns

`Promise`\<[`SetDisappearingChatResponse`](../interfaces/SetDisappearingChatResponse.md)\>

Promise resolving to chat disappearing message settings

***

### setGroupAdmin()

> **setGroupAdmin**(`params`): `Promise`\<[`SetGroupAdminResponse`](../interfaces/SetGroupAdminResponse.md)\>

Defined in: [client/green-api-client.ts:704](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L704)

Sets a group chat participant as an administrator.

#### Parameters

##### params

[`SetGroupAdmin`](../interfaces/SetGroupAdmin.md)

Parameters containing group ID and participant ID to promote

#### Returns

`Promise`\<[`SetGroupAdminResponse`](../interfaces/SetGroupAdminResponse.md)\>

Promise resolving to admin status change result

***

### setGroupPicture()

> **setGroupPicture**(`params`): `Promise`\<[`SetGroupPictureResponse`](../interfaces/SetGroupPictureResponse.md)\>

Defined in: [client/green-api-client.ts:724](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L724)

Sets a group chat picture.

#### Parameters

##### params

[`SetGroupPicture`](../interfaces/SetGroupPicture.md)

Parameters containing group ID and picture file (jpg)

#### Returns

`Promise`\<[`SetGroupPictureResponse`](../interfaces/SetGroupPictureResponse.md)\>

Promise resolving to picture update status

***

### setProfilePicture()

> **setProfilePicture**(`file`): `Promise`\<[`SetProfilePicture`](../interfaces/SetProfilePicture.md)\>

Defined in: [client/green-api-client.ts:413](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L413)

Sets the profile picture for the WhatsApp account.

#### Parameters

##### file

Image file to use as profile picture

`Blob` | `File`

#### Returns

`Promise`\<[`SetProfilePicture`](../interfaces/SetProfilePicture.md)\>

Promise resolving to profile picture update response

***

### setSettings()

> **setSettings**(`settings`): `Promise`\<[`SetSettingsResponse`](../interfaces/SetSettingsResponse.md)\>

Defined in: [client/green-api-client.ts:394](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L394)

Updates instance settings.

#### Parameters

##### settings

[`Settings`](../interfaces/Settings.md)

New settings to apply

#### Returns

`Promise`\<[`SetSettingsResponse`](../interfaces/SetSettingsResponse.md)\>

Promise resolving to settings update response

***

### showMessagesQueue()

> **showMessagesQueue**(): `Promise`\<[`QueueMessage`](../interfaces/QueueMessage.md)[]\>

Defined in: [client/green-api-client.ts:448](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L448)

Gets the list of messages in the sending queue.
Messages are stored for 24 hours and will be sent immediately after phone authorization.
The sending speed is regulated by the Message Sending Interval parameter.

#### Returns

`Promise`\<[`QueueMessage`](../interfaces/QueueMessage.md)[]\>

Promise resolving to an array of queued messages

#### Example

```typescript
const queuedMessages = await client.showMessagesQueue();
console.log(queuedMessages);
```

***

### unarchiveChat()

> **unarchiveChat**(`params`): `Promise`\<`void`\>

Defined in: [client/green-api-client.ts:572](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L572)

Unarchives a chat.

#### Parameters

##### params

[`UnarchiveChat`](../interfaces/UnarchiveChat.md)

Parameters containing the chat ID to unarchive

#### Returns

`Promise`\<`void`\>

Promise resolving to void on success

***

### updateGroupName()

> **updateGroupName**(`params`): `Promise`\<[`UpdateGroupNameResponse`](../interfaces/UpdateGroupNameResponse.md)\>

Defined in: [client/green-api-client.ts:661](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L661)

Changes a group chat name.

#### Parameters

##### params

[`UpdateGroupName`](../interfaces/UpdateGroupName.md)

Parameters containing group ID and new name

#### Returns

`Promise`\<[`UpdateGroupNameResponse`](../interfaces/UpdateGroupNameResponse.md)\>

Promise resolving to update status

***

### uploadFile()

> **uploadFile**(`file`, `customFileName`?): `Promise`\<[`UploadFile`](../interfaces/UploadFile.md)\>

Defined in: [client/green-api-client.ts:319](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/client/green-api-client.ts#L319)

Uploads a file to GREEN-API servers.

#### Parameters

##### file

File to upload

`Blob` | `File`

##### customFileName?

`string`

Optional custom name for the file

#### Returns

`Promise`\<[`UploadFile`](../interfaces/UploadFile.md)\>

Promise resolving to upload response with file URL
