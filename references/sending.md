# Message Sending Methods

All methods for sending various types of messages to contacts and groups.

---

## `sendMessage()`

Send a text message with optional link preview and custom formatting.

**Method Signature:**
```typescript
sendMessage(message: SendMessage): Promise<SendResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Recipient: `"1234567890@c.us"` (contact) or `"...-...@g.us"` (group) |
| `message` | string | ✓ | Message text (max 4096 characters) |
| `linkPreview` | boolean | ✗ | Enable link preview (default: `true`) |
| `typePreview` | "large" \| "small" | ✗ | Preview size (default: `"large"`) |
| `customPreview` | CustomPreview | ✗ | Custom link preview object |
| `quotedMessageId` | string | ✗ | ID of message to reply to (reply mode) |
| `typingTime` | number | ✗ | Show typing for N milliseconds before sending |

**CustomPreview Object:**
```typescript
{
  title?: string;           // Preview title
  description?: string;     // Preview description
  link?: string;           // URL
  urlFile?: string;        // Thumbnail image URL
  jpegThumbnail?: string;  // JPEG thumbnail (base64)
}
```

**Response:**
```typescript
{
  idMessage: string;  // Unique message ID
}
```

**Example:**
```typescript
const response = await client.sendMessage({
  chatId: "1234567890@c.us",
  message: "Check out this link!",
  linkPreview: true,
  typePreview: "large"
});

console.log(`Sent: ${response.idMessage}`);
```

**Constraints:**
- Max 4096 characters
- Minimum 700ms delay between messages to same/different chats (rate limit)
- Instance must be authorized
- chatId format must include `@c.us` suffix

---

## `sendFileByUrl()`

Send a file by providing a direct URL to the file.

**Method Signature:**
```typescript
sendFileByUrl(message: SendFileByUrl): Promise<SendResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Recipient ID: `"1234567890@c.us"` or group |
| `file.url` | string | ✓ | File URL (must be publicly accessible) |
| `file.fileName` | string | ✓ | File name (e.g., `"document.pdf"`) |
| `caption` | string | ✗ | Caption text (max 1024 chars for media) |
| `quotedMessageId` | string | ✗ | Reply to message ID |
| `typingTime` | number | ✗ | Typing duration in ms |
| `typingType` | "recording" | ✗ | Show recording indicator |

**Response:**
```typescript
{
  idMessage: string;
}
```

**Supported File Types:**
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Documents: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`, `.txt`
- Audio: `.mp3`, `.wav`, `.m4a`, `.ogg`
- Video: `.mp4`, `.3gp`, `.mov`, `.avi`

**Example:**
```typescript
const response = await client.sendFileByUrl({
  chatId: "1234567890@c.us",
  file: {
    url: "https://example.com/report.pdf",
    fileName: "monthly_report.pdf"
  },
  caption: "Please review the attached report"
});
```

**Constraints:**
- File must be publicly accessible (not behind login/paywall)
- File download timeout: typically 5-10 seconds
- Max file size: depends on your GREEN-API plan (usually 100MB)
- Minimum 1000ms delay between file sends

---

## `sendFileByUpload()`

Send a file by uploading it directly (from File/Blob object).

**Method Signature:**
```typescript
sendFileByUpload(message: SendFileByUpload): Promise<SendFileByUploadResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Recipient ID |
| `file.data` | Blob \| File | ✓ | File object (from `<input type="file">` or Buffer) |
| `file.fileName` | string | ✓ | File name with extension |
| `caption` | string | ✗ | Caption text |
| `quotedMessageId` | string | ✗ | Reply to message ID |
| `typingTime` | number | ✗ | Typing duration in ms |
| `typingType` | "recording" | ✗ | Show recording indicator |

**Response:**
```typescript
{
  idMessage: string;
  urlFile: string;  // Permanent URL to uploaded file (for future sending)
}
```

**Example (Browser):**
```typescript
// From file input
const fileInput = document.getElementById('file') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const response = await client.sendFileByUpload({
    chatId: "1234567890@c.us",
    file: {
      data: file,
      fileName: file.name
    },
    caption: "Here's the file you requested"
  });
  
  console.log(`Uploaded to: ${response.urlFile}`);
}
```

**Example (Node.js):**
```typescript
import fs from 'fs';

const fileBuffer = fs.readFileSync('./document.pdf');
const blob = new Blob([fileBuffer], { type: 'application/pdf' });

const response = await client.sendFileByUpload({
  chatId: "1234567890@c.us",
  file: {
    data: blob,
    fileName: "document.pdf"
  }
});
```

**Constraints:**
- File size limits depend on your plan
- Browser environment requires HTML5 File API
- MIME type is auto-detected from file extension

---

## `sendPoll()`

Send an interactive poll/survey question.

**Method Signature:**
```typescript
sendPoll(message: SendPoll): Promise<SendResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Recipient ID |
| `message` | string | ✓ | Poll question text |
| `options` | PollOption[] | ✓ | Array of poll options (2-12 items) |
| `multipleAnswers` | boolean | ✗ | Allow multiple selections (default: `false`) |
| `quotedMessageId` | string | ✗ | Reply to message ID |

**PollOption Interface:**
```typescript
{
  optionName: string;  // Option text (max 100 chars)
}
```

**Response:**
```typescript
{
  idMessage: string;
}
```

**Example:**
```typescript
const response = await client.sendPoll({
  chatId: "1234567890@c.us",
  message: "What's your favorite programming language?",
  options: [
    { optionName: "JavaScript" },
    { optionName: "Python" },
    { optionName: "Go" },
    { optionName: "Rust" }
  ],
  multipleAnswers: false
});
```

**Constraints:**
- Minimum 2 options, maximum 12 options
- Each option max 100 characters
- Question max 4096 characters
- Recipients can't edit their votes
- Polls work best with individual chats (group polls have limited support)

---

## `sendLocation()`

Send a location/map coordinate.

**Method Signature:**
```typescript
sendLocation(message: SendLocation): Promise<SendResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Recipient ID |
| `latitude` | number | ✓ | Latitude (-90 to 90) |
| `longitude` | number | ✓ | Longitude (-180 to 180) |
| `nameLocation` | string | ✗ | Location name (e.g., "Coffee Shop") |
| `address` | string | ✗ | Address text |
| `quotedMessageId` | string | ✗ | Reply to message ID |

**Response:**
```typescript
{
  idMessage: string;
}
```

**Example:**
```typescript
const response = await client.sendLocation({
  chatId: "1234567890@c.us",
  latitude: 40.7128,
  longitude: -74.0060,
  nameLocation: "Times Square",
  address: "Times Square, New York, NY 10036, USA"
});
```

**Constraints:**
- Coordinates must be valid (latitude: -90 to 90, longitude: -180 to 180)
- Location name and address are optional but recommended
- Recipient must have location sharing enabled in WhatsApp

---

## `sendContact()`

Send a contact card with phone number and optional name/company.

**Method Signature:**
```typescript
sendContact(message: SendContact): Promise<SendResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Recipient ID |
| `contact.phoneContact` | number | ✓ | Phone number (without country code prefix, as number) |
| `contact.firstName` | string | ✗ | First name |
| `contact.middleName` | string | ✗ | Middle name |
| `contact.lastName` | string | ✗ | Last name |
| `contact.company` | string | ✗ | Company name |
| `quotedMessageId` | string | ✗ | Reply to message ID |

**Response:**
```typescript
{
  idMessage: string;
}
```

**Example:**
```typescript
const response = await client.sendContact({
  chatId: "1234567890@c.us",
  contact: {
    phoneContact: 1234567890,  // Just the number, e.g., 1234567890
    firstName: "John",
    lastName: "Doe",
    company: "Acme Corp"
  }
});
```

**Constraints:**
- Phone number must be valid (10-15 digits)
- Do NOT include country code in the number itself (just digits)
- At least firstName is recommended

---

## `sendInteractiveButtons()`

Send a message with interactive button options (replies).

**Method Signature:**
```typescript
sendInteractiveButtons(params: SendInteractiveButtons): Promise<SendResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Recipient ID |
| `message` | string | ✓ | Button message/description text |
| `buttons` | Button[] | ✓ | Array of buttons (1-3 buttons) |
| `footer` | string | ✗ | Optional footer text |
| `quotedMessageId` | string | ✗ | Reply to message ID |

**Button Interface:**
```typescript
{
  buttonId: string;    // Unique ID for the button
  buttonText: string;  // Button label (max 25 chars)
}
```

**Response:**
```typescript
{
  idMessage: string;
}
```

**Example:**
```typescript
const response = await client.sendInteractiveButtons({
  chatId: "1234567890@c.us",
  message: "What would you like to do?",
  buttons: [
    { buttonId: "1", buttonText: "Option A" },
    { buttonId: "2", buttonText: "Option B" },
    { buttonId: "3", buttonText: "Option C" }
  ],
  footer: "Please select one option"
});
```

**Constraints:**
- Maximum 3 buttons per message
- Each button text max 25 characters
- Button IDs should be unique per message
- When user clicks, webhook/polling returns the buttonId

---

## `sendInteractiveButtonsReply()`

Advanced button message with structured button replies (for bot conversations).

**Method Signature:**
```typescript
sendInteractiveButtonsReply(params: SendInteractiveButtonsReply): Promise<SendResponse>
```

**Parameters:** Similar to `sendInteractiveButtons()`, with identical constraints.

**Use Case:** When you need to track which button was clicked and respond accordingly.

**Example:**
```typescript
const response = await client.sendInteractiveButtonsReply({
  chatId: "1234567890@c.us",
  message: "Choose a subscription plan:",
  buttons: [
    { buttonId: "basic", buttonText: "Basic" },
    { buttonId: "pro", buttonText: "Pro" },
    { buttonId: "enterprise", buttonText: "Enterprise" }
  ]
});

// Polling for response
const notification = await client.receiveNotification(10);
if (notification?.body.eventType === 'IncomingMessageReceived') {
  const reply = notification.body.messageData.extendedTextMessageData?.buttonReplyData;
  console.log(`User selected: ${reply?.selectedButtonId}`);
}
```

---

## `forwardMessages()`

Forward existing messages from one chat to another.

**Method Signature:**
```typescript
forwardMessages(request: ForwardMessages): Promise<ForwardMessagesResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Destination (where to forward) |
| `chatIdFrom` | string | ✓ | Source chat (where messages come from) |
| `messages` | string[] | ✓ | Array of message IDs to forward |

**Response:**
```typescript
{
  forwardedMessages: number;  // Count of successfully forwarded messages
}
```

**Example:**
```typescript
const response = await client.forwardMessages({
  chatId: "1234567890@c.us",      // Send to this chat
  chatIdFrom: "9876543210@c.us",  // From this chat
  messages: [
    "BAE5D4E8766D60DD63B8FB6CCDA5D9D7",
    "BAE5D4E8766D60DD63B8FB6CCDA5D9D8"
  ]
});

console.log(`Forwarded ${response.forwardedMessages} messages`);
```

**Constraints:**
- Both chats must be accessible to the instance
- Message IDs must exist and be valid
- Message IDs obtained via `getChatHistory()` or webhooks

---

## `uploadFile()`

Upload a file to GREEN-API storage for reuse via `sendFileByUrl()`.

**Method Signature:**
```typescript
uploadFile(file: Blob | File, customFileName?: string): Promise<UploadFile>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | Blob \| File | ✓ | File object |
| `customFileName` | string | ✗ | Override file name (with extension) |

**Response:**
```typescript
{
  urlFile: string;  // Permanent URL to stored file
}
```

**Example:**
```typescript
const fileBuffer = fs.readFileSync('./logo.png');
const blob = new Blob([fileBuffer], { type: 'image/png' });

const uploadResult = await client.uploadFile(blob, 'logo.png');
console.log(`File URL: ${uploadResult.urlFile}`);

// Reuse URL later
await client.sendFileByUrl({
  chatId: "1234567890@c.us",
  file: {
    url: uploadResult.urlFile,
    fileName: 'logo.png'
  }
});
```

**Constraints:**
- File size limits apply (check your plan)
- URL is permanent for the duration of your plan
- Useful for large files that will be sent multiple times

---

## `sendTyping()`

Show a "typing" indicator in a chat.

**Method Signature:**
```typescript
sendTyping(params: SendTyping): Promise<void>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Recipient ID |
| `typing` | boolean | ✓ | `true` to show typing, `false` to stop |

**Example:**
```typescript
// Show typing
await client.sendTyping({
  chatId: "1234567890@c.us",
  typing: true
});

// Do some work...
await new Promise(r => setTimeout(r, 2000));

// Stop typing and send message
await client.sendTyping({
  chatId: "1234567890@c.us",
  typing: false
});

await client.sendMessage({
  chatId: "1234567890@c.us",
  message: "I was typing..."
});
```

**Constraints:**
- Typing indicator automatically expires after 10-15 seconds
- Use responsibly (don't toggle constantly)

---

## Common Patterns

### Sending Batch Messages with Delays

```typescript
async function sendToGroup(chatIds: string[], message: string) {
  for (const chatId of chatIds) {
    try {
      await client.sendMessage({ chatId, message });
      console.log(`✓ Sent to ${chatId}`);
      
      // 700ms delay as per GREEN-API recommendation
      await new Promise(r => setTimeout(r, 700));
    } catch (error) {
      console.error(`✗ Failed to send to ${chatId}:`, error.message);
    }
  }
}

// Usage
await sendToGroup([
  "1234567890@c.us",
  "0987654321@c.us",
  "1111111111@c.us"
], "Hello everyone!");
```

### Sending Files with Progress

```typescript
async function sendFileWithFeedback(chatId: string, fileUrl: string) {
  try {
    await client.sendTyping({ chatId, typing: true });
    
    const response = await client.sendFileByUrl({
      chatId,
      file: {
        url: fileUrl,
        fileName: new URL(fileUrl).pathname.split('/').pop() || 'file'
      }
    });
    
    await client.sendTyping({ chatId, typing: false });
    return response;
  } catch (error) {
    await client.sendTyping({ chatId, typing: false });
    throw error;
  }
}
```

---

**See Also:**
- [Message Management](./messages.md) - editing and deleting messages
- [Receiving & Notifications](./receiving.md) - handling incoming messages
