# Receiving & Notifications Methods

Methods for receiving incoming messages, calls, and notifications via polling or webhooks.

---

## Notification Types & Webhook Events

When using polling or webhooks, the SDK returns notifications with the following event types:

| Event Type | Description | Webhook Body Contains |
|------------|-------------|----------------------|
| `IncomingMessageReceived` | Incoming text/media message | Message text, sender, timestamp, media metadata |
| `OutgoingMessageReceived` | Outgoing message confirmed | Same as incoming (tracks your sent messages) |
| `IncomingCall` | Incoming WhatsApp call | Caller ID, timestamp |
| `OutgoingCall` | Outgoing call made | Recipient, timestamp |
| `StateInstanceChanged` | Authorization state changed | New state: `"authorized"` or `"notAuthorized"` |
| `Message` | Generic message event | Varies by message type |
| `Outgoing` | Outgoing webhook | Various outgoing events |
| `Incoming` | Incoming webhook | Various incoming events |

---

## `receiveNotification()`

Retrieve a single notification from the queue (polling approach).

**Method Signature:**
```typescript
receiveNotification(timeout?: number): Promise<ReceiveNotificationResponse | null>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeout` | number | ✗ | Wait timeout in seconds (default: 5, max: 30) |

**Response:**
```typescript
{
  receiptId: number;         // Unique notification ID (must delete after processing)
  body: {
    eventType: string;       // "IncomingMessageReceived", etc.
    idMessage: string;       // Message ID
    messageData: {
      textMessageData?: { textMessage: string };
      extendedTextMessageData?: { ... };
      imageMessageData?: { ... };
      // ... other message types
      senderData: {
        chatId: string;      // Sender's WhatsApp ID
        sender: string;
        senderName: string;
      };
      timestamp: number;     // Unix timestamp
    };
  };
}
```

Returns `null` if no notification within timeout.

**Example (Polling Loop):**
```typescript
async function pollMessages() {
  console.log("Starting message poller...");
  
  while (true) {
    try {
      const notification = await client.receiveNotification(5); // 5 sec timeout
      
      if (!notification) {
        console.log("No message (timeout)");
        continue;
      }
      
      // Process notification
      console.log(`Event: ${notification.body.eventType}`);
      
      if (notification.body.eventType === 'IncomingMessageReceived') {
        const msg = notification.body.messageData;
        const text = msg.textMessageData?.textMessage || '(media)';
        console.log(`From: ${msg.senderData.senderName}`);
        console.log(`Message: ${text}`);
      }
      
      // Must delete notification from queue
      await client.deleteNotification(notification.receiptId);
      
    } catch (error) {
      console.error("Polling error:", error.message);
      // Continue polling on error
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

pollMessages();
```

**Constraints:**
- Must call `deleteNotification()` to remove from queue
- Notifications expire after 24 hours if not deleted
- Timeout max 30 seconds (API limit)
- For high message volume, consider webhooks instead

---

## `deleteNotification()`

Remove a notification from the queue after processing.

**Method Signature:**
```typescript
deleteNotification(receiptId: number): Promise<DeleteNotificationResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `receiptId` | number | ✓ | Notification receipt ID from `receiveNotification()` |

**Response:**
```typescript
{
  result: boolean;  // true if deleted, false if not found
}
```

**Example:**
```typescript
const notification = await client.receiveNotification(5);
if (notification) {
  console.log(`Processing notification ${notification.receiptId}`);
  
  // ... process the notification ...
  
  const deleted = await client.deleteNotification(notification.receiptId);
  console.log(`Deleted: ${deleted.result}`);
}
```

**Important:** Always delete after processing to prevent duplicate processing.

---

## `lastIncomingMessages()`

Retrieve recent incoming messages within a time range.

**Method Signature:**
```typescript
lastIncomingMessages(minutes?: number): Promise<IncomingJournalResponse[]>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `minutes` | number | ✗ | Look back N minutes (default: 60, max: 10080 = 7 days) |

**Response:** Array of messages
```typescript
[
  {
    idMessage: string;
    timestamp: number;           // Unix timestamp
    typeMessage: string;         // "textMessage", "imageMessage", etc.
    chatId: string;              // Recipient chat
    senderData: {
      chatId: string;            // Sender ID
      sender: string;
      senderName: string;
    };
    textMessageData?: { textMessage: string };
    imageMessageData?: { urlFile: string; ... };
    // ... other message types depending on typeMessage
  },
  // ... more messages
]
```

**Example:**
```typescript
// Get messages from last hour
const messages = await client.lastIncomingMessages(60);

console.log(`Found ${messages.length} messages in last hour`);

for (const msg of messages) {
  console.log(`From: ${msg.senderData.senderName} at ${new Date(msg.timestamp * 1000)}`);
  console.log(`Type: ${msg.typeMessage}`);
}
```

**Constraints:**
- Max lookback: 10080 minutes (7 days)
- Returns archived messages too
- Does not include deleted messages

---

## `lastOutgoingMessages()`

Retrieve recent outgoing (sent) messages.

**Method Signature:**
```typescript
lastOutgoingMessages(minutes?: number): Promise<OutgoingJournalResponse[]>
```

**Parameters & Response:** Same as `lastIncomingMessages()`

**Example:**
```typescript
// Get messages sent in last 30 minutes
const sentMessages = await client.lastOutgoingMessages(30);

for (const msg of sentMessages) {
  console.log(`To: ${msg.chatId} at ${new Date(msg.timestamp * 1000)}`);
}
```

---

## `lastIncomingCalls()`

Retrieve recent incoming WhatsApp calls.

**Method Signature:**
```typescript
lastIncomingCalls(minutes?: number): Promise<IncomingCall[]>
```

**Response:**
```typescript
[
  {
    idCall: string;
    timestamp: number;
    callerId: string;           // Who called
    callerName: string;
    duration: number;           // Call duration in seconds
    status: string;             // "finished", "missed", etc.
  },
  // ...
]
```

**Example:**
```typescript
const calls = await client.lastIncomingCalls(120);

for (const call of calls) {
  console.log(`${call.callerName} called ${call.duration}s ago`);
  console.log(`Duration: ${call.duration}s, Status: ${call.status}`);
}
```

---

## `lastOutgoingCalls()`

Retrieve recent outgoing WhatsApp calls.

**Method Signature:**
```typescript
lastOutgoingCalls(minutes?: number): Promise<OutgoingCall[]>
```

**Response:** Same structure as incoming calls with recipient info.

---

## Webhook Integration

Instead of polling, you can configure webhooks to receive notifications in real-time.

### Setup (Manual in Console)

1. Go to https://console.green-api.com/
2. Select your instance
3. Go to **API** → **Webhooks** tab
4. Set webhook URL (e.g., `https://your-domain.com/webhook`)
5. Webhook must be HTTPS and reachable

### Receiving Webhook (Express.js Example)

```typescript
import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  const notification = req.body;
  
  // Example notification structure:
  // {
  //   eventType: "IncomingMessageReceived",
  //   idMessage: "BAE5D4E8...",
  //   messageData: {
  //     textMessageData: { textMessage: "Hello" },
  //     senderData: { chatId: "1234567890@c.us", senderName: "John" },
  //     timestamp: 1621234567
  //   }
  // }
  
  if (notification.eventType === 'IncomingMessageReceived') {
    const msg = notification.messageData;
    console.log(`From ${msg.senderData.senderName}: ${msg.textMessageData?.textMessage}`);
    
    // Process message (e.g., send AI response)
    handleIncomingMessage(msg);
  }
  
  // Always respond quickly
  res.json({ result: true });
});

app.listen(3000);
```

### Webhook vs Polling

| Method | Pros | Cons |
|--------|------|------|
| **Polling** | Simple, no server setup needed | Latency, uses more API calls |
| **Webhooks** | Real-time, efficient, scalable | Requires HTTPS server, firewall config |

---

## Common Patterns

### Build a Simple Chat Bot

```typescript
async function runChatbot() {
  console.log("Chatbot started (polling mode)");
  
  while (true) {
    try {
      const notification = await client.receiveNotification(10);
      
      if (!notification) continue;
      
      const msg = notification.body.messageData;
      const text = msg.textMessageData?.textMessage;
      
      if (text && notification.body.eventType === 'IncomingMessageReceived') {
        // Echo the message
        await client.sendMessage({
          chatId: msg.senderData.chatId,
          message: `You said: "${text}"`
        });
        
        // 700ms delay for rate limiting
        await new Promise(r => setTimeout(r, 700));
      }
      
      // Clean up
      await client.deleteNotification(notification.receiptId);
      
    } catch (error) {
      console.error("Error:", error.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

runChatbot();
```

### Monitor Message Activity

```typescript
async function monitorActivity() {
  const startTime = Date.now();
  
  while (Date.now() - startTime < 3600000) { // 1 hour
    const incoming = await client.lastIncomingMessages(1);
    const outgoing = await client.lastOutgoingMessages(1);
    
    console.log(`[${new Date().toLocaleTimeString()}]`);
    console.log(`  Incoming: ${incoming.length}`);
    console.log(`  Outgoing: ${outgoing.length}`);
    
    await new Promise(r => setTimeout(r, 60000)); // 60 sec interval
  }
}

monitorActivity();
```

---

**See Also:**
- [Message Sending](./sending.md) - send replies
- [Journal & History](./journal.md) - access message details
