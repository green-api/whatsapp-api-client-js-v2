# Message Management Methods

Methods for editing, deleting, and managing sent/received messages.

---

## `editMessage()`

Edit text content of a previously sent message.

**Method Signature:**
```typescript
editMessage(params: EditMessageRequest): Promise<EditMessageResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID of message recipient |
| `idMessage` | string | ✓ | Message ID to edit (from send response) |
| `message` | string | ✓ | New message text (max 20000 chars) |

**Response:**
```typescript
{
  result: boolean;  // true if edited successfully
}
```

**Example:**
```typescript
// First, send a message
const response = await client.sendMessage({
  chatId: "1234567890@c.us",
  message: "Original text"
});

// Later, edit it
await client.editMessage({
  chatId: "1234567890@c.us",
  idMessage: response.idMessage,
  message: "Corrected text"
});
```

**Constraints:**
- Can only edit text messages (not media)
- Max 20000 characters
- Only your own messages can be edited
- Recipients see "edited" label

---

## `deleteMessage()`

Delete a sent or received message.

**Method Signature:**
```typescript
deleteMessage(params: DeleteMessageRequest): Promise<void>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID |
| `idMessage` | string | ✓ | Message ID to delete |

**Example:**
```typescript
// Delete your sent message
await client.deleteMessage({
  chatId: "1234567890@c.us",
  idMessage: "BAE5D4E8766D60DD63B8FB6CCDA5D9D7"
});

console.log("✓ Message deleted");
```

**Constraints:**
- Can delete own messages
- Some deletions visible to recipients (depends on WhatsApp settings)

---

## `readChat()`

Mark a chat as read / set the last read message.

**Method Signature:**
```typescript
readChat(params: ReadChat): Promise<ReadChatResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID |
| `unreadCount` | number | ✗ | Number of unread messages to mark as read |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
// Mark entire chat as read
await client.readChat({
  chatId: "1234567890@c.us"
});
```

---

## `archiveChat()`

Archive a chat (hide from main list).

**Method Signature:**
```typescript
archiveChat(params: ArchiveChat): Promise<void>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID |

**Example:**
```typescript
await client.archiveChat({ chatId: "1234567890@c.us" });
console.log("✓ Chat archived");
```

---

## `unarchiveChat()`

Restore an archived chat to main list.

**Method Signature:**
```typescript
unarchiveChat(params: UnarchiveChat): Promise<void>
```

**Example:**
```typescript
await client.unarchiveChat({ chatId: "1234567890@c.us" });
```

---

## `setDisappearingChat()`

Enable/disable disappearing messages (auto-delete) for a chat.

**Method Signature:**
```typescript
setDisappearingChat(params: SetDisappearingChat): Promise<SetDisappearingChatResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID |
| `ephemeralExpiration` | number | ✓ | Expiration in seconds: 86400 (1 day), 604800 (7 days), 2592000 (30 days), or 0 (disable) |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
// Enable 24-hour disappearing messages
await client.setDisappearingChat({
  chatId: "1234567890@c.us",
  ephemeralExpiration: 86400  // 1 day
});

// Disable disappearing messages
await client.setDisappearingChat({
  chatId: "1234567890@c.us",
  ephemeralExpiration: 0
});
```

**Valid Values:**
- `0` - Disable (messages permanent)
- `86400` - 1 day
- `604800` - 7 days
- `2592000` - 30 days

---

## `sendTyping()`

Show/hide typing indicator.

**Method Signature:**
```typescript
sendTyping(params: SendTyping): Promise<void>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID |
| `typing` | boolean | ✓ | `true` to show, `false` to hide |

**Example:**
```typescript
// Show typing
await client.sendTyping({ chatId: "1234567890@c.us", typing: true });

// Do work...
await new Promise(r => setTimeout(r, 3000));

// Stop typing
await client.sendTyping({ chatId: "1234567890@c.us", typing: false });
```

---

## `getChats()`

Retrieve a list of recent chats (contacts and groups).

**Method Signature:**
```typescript
getChats(count?: number): Promise<Chat[]>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `count` | number | ✗ | Number of chats to retrieve (default: 50) |

**Response:**
```typescript
[
  {
    id: string;                    // Chat ID
    title: string;                 // Contact name or group name
    isGroup: boolean;              // true for groups
    avatar?: string;               // Profile picture URL
    unreadCount?: number;          // Unread message count
    lastMessage?: string;          // Preview of last message
    lastMessageTime?: number;      // Timestamp
    lastInteractionTime?: number;  // Last message received/sent
    isArchived?: boolean;          // true if archived
  },
  // ...
]
```

**Example:**
```typescript
const chats = await client.getChats(20);

for (const chat of chats) {
  console.log(`${chat.title} - ${chat.isGroup ? 'Group' : 'Contact'}`);
  console.log(`  Unread: ${chat.unreadCount || 0}`);
}
```

---

## Common Patterns

### Auto-respond with Typing Indicator

```typescript
async function handleMessageWithTyping(chatId: string, responseMessage: string) {
  // Show typing
  await client.sendTyping({ chatId, typing: true });
  
  // Simulate processing
  await new Promise(r => setTimeout(r, 2000));
  
  // Send response
  await client.sendMessage({ chatId, message: responseMessage });
  
  // Typing stops automatically
}
```

### Manage Chat Archive

```typescript
async function archiveOldChats() {
  const chats = await client.getChats(100);
  const oldThreshold = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
  
  for (const chat of chats) {
    if ((chat.lastInteractionTime || 0) * 1000 < oldThreshold) {
      await client.archiveChat({ chatId: chat.id });
      console.log(`Archived: ${chat.title}`);
    }
  }
}
```

---

**See Also:**
- [Message Sending](./sending.md) - send original messages
- [Receiving](./receiving.md) - handle incoming messages
