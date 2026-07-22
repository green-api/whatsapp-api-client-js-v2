# Journal & History Methods

Methods for accessing message and call history.

---

## `getMessage()`

Retrieve detailed information about a single message.

**Method Signature:**
```typescript
getMessage(params: GetMessage): Promise<JournalResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID |
| `idMessage` | string | ✓ | Message ID |

**Response:**
```typescript
{
  idMessage: string;
  timestamp: number;
  typeMessage: string;        // "textMessage", "imageMessage", etc.
  chatId: string;
  textMessageData?: { textMessage: string };
  imageMessageData?: { urlFile: string; ... };
  senderData?: { chatId: string; senderName: string };
  // ... other fields depending on messageType
}
```

**Example:**
```typescript
const message = await client.getMessage({
  chatId: "1234567890@c.us",
  idMessage: "BAE5D4E8766D60DD63B8FB6CCDA5D9D7"
});

console.log(`Message: ${message.textMessageData?.textMessage}`);
console.log(`Sent: ${new Date(message.timestamp * 1000)}`);
```

---

## `getChatHistory()`

Retrieve message history from a specific chat.

**Method Signature:**
```typescript
getChatHistory(params: GetChatHistory): Promise<JournalResponse[]>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID |
| `count` | number | ✗ | Number of messages (default: 100, max: 120) |
| `idMessage` | string | ✗ | Message ID to start from (for pagination) |

**Response:** Array of `JournalResponse` objects (same as `getMessage()`)

**Example:**
```typescript
const history = await client.getChatHistory({
  chatId: "1234567890@c.us",
  count: 50
});

console.log(`Found ${history.length} messages`);

for (const msg of history) {
  const timestamp = new Date(msg.timestamp * 1000);
  console.log(`[${timestamp.toLocaleTimeString()}] ${msg.typeMessage}`);
}
```

**Constraints:**
- Max 120 messages per request
- For pagination, use `idMessage` to fetch older messages

---

## `lastIncomingMessages()`

Get recent incoming messages from a time range.

**Method Signature:**
```typescript
lastIncomingMessages(minutes?: number): Promise<IncomingJournalResponse[]>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `minutes` | number | ✗ | Look back N minutes (default: 60, max: 10080 = 7 days) |

**Example:**
```typescript
// Messages received in last 30 minutes
const recent = await client.lastIncomingMessages(30);

console.log(`Received ${recent.length} messages`);
```

---

## `lastOutgoingMessages()`

Get recent outgoing (sent) messages from a time range.

**Method Signature:**
```typescript
lastOutgoingMessages(minutes?: number): Promise<OutgoingJournalResponse[]>
```

**Example:**
```typescript
// Messages sent in last 24 hours
const sent = await client.lastOutgoingMessages(1440);
```

---

## `lastIncomingCalls()`

Get recent incoming calls from a time range.

**Method Signature:**
```typescript
lastIncomingCalls(minutes?: number): Promise<IncomingCall[]>
```

**Response:**
```typescript
[
  {
    idCall: string;
    timestamp: number;          // Unix timestamp
    callerId: string;           // Caller's chat ID
    callerName: string;
    duration: number;           // Seconds
    status: string;             // "finished", "missed", "rejected", etc.
    isGroup: boolean;
  },
  // ...
]
```

**Example:**
```typescript
const calls = await client.lastIncomingCalls(1440); // Last 24 hours

for (const call of calls) {
  const date = new Date(call.timestamp * 1000);
  console.log(`${call.callerName} called at ${date.toLocaleTimeString()}`);
  console.log(`  Status: ${call.status}, Duration: ${call.duration}s`);
}
```

---

## `lastOutgoingCalls()`

Get recent outgoing calls from a time range.

**Method Signature:**
```typescript
lastOutgoingCalls(minutes?: number): Promise<OutgoingCall[]>
```

**Example:**
```typescript
const outgoing = await client.lastOutgoingCalls(7 * 24 * 60); // Last 7 days
```

---

## Common Patterns

### Search Chat History

```typescript
async function searchMessages(chatId: string, keyword: string): Promise<JournalResponse[]> {
  const history = await client.getChatHistory({
    chatId,
    count: 120  // Max
  });
  
  return history.filter(msg => {
    const text = msg.textMessageData?.textMessage || '';
    return text.toLowerCase().includes(keyword.toLowerCase());
  });
}

// Usage
const results = await searchMessages("1234567890@c.us", "invoice");
console.log(`Found ${results.length} messages with "invoice"`);
```

### Export Chat as JSON

```typescript
async function exportChatHistory(chatId: string) {
  const history = await client.getChatHistory({
    chatId,
    count: 120
  });
  
  const exported = history.map(msg => ({
    id: msg.idMessage,
    time: new Date(msg.timestamp * 1000).toISOString(),
    type: msg.typeMessage,
    text: msg.textMessageData?.textMessage,
    sender: msg.senderData?.senderName
  }));
  
  return JSON.stringify(exported, null, 2);
}
```

### Track Call Activity

```typescript
async function getCallStats(days: number = 30) {
  const minutes = days * 24 * 60;
  
  const incoming = await client.lastIncomingCalls(minutes);
  const outgoing = await client.lastOutgoingCalls(minutes);
  
  return {
    incomingCalls: incoming.length,
    outgoingCalls: outgoing.length,
    incomingDuration: incoming.reduce((sum, c) => sum + c.duration, 0),
    outgoingDuration: outgoing.reduce((sum, c) => sum + c.duration, 0),
    missedCalls: incoming.filter(c => c.status === 'missed').length
  };
}

const stats = await getCallStats(7);
console.log(`This week: ${stats.incomingCalls} incoming, ${stats.outgoingCalls} outgoing`);
console.log(`Missed: ${stats.missedCalls}`);
```

---

**See Also:**
- [Receiving & Notifications](./receiving.md) - handle incoming messages
- [Message Management](./messages.md) - edit/delete messages
