# Queues & Webhooks Methods

Methods for managing message and webhook queues.

---

## Message Queue

GREEN-API uses an internal queue for messages to be sent or received. These methods help manage that queue.

---

## `showMessagesQueue()`

View all pending messages waiting to be sent.

**Method Signature:**
```typescript
showMessagesQueue(): Promise<QueueMessage[]>
```

**Response:**
```typescript
[
  {
    idMessage: string;           // Message ID
    createdAt: number;           // Unix timestamp (when queued)
    description?: string;        // Error description if any
    // ... other fields
  },
  // ...
]
```

**Example:**
```typescript
const queue = await client.showMessagesQueue();
console.log(`Messages in queue: ${queue.length}`);

for (const msg of queue) {
  console.log(`- ${msg.idMessage}: ${msg.description || 'pending'}`);
}
```

**Use Case:** Monitor stuck messages, debug send failures.

---

## `clearMessagesQueue()`

Clear all pending messages from the queue.

**Method Signature:**
```typescript
clearMessagesQueue(): Promise<ClearMessagesQueue>
```

**Response:**
```typescript
{
  result: boolean;  // true if cleared successfully
}
```

**Example:**
```typescript
const result = await client.clearMessagesQueue();
console.log(`Queue cleared: ${result.result}`);
```

**⚠️ Caution:** This will discard all queued messages. Use carefully.

---

## Webhook Queue

Webhooks that fail to deliver are queued for retry. Manage them here.

---

## `getWebhooksCount()`

Check how many undelivered webhooks are in the queue.

**Method Signature:**
```typescript
getWebhooksCount(): Promise<GetWebhooksCountResponse>
```

**Response:**
```typescript
{
  count: number;  // Number of pending webhooks
}
```

**Example:**
```typescript
const response = await client.getWebhooksCount();

if (response.count > 0) {
  console.log(`⚠ ${response.count} undelivered webhooks`);
  // Check your webhook endpoint
}
```

**Interpretation:**
- `0` - All webhooks delivered successfully
- `> 0` - Your webhook endpoint is down or slow (fix it, then retry)

---

## `clearWebhooksQueue()`

Clear all pending webhooks from the queue.

**Method Signature:**
```typescript
clearWebhooksQueue(): Promise<ClearWebhooksQueueResponse>
```

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
await client.clearWebhooksQueue();
console.log("✓ Webhook queue cleared");
```

**⚠️ Caution:** Clears undelivered notifications. Webhooks won't be retried.

---

## Common Patterns

### Monitor Queue Health

```typescript
async function monitorQueueHealth() {
  setInterval(async () => {
    try {
      const messageQueue = await client.showMessagesQueue();
      const webhookCount = await client.getWebhooksCount();
      
      console.log(`[${new Date().toLocaleTimeString()}]`);
      console.log(`  Messages queued: ${messageQueue.length}`);
      console.log(`  Webhook backlog: ${webhookCount.count}`);
      
      if (messageQueue.length > 100) {
        console.warn("⚠ High message queue - check instance status");
      }
      
      if (webhookCount.count > 50) {
        console.warn("⚠ High webhook backlog - check endpoint");
      }
    } catch (error) {
      console.error("Monitoring error:", error.message);
    }
  }, 60000); // Check every minute
}

monitorQueueHealth();
```

### Retry Failed Webhooks

```typescript
async function retryFailedWebhooks() {
  const count = await client.getWebhooksCount();
  
  if (count.count > 0) {
    console.log(`Retrying ${count.count} failed webhooks...`);
    
    // Fix your webhook endpoint first, then:
    // GREEN-API will automatically retry after a delay
    
    // Check again after 5 minutes
    await new Promise(r => setTimeout(r, 300000));
    
    const updatedCount = await client.getWebhooksCount();
    console.log(`Remaining: ${updatedCount.count}`);
  }
}
```

### Clear Stuck Messages (Emergency)

```typescript
async function clearStuckMessages() {
  console.warn("⚠️ Clearing stuck messages. This will discard pending sends.");
  
  const queue = await client.showMessagesQueue();
  
  if (queue.length > 0) {
    console.log(`Found ${queue.length} stuck messages:`);
    queue.forEach(msg => console.log(`  - ${msg.idMessage}`));
    
    const result = await client.clearMessagesQueue();
    console.log(`Queue cleared: ${result.result}`);
  } else {
    console.log("Queue is empty");
  }
}
```

---

## Queue Management Best Practices

1. **Monitor regularly:** Check queues every 5-10 minutes in production
2. **Fix webhooks:** If webhook backlog grows, fix your endpoint before clearing
3. **Don't over-clear:** Clearing discards data; only clear when investigating issues
4. **Log activity:** Record queue sizes to track patterns and debug
5. **Rate limiting:** Don't send messages faster than 700ms apart

---

**See Also:**
- [Receiving & Notifications](./receiving.md) - webhook configuration
- [Message Sending](./sending.md) - batch sending best practices
