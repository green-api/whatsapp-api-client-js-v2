# Files & Download Methods

Methods for downloading files and media sent through WhatsApp.

---

## `downloadFile()`

Get a download URL for a file that was received in a message.

**Method Signature:**
```typescript
downloadFile(params: DownloadFileRequest): Promise<DownloadFileResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID where file was received |
| `idMessage` | string | ✓ | Message ID containing the file |

**Response:**
```typescript
{
  downloadUrl: string;  // Direct download URL
}
```

**Example:**
```typescript
// First, get the message
const message = await client.getMessage({
  chatId: "1234567890@c.us",
  idMessage: "BAE5D4E8766D60DD63B8FB6CCDA5D9D7"
});

// If it has media, download
if (message.imageMessageData?.urlFile) {
  const downloadUrl = await client.downloadFile({
    chatId: "1234567890@c.us",
    idMessage: message.idMessage
  });
  
  console.log(`Download at: ${downloadUrl.downloadUrl}`);
}
```

**Supported File Types:**
- Images (JPG, PNG, WEBP, GIF)
- Documents (PDF, Word, Excel, PowerPoint, etc.)
- Audio (MP3, WAV, M4A, OGG)
- Video (MP4, 3GP, MOV, AVI)

**Constraints:**
- URL expires after ~24 hours
- Requires download within rate limits
- Works for received files only

---

## `uploadFile()`

Upload a file to GREEN-API storage for later use via `sendFileByUrl()`.

**Method Signature:**
```typescript
uploadFile(file: Blob | File, customFileName?: string): Promise<UploadFile>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | Blob \| File | ✓ | File object |
| `customFileName` | string | ✗ | Optional override for file name |

**Response:**
```typescript
{
  urlFile: string;  // Permanent URL to uploaded file
}
```

**Example (Node.js):**
```typescript
import fs from 'fs';

// Read file from disk
const fileBuffer = fs.readFileSync('./invoice.pdf');
const blob = new Blob([fileBuffer], { type: 'application/pdf' });

const uploadResult = await client.uploadFile(blob, 'invoice.pdf');
console.log(`Uploaded: ${uploadResult.urlFile}`);

// Later, send to multiple contacts
for (const chatId of chatIds) {
  await client.sendFileByUrl({
    chatId,
    file: {
      url: uploadResult.urlFile,
      fileName: 'invoice.pdf'
    },
    caption: 'Your invoice'
  });
  
  await new Promise(r => setTimeout(r, 1000)); // 1s delay
}
```

**Example (Browser):**
```typescript
// From file input
const fileInput = document.getElementById('upload') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const uploadResult = await client.uploadFile(file);
  console.log(`File uploaded: ${uploadResult.urlFile}`);
}
```

**Constraints:**
- File size limits depend on your plan
- URL persists as long as you maintain the plan
- Useful for templates, logos, or files sent frequently

---

## Common Patterns

### Download and Archive Files

```typescript
async function archiveFilesFromChat(chatId: string) {
  const history = await client.getChatHistory({ chatId, count: 120 });
  const archived = [];
  
  for (const msg of history) {
    // Check if message has media
    if (msg.imageMessageData?.urlFile || msg.documentMessageData) {
      try {
        const downloadData = await client.downloadFile({
          chatId,
          idMessage: msg.idMessage
        });
        
        // Download file
        const response = await fetch(downloadData.downloadUrl);
        const buffer = await response.arrayBuffer();
        
        archived.push({
          messageId: msg.idMessage,
          fileUrl: downloadData.downloadUrl,
          type: msg.typeMessage,
          timestamp: msg.timestamp
        });
      } catch (error) {
        console.error(`Error archiving message ${msg.idMessage}:`, error.message);
      }
    }
  }
  
  return archived;
}
```

### Batch Upload Templates

```typescript
async function uploadTemplates(templateDir: string): Promise<Record<string, string>> {
  const fs = require('fs');
  const path = require('path');
  
  const files = fs.readdirSync(templateDir);
  const urls: Record<string, string> = {};
  
  for (const filename of files) {
    const filePath = path.join(templateDir, filename);
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer]);
    
    const uploadResult = await client.uploadFile(blob, filename);
    urls[filename] = uploadResult.urlFile;
    
    console.log(`✓ Uploaded ${filename}`);
  }
  
  return urls;
}

const templates = await uploadTemplates('./templates');
// templates = {
//   'logo.png': 'https://api.green-api.com/files/...',
//   'invoice.pdf': 'https://api.green-api.com/files/...'
// }
```

### Send Files to Group

```typescript
async function sendFileToGroup(groupId: string, fileUrl: string, fileName: string) {
  const response = await client.sendFileByUrl({
    chatId: groupId,
    file: {
      url: fileUrl,
      fileName: fileName
    },
    caption: `Sharing: ${fileName}`
  });
  
  console.log(`✓ File sent to group: ${response.idMessage}`);
}
```

---

**See Also:**
- [Message Sending](./sending.md) - send files with `sendFileByUrl()` or `sendFileByUpload()`
- [Journal & History](./journal.md) - access message details for files
