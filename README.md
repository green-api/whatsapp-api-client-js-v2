# GREEN-API WhatsApp SDK Library v2

A TypeScript/JavaScript SDK for interacting with the GREEN-API WhatsApp gateway.

## Installation

```bash
npm install @green-api/whatsapp-api-client-js-v2
# or
yarn add @green-api/whatsapp-api-client-js-v2
```

#### API

Documentation for the REST API is located at [link](https://green-api.com/en/docs/api/). The library is a wrapper for
the REST API,
so the documentation at the link above is also applicable to the library itself.

#### Authorization

To send a message or perform other GREEN-API methods, the WhatsApp account in the phone application must be in the
authorized state. To authorize the instance, go to [console](https://console.green-api.com/) and
scan the QR code using the WhatsApp application.

## Getting Started

To use the SDK, you need to create an instance of the `GreenApiClient` with your GREEN-API instance credentials:

```typescript
import { GreenApiClient } from '@green-api/whatsapp-api-client-js-v2';

const client = new GreenApiClient({
    idInstance: 12345,
    apiTokenInstance: 'your-api-token'
});
```

For Partner API access, use the `GreenApiPartnerClient`:

```typescript
import { GreenApiPartnerClient } from '@green-api/whatsapp-api-client-js-v2';

const partnerClient = new GreenApiPartnerClient({
    partnerToken: 'your-partner-token',
    partnerApiUrl: 'https://api.green-api.com' // Optional, defaults to this URL
});
```

## Usage Examples

### Sending a Text Message

```typescript
await client.sendMessage({
    chatId: '1234567890@c.us',
    message: 'Hello from GREEN-API SDK!'
});
```

### Sending a File by URL

```typescript
await client.sendFileByUrl({
    chatId: '1234567890@c.us',
    file: {
        url: 'https://example.com/file.pdf',
        fileName: 'document.pdf'
    },
    caption: 'Check this file'
});
```

### Creating a Poll

```typescript
await client.sendPoll({
    chatId: '1234567890@c.us',
    message: 'What\'s your favorite color?',
    options: [
        {optionName: 'Red'},
        {optionName: 'Blue'},
        {optionName: 'Green'}
    ],
    multipleAnswers: false
});
```

### Managing Groups

```typescript
// Create a group
const group = await client.createGroup({
    groupName: 'My Test Group',
    chatIds: ['1234567890@c.us', '0987654321@c.us']
});

// Add a participant
await client.addGroupParticipant({
    groupId: group.chatId,
    participantChatId: '1122334455@c.us'
});
```

### Receiving Notifications

```typescript
// Receive notification with 30 sec timeout
const notification = await client.receiveNotification(30);
if (notification) {
    console.log('Received notification:', notification.body.typeWebhook);

    // Process the notification
    if (notification.body.typeWebhook === 'incomingMessageReceived') {
        // Handle incoming message
        console.log('Message:', notification.body.messageData);
    }

    // Delete the notification from queue after processing
    await client.deleteNotification(notification.receiptId);
}

// Download file from a message
const fileData = await client.downloadFile({
    chatId: '1234567890@c.us',
    idMessage: 'MESSAGE_ID_WITH_FILE'
});
console.log('File URL:', fileData.downloadUrl);
```

### Working with WhatsApp Statuses (Beta)

```typescript
// Send text status
await client.sendTextStatus({
    message: "Hello from GREEN-API SDK!",
    backgroundColor: "#228B22", // Green background
    font: "SERIF",
    participants: ["1234567890@c.us"] // Optional: limit visibility to specific contacts
});

// Send media status
await client.sendMediaStatus({
    urlFile: "https://example.com/image.jpg",
    fileName: "image.jpg",
    caption: "Check out this view!",
    participants: ["1234567890@c.us"]
});

// Get status statistics
const stats = await client.getStatusStatistic({
    idMessage: "BAE5F4886F6F2D05"
});
console.log(`Status was viewed by ${stats.length} contacts`);

// Get incoming statuses from contacts
const statuses = await client.getIncomingStatuses({minutes: 60}); // Last hour
statuses.forEach(status => {
    console.log(`Status from ${status.senderName} at ${new Date(status.timestamp * 1000)}`);
});
```

### Partner API (Instance Management)

```typescript
// Get all instances
const instances = await partnerClient.getInstances();
console.log(`Total instances: ${instances.length}`);
console.log(`Active instances: ${instances.filter(i => !i.deleted).length}`);

// Create a new instance
const instance = await partnerClient.createInstance({
    name: "Marketing Campaign",
    incomingWebhook: "yes",
    outgoingWebhook: "yes",
    delaySendMessagesMilliseconds: 3000
});
console.log(`Created instance with ID: ${instance.idInstance}`);
console.log(`API Token: ${instance.apiTokenInstance}`);

// Delete an instance
const result = await partnerClient.deleteInstanceAccount({
    idInstance: instance.idInstance
});
if (result.deleteInstanceAccount) {
    console.log("Instance successfully deleted");
}
```

### Sending Interactive Buttons (Beta)

```typescript
// Buttons with actions (copy/call/url)
await client.sendInteractiveButtons({
    chatId: '1234567890@c.us',
    header: 'Choose an action',
    body: 'Please select one of the options below',
    footer: 'Powered by GREEN-API',
    buttons: [
        { type: 'url', buttonId: '1', buttonText: 'Visit site', url: 'https://example.com' },
        { type: 'call', buttonId: '2', buttonText: 'Call us', phoneNumber: '79001234567' },
        { type: 'copy', buttonId: '3', buttonText: 'Copy code', copyCode: 'PROMO2025' }
    ]
});

// Reply buttons that return text to the chat
await client.sendInteractiveButtonsReply({
    chatId: '1234567890@c.us',
    header: 'Quick reply',
    body: 'How are you?',
    footer: 'Select an answer',
    buttons: [
        { buttonId: '1', buttonText: 'Great!' },
        { buttonId: '2', buttonText: 'Not bad' },
        { buttonId: '3', buttonText: 'Could be better' }
    ]
});
```

### Sending Typing Indicator

```typescript
// Show "typing..." for 5 seconds
await client.sendTyping({
    chatId: '1234567890@c.us',
    typingTime: 5000
});

// Show "recording audio..." for 3 seconds
await client.sendTyping({
    chatId: '1234567890@c.us',
    typingTime: 3000,
    typingType: 'recording'
});
```

### Getting Chats and Calls Journal

```typescript
// Get 20 most recent chats
const chats = await client.getChats(20);
chats.forEach(chat => {
    console.log(`${chat.name} (${chat.type}): archived=${chat.archive}`);
});

// Get incoming calls for the last hour
const incomingCalls = await client.lastIncomingCalls(60);
incomingCalls.forEach(call => {
    const answered = call.status === 'pickUp' ? 'answered' : call.status;
    console.log(`Call from ${call.chatId}: ${answered}, video=${call.isVideo}`);
});

// Get outgoing calls for the last 24 hours (default)
const outgoingCalls = await client.lastOutgoingCalls();
outgoingCalls.forEach(call => {
    console.log(`Call to ${call.chatId}: ${call.status}, duration=${call.duration}s`);
});
```

### Account Token Rotation and State History

```typescript
// Generate a new API token (old token is immediately invalidated)
const result = await client.updateApiToken();
console.log('New token:', result.apiTokenInstance);

// Get instance state change history
const history = await client.getStateInstanceHistory(50);
history.forEach(item => {
    console.log(`${item.stateInstance} at ${new Date(item.timestamp * 1000).toISOString()}`);
});
```

### Editing and Deleting Messages

```typescript
// Edit a message
const editResult = await client.editMessage({
    chatId: '1234567890@c.us',
    idMessage: 'BAE5367237E13A87',
    message: 'This is the edited message text'
});
console.log('Edited message ID:', editResult.idMessage);

// Delete a message for everyone
await client.deleteMessage({
    chatId: '1234567890@c.us',
    idMessage: 'BAE5F4886F6F2D05'
});

// Delete a message only for sender
await client.deleteMessage({
    chatId: '1234567890@c.us',
    idMessage: 'BAE5F4886F6F2D05',
    onlySenderDelete: true
});
```

### Working with contacts

```typescript
// Add a contact
const addResult = await client.addContact({
    chatId: '1234567890@c.us',
    firstName: 'John',
    lastName: 'Doe',
    saveInAddressbook: true

});
console.log('Add contact result:', addResult.addContact);

// Edit a contact
const editResult = await client.editContact({
    chatId: '1234567890@c.us',
    firstName: 'Jane',
    lastName: 'Doe',
    saveInAddressbook: true

});
console.log('Edit contact result:', editResult.editContact);

// Delete a contact
const deleteResult = await client.deleteContact({
    chatId: '1234567890@c.us'
});
console.log('Delete contact result:', deleteResult.deleteContact);
```

## SDK methods

The SDK provides the following groups of methods:

1. **Message Sending Methods**
    - `sendMessage`
    - `sendFileByUrl`
    - `sendFileByUpload`
    - `sendPoll`
    - `forwardMessages`
    - `sendLocation`
    - `sendContact`
    - `uploadFile`
    - `sendInteractiveButtons` (Beta) — send buttons with copy/call/url actions
    - `sendInteractiveButtonsReply` (Beta) — send reply buttons that return text to the chat

2. **Account Management Methods**
    - `reboot`
    - `logout`
    - `getStateInstance`
    - `getQR`
    - `getSettings`
    - `setSettings`
    - `getWaSettings`
    - `setProfilePicture`
    - `getAuthorizationCode`
    - `updateApiToken` (Beta) — generate a new API token (old token is immediately invalidated)
    - `getStateInstanceHistory` — get instance state change history

3. **Message Queue Methods**
    - `showMessagesQueue`
    - `clearMessagesQueue`

4. **Service Methods**
    - `readChat`
    - `checkWhatsapp`
    - `getAvatar`
    - `getContacts`
    - `getContactInfo`
    - `archiveChat`
    - `unarchiveChat`
    - `setDisappearingChat`
    - `editMessage`
    - `deleteMessage`
    - `sendTyping` — send a typing or audio recording indicator
    - `getChats` — get a list of chats sorted by last activity

5. **Group Management Methods**
    - `createGroup`
    - `updateGroupName`
    - `getGroupData`
    - `addGroupParticipant`
    - `removeGroupParticipant`
    - `setGroupAdmin`
    - `removeAdmin`
    - `setGroupPicture`
    - `leaveGroup`

6. **Journal Methods**
    - `getMessage`
    - `getChatHistory`
    - `lastIncomingMessages`
    - `lastOutgoingMessages`
    - `lastIncomingCalls` — get incoming calls log
    - `lastOutgoingCalls` — get outgoing calls log

7. **Message Receiving Methods**
    - `receiveNotification`
    - `deleteNotification`
    - `downloadFile`

8. **Status Methods (Beta)**
    - `sendTextStatus`
    - `sendVoiceStatus`
    - `sendMediaStatus`
    - `deleteStatus`
    - `getStatusStatistic`
    - `getIncomingStatuses`
    - `getOutgoingStatuses`

9. **Contacts Methods**
    - `addContact`
    - `editContact`
    - `deleteContact`

10. **Partner API Methods**
    - `getInstances`
    - `createInstance`
    - `deleteInstanceAccount`

## License

MIT
