[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / GreenApiClient

# Class: GreenApiClient

Defined in: [client/green-api-client.ts:125](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L125)

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

Defined in: [client/green-api-client.ts:131](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L131)

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

### addContact()

> **addContact**(`params`): `Promise`\<[`AddContactResponse`](../interfaces/AddContactResponse.md)\>

Defined in: [client/green-api-client.ts:1524](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1524)

Adds contact.

#### Parameters

##### params

[`AddContact`](../interfaces/AddContact.md)

Contact data containing chat ID and name

#### Returns

`Promise`\<[`AddContactResponse`](../interfaces/AddContactResponse.md)\>

Promise resolving to add contact response

#### Example

```typescript
await client.addContact({
  chatId: "1234567890@c.us",
  firstName: "John",
  lastName: "Doe"
});
```

***

### addGroupParticipant()

> **addGroupParticipant**(`params`): `Promise`\<[`AddGroupParticipantResponse`](../interfaces/AddGroupParticipantResponse.md)\>

Defined in: [client/green-api-client.ts:922](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L922)

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

Defined in: [client/green-api-client.ts:750](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L750)

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

### callsAccept()

> **callsAccept**(): `Promise`\<[`CallIdResponse`](../interfaces/CallIdResponse.md)\>

Defined in: [client/green-api-client.ts:1128](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1128)

Accepts the incoming call.

#### Returns

`Promise`\<[`CallIdResponse`](../interfaces/CallIdResponse.md)\>

Promise resolving to the call ID

#### Throws

NO_INCOMING_CALL and others

***

### callsDial()

> **callsDial**(`params`): `Promise`\<[`CallIdResponse`](../interfaces/CallIdResponse.md)\>

Defined in: [client/green-api-client.ts:1118](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1118)

Starts an outgoing voice call. Without the call audio (connectCalls) the call connects but nobody hears anything.
Outgoing calls work only to chats that wrote or called the instance in the last 72 hours.

#### Parameters

##### params

[`CallsDial`](../interfaces/CallsDial.md)

Chat ID of the person to call, 79001234567@c.us or 123456789012345@lid

#### Returns

`Promise`\<[`CallIdResponse`](../interfaces/CallIdResponse.md)\>

Promise resolving to the call ID, the same as idMessage in the call webhooks

#### Throws

INVALID_CHAT_ID, NO_RECENT_CONTACT, ALREADY_IN_CALL, NOT_IN_TARIFF, INVALID_CREDENTIALS and others

#### Example

```typescript
const {callId} = await client.callsDial({chatId: "79001234567@c.us"});
```

***

### callsGetIceServers()

> **callsGetIceServers**(): `Promise`\<[`IceServer`](../interfaces/IceServer.md)[]\>

Defined in: [client/green-api-client.ts:1173](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1173)

Returns the ICE servers for the call audio. connectCalls uses it itself.

#### Returns

`Promise`\<[`IceServer`](../interfaces/IceServer.md)[]\>

Promise resolving to the ICE servers

***

### callsHangUp()

> **callsHangUp**(): `Promise`\<[`CallIdResponse`](../interfaces/CallIdResponse.md)\>

Defined in: [client/green-api-client.ts:1148](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1148)

Ends the current call.

#### Returns

`Promise`\<[`CallIdResponse`](../interfaces/CallIdResponse.md)\>

Promise resolving to the call ID

#### Throws

NO_ACTIVE_CALL and others

***

### callsReject()

> **callsReject**(): `Promise`\<[`CallIdResponse`](../interfaces/CallIdResponse.md)\>

Defined in: [client/green-api-client.ts:1138](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1138)

Rejects the incoming call.

#### Returns

`Promise`\<[`CallIdResponse`](../interfaces/CallIdResponse.md)\>

Promise resolving to the call ID

#### Throws

NO_INCOMING_CALL and others

***

### callsState()

> **callsState**(): `Promise`\<[`CallState`](../interfaces/CallState.md)\>

Defined in: [client/green-api-client.ts:1164](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1164)

Returns the current call state of the instance.
After a call ends the state is a bare idle, the end reason comes only on the calls connection.

#### Returns

`Promise`\<[`CallState`](../interfaces/CallState.md)\>

Promise resolving to the call state

#### Throws

INVALID_CREDENTIALS and others

#### Example

```typescript
const {state, info} = await client.callsState();
```

***

### checkWhatsapp()

> **checkWhatsapp**(`params`): `Promise`\<[`CheckWhatsappResponse`](../interfaces/CheckWhatsappResponse.md)\>

Defined in: [client/green-api-client.ts:706](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L706)

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

Defined in: [client/green-api-client.ts:618](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L618)

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

### clearWebhooksQueue()

> **clearWebhooksQueue**(): `Promise`\<[`ClearWebhooksQueueResponse`](../interfaces/ClearWebhooksQueueResponse.md)\>

Defined in: [client/green-api-client.ts:654](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L654)

Clears the incoming webhook notification queue.
Can only be called once per minute. Recommended after account blocking or phone number switching.

#### Returns

`Promise`\<[`ClearWebhooksQueueResponse`](../interfaces/ClearWebhooksQueueResponse.md)\>

Promise resolving to clear result with status and optional rate-limit info

#### Example

```typescript
const result = await client.clearWebhooksQueue();
if (result.isCleared) {
  console.log('Webhook queue cleared');
} else {
  console.log(`Rate limited, retry in ${result.leftTime}s`);
}
```

***

### connectCalls()

> **connectCalls**(`options`): [`CallsConnection`](CallsConnection.md)

Defined in: [client/green-api-client.ts:1211](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1211)

Creates the live calls connection: call state, incoming calls, end reasons and the call audio.
Call open() on it before use. Audio needs the optional dependencies: npm install werift@^0.25.2 ws
Live PCM audio (sendPcm, remote-pcm) also needs: npm install opusscript

#### Parameters

##### options

[`CallsConnectionOptions`](../interfaces/CallsConnectionOptions.md) = `{}`

Sample rate of the live PCM audio, 24000 by default

#### Returns

[`CallsConnection`](CallsConnection.md)

The calls connection, not yet open

#### Throws

INVALID_AUDIO if pcmSampleRate is not supported

#### Example

```typescript
const calls = client.connectCalls();
calls.on("incoming-call", (info) => console.log("Call from", info.wid));
await calls.open();
```

***

### createGroup()

> **createGroup**(`params`): `Promise`\<[`CreateGroupResponse`](../interfaces/CreateGroupResponse.md)\>

Defined in: [client/green-api-client.ts:889](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L889)

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

### deleteContact()

> **deleteContact**(`params`): `Promise`\<[`DeleteContactResponse`](../interfaces/DeleteContactResponse.md)\>

Defined in: [client/green-api-client.ts:1570](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1570)

Deletes contact.

#### Parameters

##### params

[`DeleteContact`](../interfaces/DeleteContact.md)

Contact data containing chat ID

#### Returns

`Promise`\<[`DeleteContactResponse`](../interfaces/DeleteContactResponse.md)\>

Promise resolving to delete contact response

#### Example

```typescript
await client.deleteContact({
  chatId: "1234567890@c.us"
});
```

***

### deleteMessage()

> **deleteMessage**(`params`): `Promise`\<`void`\>

Defined in: [client/green-api-client.ts:824](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L824)

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

Defined in: [client/green-api-client.ts:1281](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1281)

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

Defined in: [client/green-api-client.ts:1415](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1415)

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

Defined in: [client/green-api-client.ts:1303](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1303)

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

### editContact()

> **editContact**(`params`): `Promise`\<[`EditContactResponse`](../interfaces/EditContactResponse.md)\>

Defined in: [client/green-api-client.ts:1548](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1548)

Edits contact.

#### Parameters

##### params

[`EditContact`](../interfaces/EditContact.md)

Contact data containing chat ID and name

#### Returns

`Promise`\<[`EditContactResponse`](../interfaces/EditContactResponse.md)\>

Promise resolving to edit contact response

#### Example

```typescript
await client.editContact({
  chatId: "1234567890@c.us",
  firstName: "John",
  lastName: "Doe"
});
```

***

### editMessage()

> **editMessage**(`params`): `Promise`\<[`EditMessageResponse`](../interfaces/EditMessageResponse.md)\>

Defined in: [client/green-api-client.ts:795](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L795)

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

Defined in: [client/green-api-client.ts:285](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L285)

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

Defined in: [client/green-api-client.ts:542](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L542)

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

Defined in: [client/green-api-client.ts:717](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L717)

Gets a user or group chat avatar.

#### Parameters

##### params

[`GetAvatar`](../interfaces/GetAvatar.md)

Parameters containing the chat ID

#### Returns

`Promise`\<[`GetAvatarResponse`](../interfaces/GetAvatarResponse.md)\>

Promise resolving to avatar information

***

### getCallRecording()

> **getCallRecording**(`params`): `Promise`\<[`CallRecording`](../interfaces/CallRecording.md)\>

Defined in: [client/green-api-client.ts:1191](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1191)

Returns the recording of a call. downloadUrl works for 1 hour.

#### Parameters

##### params

[`GetCallRecording`](../interfaces/GetCallRecording.md)

Call ID from callsDial, the call webhooks or the calls journals

#### Returns

`Promise`\<[`CallRecording`](../interfaces/CallRecording.md)\>

Promise resolving to the recording status and download URL

#### Example

```typescript
const recording = await client.getCallRecording({idMessage: callId});
if (recording.status === "ready") {
  console.log(recording.downloadUrl);
}
```

***

### getCallsRtcUrl()

> **getCallsRtcUrl**(): `string`

Defined in: [client/green-api-client.ts:1220](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1220)

Returns the WebSocket URL of the calls connection. The URL contains the instance token.

#### Returns

`string`

The callsRtc URL

***

### getChatHistory()

> **getChatHistory**(`params`): `Promise`\<[`JournalResponse`](../type-aliases/JournalResponse.md)[]\>

Defined in: [client/green-api-client.ts:1027](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1027)

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

### getChats()

> **getChats**(`count`?): `Promise`\<[`Chat`](../interfaces/Chat.md)[]\>

Defined in: [client/green-api-client.ts:874](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L874)

Gets a list of chats sorted by last activity time.
The list is updated no more than once per minute.

#### Parameters

##### count?

`number`

Optional number of chats to return

#### Returns

`Promise`\<[`Chat`](../interfaces/Chat.md)[]\>

Promise resolving to an array of chats

#### Example

```typescript
const chats = await client.getChats(20);
chats.forEach(chat => {
  console.log(`${chat.name} (${chat.type}): archived=${chat.archive}`);
});
```

***

### getContactInfo()

> **getContactInfo**(`params`): `Promise`\<[`ContactInfo`](../interfaces/ContactInfo.md)\>

Defined in: [client/green-api-client.ts:739](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L739)

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

Defined in: [client/green-api-client.ts:728](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L728)

Gets a list of the current account contacts.
Note: Contact information updates can take up to 5 minutes.
If an empty array is received, retry the method call.

#### Returns

`Promise`\<[`Contact`](../interfaces/Contact.md)[]\>

Promise resolving to array of contacts

***

### getGroupData()

> **getGroupData**(`params`): `Promise`\<[`GroupData`](../interfaces/GroupData.md)\>

Defined in: [client/green-api-client.ts:910](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L910)

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

Defined in: [client/green-api-client.ts:1469](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1469)

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

Defined in: [client/green-api-client.ts:1015](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1015)

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

Defined in: [client/green-api-client.ts:1500](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1500)

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

Defined in: [client/green-api-client.ts:491](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L491)

Gets the QR code for GREEN-API instance authentication.

#### Returns

`Promise`\<[`QR`](../interfaces/QR.md)\>

Promise resolving to QR code data

***

### getSettings()

> **getSettings**(): `Promise`\<[`Settings`](../interfaces/Settings.md)\>

Defined in: [client/green-api-client.ts:500](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L500)

Gets current instance settings.

#### Returns

`Promise`\<[`Settings`](../interfaces/Settings.md)\>

Promise resolving to settings object

***

### getStateInstance()

> **getStateInstance**(): `Promise`\<[`StateInstance`](../interfaces/StateInstance.md)\>

Defined in: [client/green-api-client.ts:482](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L482)

Gets the current state of the GREEN-API instance.

#### Returns

`Promise`\<[`StateInstance`](../interfaces/StateInstance.md)\>

Promise resolving to instance state

***

### getStateInstanceHistory()

> **getStateInstanceHistory**(`count`?): `Promise`\<[`StateInstanceHistoryItem`](../interfaces/StateInstanceHistoryItem.md)[]\>

Defined in: [client/green-api-client.ts:579](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L579)

Gets the state change history of the current instance in chronological order.

#### Parameters

##### count?

`number`

Optional number of records to return (default: 100)

#### Returns

`Promise`\<[`StateInstanceHistoryItem`](../interfaces/StateInstanceHistoryItem.md)[]\>

Promise resolving to an array of state history items

#### Example

```typescript
const history = await client.getStateInstanceHistory(50);
history.forEach(item => {
  console.log(`${item.stateInstance} at ${new Date(item.timestamp * 1000).toISOString()}`);
});
```

***

### getStatusStatistic()

> **getStatusStatistic**(`params`): `Promise`\<[`GetStatusStatisticResponse`](../type-aliases/GetStatusStatisticResponse.md)\>

Defined in: [client/green-api-client.ts:1439](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1439)

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

Defined in: [client/green-api-client.ts:519](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L519)

Gets WhatsApp-specific settings.

#### Returns

`Promise`\<[`WaSettings`](../interfaces/WaSettings.md)\>

Promise resolving to WhatsApp settings

***

### getWebhooksCount()

> **getWebhooksCount**(): `Promise`\<[`GetWebhooksCountResponse`](../interfaces/GetWebhooksCountResponse.md)\>

Defined in: [client/green-api-client.ts:634](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L634)

Gets the number of notifications currently in the incoming webhook queue.
The count is updated once every 10 seconds. Each notification is stored for 24 hours.

#### Returns

`Promise`\<[`GetWebhooksCountResponse`](../interfaces/GetWebhooksCountResponse.md)\>

Promise resolving to webhook count response

#### Example

```typescript
const { count } = await client.getWebhooksCount();
console.log('Pending notifications:', count);
```

***

### lastIncomingCalls()

> **lastIncomingCalls**(`minutes`?): `Promise`\<[`IncomingCall`](../interfaces/IncomingCall.md)[]\>

Defined in: [client/green-api-client.ts:1076](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1076)

Gets the incoming calls log for the specified time period.
Default is 24 hours (1440 minutes). Returns up to 10,000 calls.
Note: Requires "Receive webhooks on incoming messages and files" and "Receive webhooks on incoming calls"
settings to be enabled. Data may take up to 2 minutes to appear.

#### Parameters

##### minutes?

`number`

Optional time period in minutes (default: 1440)

#### Returns

`Promise`\<[`IncomingCall`](../interfaces/IncomingCall.md)[]\>

Promise resolving to array of incoming calls

#### Example

```typescript
// Get all incoming calls for the last hour
const calls = await client.lastIncomingCalls(60);
calls.forEach(call => {
  const status = call.status === "pickUp" ? "answered" : call.status;
  console.log(`Call from ${call.chatId}: ${status}, video=${call.isVideo}`);
});
```

***

### lastIncomingMessages()

> **lastIncomingMessages**(`minutes`?): `Promise`\<[`IncomingJournalResponse`](../type-aliases/IncomingJournalResponse.md)[]\>

Defined in: [client/green-api-client.ts:1040](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1040)

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

### lastOutgoingCalls()

> **lastOutgoingCalls**(`minutes`?): `Promise`\<[`OutgoingCall`](../interfaces/OutgoingCall.md)[]\>

Defined in: [client/green-api-client.ts:1097](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1097)

Gets the outgoing calls log for the specified time period.
Default is 24 hours (1440 minutes). Returns up to 10,000 calls.
Note: Data may take up to 2 minutes to appear in the log.

#### Parameters

##### minutes?

`number`

Optional time period in minutes (default: 1440)

#### Returns

`Promise`\<[`OutgoingCall`](../interfaces/OutgoingCall.md)[]\>

Promise resolving to array of outgoing calls

#### Example

```typescript
// Get all outgoing calls for the last 24 hours
const calls = await client.lastOutgoingCalls();
calls.forEach(call => {
  console.log(`Call to ${call.chatId}: ${call.status}, duration=${call.duration}s`);
});
```

***

### lastOutgoingMessages()

> **lastOutgoingMessages**(`minutes`?): `Promise`\<[`OutgoingJournalResponse`](../type-aliases/OutgoingJournalResponse.md)[]\>

Defined in: [client/green-api-client.ts:1053](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1053)

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

Defined in: [client/green-api-client.ts:976](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L976)

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

Defined in: [client/green-api-client.ts:473](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L473)

Logs out from the GREEN-API instance.

#### Returns

`Promise`\<[`Logout`](../interfaces/Logout.md)\>

Promise resolving to logout status

***

### readChat()

> **readChat**(`params`): `Promise`\<[`ReadChatResponse`](../interfaces/ReadChatResponse.md)\>

Defined in: [client/green-api-client.ts:684](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L684)

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

Defined in: [client/green-api-client.ts:464](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L464)

Reboots the GREEN-API instance.

#### Returns

`Promise`\<[`Reboot`](../interfaces/Reboot.md)\>

Promise resolving to reboot status

***

### receiveNotification()

> **receiveNotification**(`timeout`?): `Promise`\<`null` \| [`ReceiveNotificationResponse`](../interfaces/ReceiveNotificationResponse.md)\>

Defined in: [client/green-api-client.ts:1255](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1255)

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

Defined in: [client/green-api-client.ts:952](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L952)

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

Defined in: [client/green-api-client.ts:932](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L932)

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

Defined in: [client/green-api-client.ts:339](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L339)

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

Defined in: [client/green-api-client.ts:231](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L231)

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

Defined in: [client/green-api-client.ts:201](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L201)

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

### sendInteractiveButtons()

> **sendInteractiveButtons**(`params`): `Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Defined in: [client/green-api-client.ts:369](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L369)

Sends a message with interactive action buttons (copy/call/url) to a private chat (Beta feature).
Supports up to 3 buttons per message. Button text is limited to 25 characters.

#### Parameters

##### params

[`SendInteractiveButtons`](../interfaces/SendInteractiveButtons.md)

Interactive buttons message parameters

#### Returns

`Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Promise resolving to send response with message ID

#### Example

```typescript
await client.sendInteractiveButtons({
  chatId: "1234567890@c.us",
  header: "Choose an action",
  body: "Please select one of the options below",
  footer: "Powered by GREEN-API",
  buttons: [
    { type: "url", buttonId: "1", buttonText: "Visit site", url: "https://example.com" },
    { type: "call", buttonId: "2", buttonText: "Call us", phoneNumber: "79001234567" },
    { type: "copy", buttonId: "3", buttonText: "Copy code", copyCode: "PROMO2025" }
  ]
});
```

***

### sendInteractiveButtonsReply()

> **sendInteractiveButtonsReply**(`params`): `Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Defined in: [client/green-api-client.ts:410](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L410)

Sends a message with reply buttons that return text to the chat when clicked (Beta feature).
Supports up to 3 buttons per message. Button text is limited to 25 characters.
Each button can only be clicked once.

#### Parameters

##### params

[`SendInteractiveButtonsReply`](../interfaces/SendInteractiveButtonsReply.md)

Interactive reply buttons message parameters

#### Returns

`Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Promise resolving to send response with message ID

#### Example

```typescript
await client.sendInteractiveButtonsReply({
  chatId: "1234567890@c.us",
  header: "Quick reply",
  body: "How are you?",
  footer: "Select an answer",
  buttons: [
    { buttonId: "1", buttonText: "Great!" },
    { buttonId: "2", buttonText: "Not bad" },
    { buttonId: "3", buttonText: "Could be better" }
  ]
});
```

***

### sendLocation()

> **sendLocation**(`message`): `Promise`\<[`SendResponse`](../interfaces/SendResponse.md)\>

Defined in: [client/green-api-client.ts:310](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L310)

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

Defined in: [client/green-api-client.ts:1389](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1389)

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

Defined in: [client/green-api-client.ts:171](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L171)

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

Defined in: [client/green-api-client.ts:260](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L260)

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

Defined in: [client/green-api-client.ts:1329](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1329)

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

### sendTyping()

> **sendTyping**(`params`): `Promise`\<`void`\>

Defined in: [client/green-api-client.ts:851](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L851)

Sends a typing or audio recording indicator to a chat.
The notification delivery time depends on the message queue interval plus the specified typingTime.

#### Parameters

##### params

[`SendTyping`](../interfaces/SendTyping.md)

Parameters containing chat ID, duration and optional type

#### Returns

`Promise`\<`void`\>

Promise resolving to void on success

#### Example

```typescript
// Show "typing..." indicator for 5 seconds
await client.sendTyping({
  chatId: "1234567890@c.us",
  typingTime: 5000
});

// Show "recording audio..." indicator for 3 seconds
await client.sendTyping({
  chatId: "1234567890@c.us",
  typingTime: 3000,
  typingType: "recording"
});
```

***

### sendVoiceStatus()

> **sendVoiceStatus**(`params`): `Promise`\<[`SendVoiceStatusResponse`](../interfaces/SendVoiceStatusResponse.md)\>

Defined in: [client/green-api-client.ts:1361](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L1361)

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

Defined in: [client/green-api-client.ts:771](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L771)

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

Defined in: [client/green-api-client.ts:942](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L942)

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

Defined in: [client/green-api-client.ts:962](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L962)

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

Defined in: [client/green-api-client.ts:529](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L529)

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

Defined in: [client/green-api-client.ts:510](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L510)

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

Defined in: [client/green-api-client.ts:600](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L600)

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

Defined in: [client/green-api-client.ts:760](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L760)

Unarchives a chat.

#### Parameters

##### params

[`UnarchiveChat`](../interfaces/UnarchiveChat.md)

Parameters containing the chat ID to unarchive

#### Returns

`Promise`\<`void`\>

Promise resolving to void on success

***

### updateApiToken()

> **updateApiToken**(): `Promise`\<[`UpdateApiTokenResponse`](../interfaces/UpdateApiTokenResponse.md)\>

Defined in: [client/green-api-client.ts:561](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L561)

Generates a new API token for the current instance (Beta feature).
The old token is immediately invalidated after calling this method.
Make sure to update your credentials before making further requests.

#### Returns

`Promise`\<[`UpdateApiTokenResponse`](../interfaces/UpdateApiTokenResponse.md)\>

Promise resolving to the new API token

#### Example

```typescript
const result = await client.updateApiToken();
console.log('New token:', result.apiTokenInstance);
// Update the client credentials to use the new token
```

***

### updateGroupName()

> **updateGroupName**(`params`): `Promise`\<[`UpdateGroupNameResponse`](../interfaces/UpdateGroupNameResponse.md)\>

Defined in: [client/green-api-client.ts:899](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L899)

Changes a group chat name.

#### Parameters

##### params

[`UpdateGroupName`](../interfaces/UpdateGroupName.md)

Parameters containing group ID and new name

#### Returns

`Promise`\<[`UpdateGroupNameResponse`](../interfaces/UpdateGroupNameResponse.md)\>

Promise resolving to update status

***

### updateGroupSettings()

> **updateGroupSettings**(`params`): `Promise`\<[`UpdateGroupSettingsResponse`](../interfaces/UpdateGroupSettingsResponse.md)\>

Defined in: [client/green-api-client.ts:998](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L998)

Updates group chat settings (Beta feature).
Controls whether participants can edit group settings and send messages.
No error is returned if settings already match the requested values.

#### Parameters

##### params

[`UpdateGroupSettings`](../interfaces/UpdateGroupSettings.md)

Parameters containing group ID and settings to update

#### Returns

`Promise`\<[`UpdateGroupSettingsResponse`](../interfaces/UpdateGroupSettingsResponse.md)\>

Promise resolving to update status

#### Example

```typescript
// Restrict message sending to admins only
await client.updateGroupSettings({
  groupId: "1234567890123456789@g.us",
  allowParticipantsSendMessages: false,
  allowParticipantsEditGroupSettings: false
});
```

***

### uploadFile()

> **uploadFile**(`file`, `customFileName`?): `Promise`\<[`UploadFile`](../interfaces/UploadFile.md)\>

Defined in: [client/green-api-client.ts:435](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/green-api-client.ts#L435)

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
