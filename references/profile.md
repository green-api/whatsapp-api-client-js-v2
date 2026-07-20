# Profile & Avatar Methods

Methods for managing your WhatsApp profile picture and information.

---

## `getAvatar()`

Retrieve the profile picture of a contact or yourself.

**Method Signature:**
```typescript
getAvatar(params: GetAvatar): Promise<GetAvatarResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Chat ID: `"1234567890@c.us"` (contact) or `"...-...@g.us"` (group) |

**Response:**
```typescript
{
  urlFile: string;  // Download URL for the avatar image
}
```

**Example:**
```typescript
const avatar = await client.getAvatar({
  chatId: "1234567890@c.us"
});

console.log(`Avatar URL: ${avatar.urlFile}`);

// Download and display
const response = await fetch(avatar.urlFile);
const imageBlob = await response.blob();
```

**For Groups:**
```typescript
const groupAvatar = await client.getAvatar({
  chatId: "120363xxxxx-123456789@g.us"
});
```

---

## `setProfilePicture()`

Change your own WhatsApp profile picture.

**Method Signature:**
```typescript
setProfilePicture(file: Blob | File): Promise<SetProfilePicture>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | Blob \| File | ✓ | Image file (JPG/PNG) |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example (Browser):**
```typescript
const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  const result = await client.setProfilePicture(file);
  console.log(`✓ Profile picture updated: ${result.result}`);
}
```

**Example (Node.js):**
```typescript
import fs from 'fs';

const imageBuffer = fs.readFileSync('./profile.jpg');
const blob = new Blob([imageBuffer], { type: 'image/jpeg' });

await client.setProfilePicture(blob);
console.log("✓ Profile picture set");
```

**Constraints:**
- Image max ~100KB
- Recommended: 500x500px square image
- JPG or PNG format
- Only affects your own profile

---

## Common Patterns

### Download All Contact Avatars

```typescript
async function downloadContactAvatars(outputDir: string = './avatars') {
  const fs = require('fs');
  const path = require('path');
  
  const contacts = await client.getContacts();
  
  for (const contact of contacts) {
    try {
      const avatar = await client.getAvatar({ chatId: contact.id });
      const response = await fetch(avatar.urlFile);
      const buffer = await response.buffer();
      
      const fileName = `${contact.name || contact.phoneContact}.jpg`;
      const filePath = path.join(outputDir, fileName);
      
      fs.writeFileSync(filePath, buffer);
      console.log(`✓ Saved ${contact.name}`);
    } catch (error) {
      console.log(`⚠ No avatar for ${contact.name}`);
    }
  }
}

await downloadContactAvatars('./contacts-avatars');
```

### Rotate Profile Picture Monthly

```typescript
async function rotateProfilePicture() {
  const pictures = [
    './profiles/pic1.jpg',
    './profiles/pic2.jpg',
    './profiles/pic3.jpg'
  ];
  
  let currentIndex = 0;
  
  // Change every 30 days
  setInterval(async () => {
    try {
      const picturePath = pictures[currentIndex % pictures.length];
      const buffer = fs.readFileSync(picturePath);
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      
      await client.setProfilePicture(blob);
      console.log(`✓ Profile picture updated to: ${picturePath}`);
      
      currentIndex++;
    } catch (error) {
      console.error("Error updating picture:", error.message);
    }
  }, 30 * 24 * 60 * 60 * 1000); // 30 days
}

rotateProfilePicture();
```

### Group Avatar Management

```typescript
async function getGroupAvatarUrl(groupId: string): Promise<string | null> {
  try {
    const avatar = await client.getAvatar({ chatId: groupId });
    return avatar.urlFile;
  } catch (error) {
    console.log(`No avatar for group ${groupId}`);
    return null;
  }
}

async function getAllGroupAvatars(groupIds: string[]): Promise<Record<string, string>> {
  const avatars: Record<string, string> = {};
  
  for (const groupId of groupIds) {
    const url = await getGroupAvatarUrl(groupId);
    if (url) {
      avatars[groupId] = url;
    }
  }
  
  return avatars;
}
```

---

**See Also:**
- [Account Management](./account.md) - profile settings
- [Contacts](./contacts.md) - contact avatars
- [Groups](./groups.md) - group avatar management
