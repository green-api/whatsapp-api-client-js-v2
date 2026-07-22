---
name: "GREEN-API WhatsApp SDK v2 - JavaScript/TypeScript"
version: "2.0.0"
description: "Skill for AI agents to write correct code using GREEN-API SDK for WhatsApp integration"
created_at: "2026-07-20"
updated_at: "2026-07-20"
---

# GREEN-API WhatsApp SDK Skill for AI Agents

## Purpose

This skill teaches AI agents (Claude Code, Cursor, etc.) how to use the **GREEN-API WhatsApp SDK v2** to send/receive WhatsApp messages, manage groups, handle files, and integrate with the GREEN-API platform.

**Data sources:**
- Official API docs: https://green-api.com/en/docs/api/
- SDK repository: https://github.com/green-api/whatsapp-api-client-js-v2
- **Only include methods that exist in the actual SDK code** (verify with grep if unsure)

---

## When to Use This Skill

- **Sending WhatsApp messages** via REST API integration
- **Receiving messages and notifications** via polling or webhooks
- **Managing WhatsApp groups** (create, add members, change settings)
- **Working with files** (upload, download, send by URL)
- **Handling contacts, statuses, and account settings**
- **Building WhatsApp chatbots or integrations** with business applications

⚠️ **This skill is NOT for:**
- Native WhatsApp client automation (use Baileys, Puppeteer for that)
- Bypassing WhatsApp's terms of service
- Bulk messaging without proper delays and authorization

---

## Critical Requirements

### 1. Chat ID Formats (MUST GET RIGHT)

WhatsApp uses special ID formats:

```typescript
// Individual contact (phone number)
chatId: "1234567890@c.us"  // Format: {phone}@c.us

// Group
groupId: "120363xxxxxxxxxxxx-123456789@g.us"  // Format: {groupId}@g.us

// When creating a group, GREEN-API returns the groupId; use it for subsequent calls
```

**Common mistake:** Forgetting `@c.us` or `@g.us` suffix → API returns 400 error.

### 2. Instance Authorization (REQUIRED)

**Before any operation, the WhatsApp account MUST be authorized:**

1. Go to https://console.green-api.com/
2. Scan the QR code with WhatsApp app on your phone
3. Verify instance state:

```typescript
const state = await client.getStateInstance();
// state.stateInstance === "authorized" ✓
// state.stateInstance === "notAuthorized" ✗ → Must scan QR first
```

### 3. Rate Limiting & Delays

- **Between text messages:** 700ms minimum delay (GREEN-API recommendation)
- **Between file sends:** 1000ms minimum delay
- **Batch operations:** Add delays in loops

```typescript
// ✓ CORRECT: Respects delays
for (const chatId of chatIds) {
  await client.sendMessage({ chatId, message: "Hello" });
  await new Promise(r => setTimeout(r, 700)); // 700ms delay
}

// ✗ WRONG: No delays → Rate limit, messages rejected
for (const chatId of chatIds) {
  await client.sendMessage({ chatId, message: "Hello" });
}
```

### 4. Error Handling Patterns

```typescript
try {
  const result = await client.sendMessage({
    chatId: "1234567890@c.us",
    message: "Test"
  });
  console.log("Message sent:", result.idMessage);
} catch (error) {
  // Common errors:
  // 400: Invalid chatId format, unauthorized instance, message too long
  // 401: Invalid apiTokenInstance or idInstance
  // 429: Rate limit exceeded
  console.error("Failed:", error.message);
}
```

---

## Installation & Setup

### Install SDK

```bash
npm install @green-api/whatsapp-api-client-js-v2
# or
yarn add @green-api/whatsapp-api-client-js-v2
```

### Initialize Client

```typescript
import { GreenApiClient } from '@green-api/whatsapp-api-client-js-v2';

const client = new GreenApiClient({
  idInstance: 1234567890,           // Your instance ID
  apiTokenInstance: 'your-token'     // Your API token
});
```

**Get credentials from:** https://console.green-api.com/

### Partner Client (Optional)

If using the Partner API:

```typescript
import { GreenApiPartnerClient } from '@green-api/whatsapp-api-client-js-v2';

const partnerClient = new GreenApiPartnerClient({
  partnerToken: 'your-partner-token',
  partnerApiUrl: 'https://api.green-api.com' // Optional, defaults to this
});
```

---

## Quick Start Scenarios

### Scenario 1: Send a Text Message

```typescript
const response = await client.sendMessage({
  chatId: "1234567890@c.us",
  message: "Hello, this is a test message from GREEN-API!"
});

console.log(`Message sent with ID: ${response.idMessage}`);
```

**Response:**
```typescript
{
  idMessage: "BAE5D4E8766D60DD63B8FB6CCDA5D9D7"
}
```

### Scenario 2: Send a File by URL

```typescript
const response = await client.sendFileByUrl({
  chatId: "1234567890@c.us",
  file: {
    url: "https://example.com/document.pdf",
    fileName: "report.pdf"
  },
  caption: "Check the attached report"
});

console.log(`File sent with ID: ${response.idMessage}`);
```

### Scenario 3: Receive Messages via Polling

```typescript
async function pollMessages() {
  while (true) {
    try {
      const notification = await client.receiveNotification(5); // 5 sec timeout
      
      if (notification) {
        console.log("Received notification:", notification.body);
        
        // Delete from queue after processing
        await client.deleteNotification(notification.receiptId);
      }
    } catch (error) {
      console.error("Polling error:", error.message);
    }
    
    await new Promise(r => setTimeout(r, 1000)); // 1 sec between polls
  }
}

pollMessages();
```

### Scenario 4: Create and Manage a Group

```typescript
// Create group
const group = await client.createGroup({
  groupName: "My Team",
  chatIds: ["1234567890@c.us", "9876543210@c.us"]
});

console.log(`Group created: ${group.chatId}`);

// Add participant
await client.addGroupParticipant({
  groupId: group.chatId,
  participantChatId: "5555555555@c.us"
});

// Change group name
await client.updateGroupName({
  groupId: group.chatId,
  groupName: "Updated Team Name"
});

// Set someone as admin
await client.setGroupAdmin({
  groupId: group.chatId,
  participantChatId: "1234567890@c.us"
});

// Get group info
const groupData = await client.getGroupData({
  groupId: group.chatId
});

console.log("Group members:", groupData.participants);
```

### Scenario 5: Receive Webhooks (Server-Side)

```typescript
// Example: Express.js webhook handler
import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  const notification = req.body; // Entire webhook body
  
  // notification.eventType can be:
  // - "IncomingMessageReceived"
  // - "OutgoingMessageReceived"
  // - "IncomingCall"
  // - "StateInstanceChanged"
  // - etc.
  
  if (notification.eventType === "IncomingMessageReceived") {
    const message = notification.messageData;
    console.log(`From: ${message.senderData.chatId}`);
    console.log(`Text: ${message.textMessageData?.textMessage}`);
  }
  
  res.json({ result: true });
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

---

## Core Method Groups

For detailed parameter descriptions, API response formats, and constraints, see:

### [**Message Sending**](./references/sending.md)
- `sendMessage()` - text messages
- `sendFileByUrl()` - files by URL
- `sendFileByUpload()` - files by upload
- `sendPoll()` - poll questions
- `sendLocation()` - location markers
- `sendContact()` - contact cards
- `sendInteractiveButtons()` - interactive buttons
- `forwardMessages()` - forward from other chats
- `uploadFile()` - upload file to storage
- `sendTyping()` - typing indicator

### [**Message & Chat Management**](./references/messages.md)
- `editMessage()` - edit sent message
- `deleteMessage()` - delete message
- `readChat()` - mark chat as read
- `archiveChat()` / `unarchiveChat()` - archive/unarchive chats
- `setDisappearingChat()` - enable disappearing messages
- `getChats()` - list recent chats
- `getChatHistory()` - message history

### [**Notifications & Receiving**](./references/receiving.md)
- `receiveNotification()` - polling-based notification retrieval
- `deleteNotification()` - remove from queue
- `lastIncomingMessages()` - incoming messages by time
- `lastOutgoingMessages()` - sent messages by time
- `lastIncomingCalls()` - incoming calls
- `lastOutgoingCalls()` - outgoing calls
- Webhook integration (external setup)

### [**Group Management**](./references/groups.md)
- `createGroup()` - create new group
- `updateGroupName()` - rename group
- `getGroupData()` - fetch group info
- `addGroupParticipant()` - add member
- `removeGroupParticipant()` - remove member
- `setGroupAdmin()` - promote to admin
- `removeAdmin()` - demote from admin
- `setGroupPicture()` - change group icon
- `leaveGroup()` - leave group
- `updateGroupSettings()` - configure group options

### [**Account & Instance**](./references/account.md)
- `getStateInstance()` - check authorization status
- `getSettings()` / `setSettings()` - instance settings
- `getQR()` - QR code for authorization
- `reboot()` - restart instance
- `logout()` - disconnect account
- `getAuthorizationCode()` - get auth code for new phone
- `updateApiToken()` - generate new API token
- `getStateInstanceHistory()` - authorization history

### [**Contacts**](./references/contacts.md)
- `getContacts()` - list saved contacts
- `getContactInfo()` - individual contact details
- `checkWhatsapp()` - check if phone is on WhatsApp
- `addContact()` - save new contact
- `editContact()` - update contact
- `deleteContact()` - remove contact

### [**Statuses (Beta)**](./references/statuses.md)
- `sendTextStatus()` - text-based status
- `sendMediaStatus()` - image/video status
- `sendVoiceStatus()` - audio status
- `getStatusStatistic()` - view count, reactions
- `getIncomingStatuses()` - received statuses
- `getOutgoingStatuses()` - sent statuses
- `deleteStatus()` - remove status

### [**Files & Downloads**](./references/files.md)
- `downloadFile()` - get download URL for received files
- `uploadFile()` - upload file to storage (returns URL for `sendFileByUrl()`)

### [**Journal & History**](./references/journal.md)
- `getMessage()` - fetch single message details
- `getChatHistory()` - retrieve messages from a chat
- `lastIncomingMessages()` - recent incoming messages
- `lastOutgoingMessages()` - recent sent messages
- `lastIncomingCalls()` - recent incoming calls
- `lastOutgoingCalls()` - recent outgoing calls

### [**Queues & Webhooks**](./references/queues.md)
- `showMessagesQueue()` - pending message queue
- `clearMessagesQueue()` - clear queue
- `getWebhooksCount()` - webhook queue size
- `clearWebhooksQueue()` - clear webhook queue

### [**Avatars & Profile**](./references/profile.md)
- `getAvatar()` - fetch profile picture
- `setProfilePicture()` - change profile picture
- `getContacts()` - contact list with avatars

---

## Common Pitfalls & Solutions

| Problem | Cause | Solution |
|---------|-------|----------|
| `400 Bad Request` | Invalid chatId format | Use `"1234567890@c.us"` for contacts, `"...-...@g.us"` for groups |
| `401 Unauthorized` | Wrong token/instance ID | Verify credentials in console.green-api.com |
| `429 Too Many Requests` | Sending too fast | Add 700ms delay between messages |
| Message not received | Instance not authorized | Run `getStateInstance()`, must show `"authorized"` |
| Webhook not firing | Wrong endpoint configured | Set webhook URL in console, must be HTTPS and reachable |
| `idMessage` is null | SDK version mismatch | Update SDK: `npm install @green-api/whatsapp-api-client-js-v2@latest` |
| Group operations fail | Invalid groupId format | Use full ID from `createGroup()` response or `getGroupData()` |

---

## TypeScript Support

All types are exported from the SDK:

```typescript
import {
  GreenApiClient,
  SendMessage,
  SendResponse,
  ReceiveNotificationResponse,
  CreateGroup,
  CreateGroupResponse,
  // ... all other types
} from '@green-api/whatsapp-api-client-js-v2';
```

Use these types to ensure compile-time type safety.

---

## Testing with Real Credentials

**DO NOT hardcode credentials in code.**

Use environment variables:

```typescript
const client = new GreenApiClient({
  idInstance: parseInt(process.env.ID_INSTANCE!),
  apiTokenInstance: process.env.API_TOKEN_INSTANCE!
});
```

Create `.env` file:
```
ID_INSTANCE=1234567890
API_TOKEN_INSTANCE=your-secret-token
```

---

## Integration with Agent Frameworks

### Example: Using with OpenAI + Node.js

```typescript
import { GreenApiClient } from '@green-api/whatsapp-api-client-js-v2';
import OpenAI from 'openai';

const client = new GreenApiClient({
  idInstance: parseInt(process.env.ID_INSTANCE!),
  apiTokenInstance: process.env.API_TOKEN_INSTANCE!
});

const openai = new OpenAI();

async function processIncomingMessage(message: string, fromChatId: string) {
  // Get AI response
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }]
  });

  // Send reply
  await client.sendMessage({
    chatId: fromChatId,
    message: aiResponse.choices[0].message.content!
  });
}

// Polling loop
async function runBot() {
  while (true) {
    const notification = await client.receiveNotification(5);
    
    if (notification?.body.eventType === 'IncomingMessageReceived') {
      const msg = notification.body.messageData;
      await processIncomingMessage(
        msg.textMessageData?.textMessage || 'No text',
        msg.senderData.chatId
      );
      await client.deleteNotification(notification.receiptId);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }
}

runBot().catch(console.error);
```

---

## References & Documentation

- **Official API Docs:** https://green-api.com/en/docs/api/
- **SDK Repository:** https://github.com/green-api/whatsapp-api-client-js-v2
- **NPM Package:** https://www.npmjs.com/package/@green-api/whatsapp-api-client-js-v2
- **Console:** https://console.green-api.com/

---

## Detailed Method References

See separate documents for parameter details and constraints:

- [Sending Messages](./references/sending.md)
- [Message Management](./references/messages.md)
- [Receiving & Notifications](./references/receiving.md)
- [Group Operations](./references/groups.md)
- [Account & Instance](./references/account.md)
- [Contacts](./references/contacts.md)
- [Statuses](./references/statuses.md)
- [Files & Downloads](./references/files.md)
- [Journal & History](./references/journal.md)
- [Queues & Webhooks](./references/queues.md)

---

**Skill Version:** 2.0.0  
**Last Updated:** 2026-07-20  
**Source:** Official GREEN-API Documentation + SDK v2 Source Code Verification
