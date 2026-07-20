# Statuses (Beta) Methods

Methods for managing WhatsApp status (stories) - images, videos, and text that disappear after 24 hours.

**Note:** Statuses are a beta feature in GREEN-API. Functionality may change.

---

## `sendTextStatus()`

Post a text-based status update.

**Method Signature:**
```typescript
sendTextStatus(params: SendTextStatus): Promise<SendTextStatusResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | ✓ | Status text (max 500 characters) |
| `backgroundColor` | string | ✗ | Hex color (e.g., `"#FF0000"`) |
| `textColor` | string | ✗ | Text color hex |
| `font` | number | ✗ | Font style (1-6) |

**Response:**
```typescript
{
  idMessage: string;  // Status ID
}
```

**Example:**
```typescript
const status = await client.sendTextStatus({
  message: "Hello, this is my status!",
  backgroundColor: "#0099FF",
  textColor: "#FFFFFF",
  font: 2
});

console.log(`Status posted: ${status.idMessage}`);
```

**Constraints:**
- Max 500 characters
- Status auto-expires after 24 hours
- Only text visible to contacts

---

## `sendMediaStatus()`

Post an image or video status.

**Method Signature:**
```typescript
sendMediaStatus(params: SendMediaStatus): Promise<SendMediaStatusResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | Blob \| File | ✓ | Image or video file |
| `caption` | string | ✗ | Optional caption (max 1024 chars) |

**Response:**
```typescript
{
  idMessage: string;
}
```

**Example:**
```typescript
const imageBuffer = fs.readFileSync('./vacation.jpg');
const blob = new Blob([imageBuffer], { type: 'image/jpeg' });

const status = await client.sendMediaStatus({
  file: blob,
  caption: "Beautiful sunset!"
});

console.log(`✓ Media status posted: ${status.idMessage}`);
```

**Supported Formats:**
- Images: JPG, PNG, WEBP, GIF
- Videos: MP4, 3GP (max ~5MB)

---

## `sendVoiceStatus()`

Post an audio/voice status.

**Method Signature:**
```typescript
sendVoiceStatus(params: SendVoiceStatus): Promise<SendVoiceStatusResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | Blob \| File | ✓ | Audio file (MP3, WAV, M4A) |
| `caption` | string | ✗ | Optional caption |

**Response:**
```typescript
{
  idMessage: string;
}
```

**Example:**
```typescript
const audioBuffer = fs.readFileSync('./message.m4a');
const blob = new Blob([audioBuffer], { type: 'audio/mp4' });

const status = await client.sendVoiceStatus({
  file: blob,
  caption: "Daily update"
});
```

---

## `deleteStatus()`

Delete your own status.

**Method Signature:**
```typescript
deleteStatus(params: DeleteStatus): Promise<void>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statusId` | string | ✓ | Status message ID (from send response) |

**Example:**
```typescript
await client.deleteStatus({ statusId: "BAE5D4E8766D60DD63B8FB6CCDA5D9D7" });
console.log("✓ Status deleted");
```

---

## `getStatusStatistic()`

Get view count and reactions for a status.

**Method Signature:**
```typescript
getStatusStatistic(params: GetStatusStatistic): Promise<GetStatusStatisticResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `statusId` | string | ✓ | Status ID |

**Response:**
```typescript
{
  viewedCount?: number;       // Number of views
  reactedCount?: number;      // Reactions count
  reactions?: Array<{
    reaction: string;         // Emoji
    count: number;            // How many
  }>;
}
```

**Example:**
```typescript
const stats = await client.getStatusStatistic({ 
  statusId: "BAE5D4E8766D60DD63B8FB6CCDA5D9D7" 
});

console.log(`Views: ${stats.viewedCount}`);
console.log(`Reactions: ${stats.reactedCount}`);
```

---

## `getIncomingStatuses()`

Retrieve statuses from your contacts.

**Method Signature:**
```typescript
getIncomingStatuses(params?: GetIncomingStatusesParams): Promise<IncomingStatusMessage[]>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `minutes` | number | ✗ | Look back N minutes (default: 60) |

**Response:**
```typescript
[
  {
    idMessage: string;
    timestamp: number;
    senderData: {
      chatId: string;        // Who posted the status
      senderName: string;
    };
    messageData: {
      textMessageData?: { textMessage: string };
      imageMessageData?: { urlFile: string };
      // ... media data
    };
  },
  // ...
]
```

**Example:**
```typescript
const statuses = await client.getIncomingStatuses({ minutes: 120 });

console.log(`Found ${statuses.length} statuses in last 2 hours`);

for (const status of statuses) {
  console.log(`From ${status.senderData.senderName}`);
}
```

---

## `getOutgoingStatuses()`

Retrieve your own posted statuses.

**Method Signature:**
```typescript
getOutgoingStatuses(params?: GetOutgoingStatusesParams): Promise<OutgoingStatusMessage[]>
```

**Example:**
```typescript
const myStatuses = await client.getOutgoingStatuses({ minutes: 1440 }); // Last 24h

for (const status of myStatuses) {
  console.log(`Posted: ${new Date(status.timestamp * 1000)}`);
}
```

---

## Common Patterns

### Post Daily Update Status

```typescript
async function postDailyStatus(message: string) {
  const response = await client.sendTextStatus({
    message,
    backgroundColor: "#1F2937",
    textColor: "#FFFFFF",
    font: 3
  });
  
  console.log(`✓ Daily update posted: ${response.idMessage}`);
  
  // Auto-delete after 24 hours (handled by WhatsApp)
  return response.idMessage;
}

// Usage
await postDailyStatus("Today's weather: Sunny, 72°F ☀️");
```

### Share Photo with Audience

```typescript
async function sharePhotoStatus(imageFilePath: string, caption: string) {
  const buffer = fs.readFileSync(imageFilePath);
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  
  const response = await client.sendMediaStatus({
    file: blob,
    caption
  });
  
  console.log(`✓ Photo shared: ${response.idMessage}`);
}

// Usage
await sharePhotoStatus('./event.jpg', 'Great event today! 🎉');
```

### Monitor Status Engagement

```typescript
async function checkStatusEngagement(statusId: string) {
  try {
    const stats = await client.getStatusStatistic({ statusId });
    
    console.log(`Status Performance:`);
    console.log(`  Views: ${stats.viewedCount || 0}`);
    console.log(`  Total Reactions: ${stats.reactedCount || 0}`);
    
    if (stats.reactions) {
      console.log(`  Breakdown:`);
      for (const r of stats.reactions) {
        console.log(`    ${r.reaction}: ${r.count}`);
      }
    }
  } catch (error) {
    console.error("Error fetching stats:", error.message);
  }
}
```

### Automated Daily Status Reporter

```typescript
async function setupDailyStatusReporter() {
  // Post status every morning at 8 AM
  setInterval(async () => {
    const now = new Date();
    
    if (now.getHours() === 8 && now.getMinutes() === 0) {
      const message = `Daily Report - ${now.toLocaleDateString()}\nAll systems operational ✓`;
      
      try {
        const status = await client.sendTextStatus({
          message,
          backgroundColor: "#10B981",
          textColor: "#FFFFFF"
        });
        
        console.log(`✓ Daily status posted: ${status.idMessage}`);
        
        // Check engagement after 2 hours
        setTimeout(async () => {
          const stats = await client.getStatusStatistic({ statusId: status.idMessage });
          console.log(`  2-hour engagement: ${stats.viewedCount} views`);
        }, 2 * 60 * 60 * 1000);
        
      } catch (error) {
        console.error("Failed to post status:", error.message);
      }
    }
  }, 60000); // Check every minute
}

setupDailyStatusReporter();
```

---

## Limitations & Notes

- **Beta Feature:** Status functionality may change in future updates
- **24-hour limit:** Statuses disappear after 24 hours
- **No replies:** Statuses don't support direct replies (use DMs)
- **Privacy:** Only visible to your contacts
- **File size:** Keep media under 5MB for best performance
- **Text only:** Text statuses best for announcements, media for visual content

---

**See Also:**
- [Message Sending](./sending.md) - send direct messages
- [Receiving](./receiving.md) - handle status updates (if webhooks enabled)
