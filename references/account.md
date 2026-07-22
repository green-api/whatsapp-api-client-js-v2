# Account & Instance Management Methods

Methods for managing authentication, authorization, and instance settings.

---

## `getStateInstance()`

Check the current authorization state of the WhatsApp instance.

**Method Signature:**
```typescript
getStateInstance(): Promise<StateInstance>
```

**Parameters:** None

**Response:**
```typescript
{
  stateInstance: "authorized" | "notAuthorized" | "banned" | "sleeping";
}
```

**Example:**
```typescript
const state = await client.getStateInstance();

if (state.stateInstance === "authorized") {
  console.log("✓ Instance is ready to use");
} else if (state.stateInstance === "notAuthorized") {
  console.log("✗ Must scan QR code first");
  const qr = await client.getQR();
  console.log("Scan this QR with WhatsApp:", qr.qrCode);
} else if (state.stateInstance === "banned") {
  console.log("✗ Instance is banned (contact support)");
}
```

**State Values:**
- `"authorized"` - Ready to send/receive messages
- `"notAuthorized"` - Must scan QR code (use `getQR()`)
- `"banned"` - Account banned (contact support)
- `"sleeping"` - Instance sleeping (reboot with `reboot()`)

**Important:** Check this before any operation. If not authorized, scanning QR is required.

---

## `getQR()`

Get the QR code for authorizing the instance (first-time setup).

**Method Signature:**
```typescript
getQR(): Promise<QR>
```

**Response:**
```typescript
{
  qrCode: string;  // Base64-encoded image or PNG URL of QR code
}
```

**Example:**
```typescript
const qr = await client.getQR();

// For browser (display as image)
const img = document.createElement('img');
img.src = `data:image/png;base64,${qr.qrCode}`;
document.body.appendChild(img);

console.log("Scan this QR code with WhatsApp on your phone");
```

**Process:**
1. Get QR code with `getQR()`
2. Open WhatsApp on your phone
3. Go to Settings → Linked Devices
4. Scan the QR code
5. Verify authorization with `getStateInstance()`

**Constraints:**
- QR expires after ~1 minute
- If it expires, call `getQR()` again
- Only needed on first authorization

---

## `reboot()`

Restart the WhatsApp instance.

**Method Signature:**
```typescript
reboot(): Promise<Reboot>
```

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
console.log("Rebooting instance...");
await client.reboot();
console.log("✓ Reboot initiated");

// Wait for reboot
await new Promise(r => setTimeout(r, 10000));

// Verify state
const state = await client.getStateInstance();
console.log(`State: ${state.stateInstance}`);
```

**Constraints:**
- Reboots take 5-15 seconds
- All connections briefly interrupted
- Instance auto-reconnects after reboot

---

## `logout()`

Disconnect and deauthorize the instance (sign out).

**Method Signature:**
```typescript
logout(): Promise<Logout>
```

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
await client.logout();
console.log("✓ Logged out. Must scan QR again to re-authorize.");
```

**Caution:** After logout, you must scan QR code again before using the SDK.

---

## `getSettings()`

Retrieve current instance settings.

**Method Signature:**
```typescript
getSettings(): Promise<Settings>
```

**Response:**
```typescript
{
  webhookUrl?: string;           // Webhook endpoint
  webhookUrlToken?: string;      // Webhook auth token
  incomingWebhook: "yes" | "no"; // Receive webhooks
  outgoingWebhook: "yes" | "no"; // Send webhooks
  outgoingMessageWebhook: "yes" | "no";
  // ... other settings
}
```

**Example:**
```typescript
const settings = await client.getSettings();
console.log(`Webhooks enabled: ${settings.incomingWebhook === 'yes'}`);
```

---

## `setSettings()`

Update instance settings (webhooks, notification behavior, etc.).

**Method Signature:**
```typescript
setSettings(settings: Settings): Promise<SetSettingsResponse>
```

**Parameters:** Partial `Settings` object (only include fields to change)

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
// Enable webhooks
await client.setSettings({
  webhookUrl: "https://your-domain.com/webhook",
  incomingWebhook: "yes",
  outgoingWebhook: "yes"
});

console.log("✓ Webhooks configured");
```

---

## `getWaSettings()`

Get WhatsApp account-specific settings (status, privacy, etc.).

**Method Signature:**
```typescript
getWaSettings(): Promise<WaSettings>
```

**Response:**
```typescript
{
  accountSettings: {
    statusPrivacy: "everyone" | "contacts" | "nobody";
    lastSeenPrivacy: "everyone" | "contacts" | "nobody";
    onlineStatus: boolean;
  };
}
```

---

## `setProfilePicture()`

Change the WhatsApp account profile picture.

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
const input = document.getElementById('profile-pic') as HTMLInputElement;
const file = input.files?.[0];

if (file) {
  await client.setProfilePicture(file);
  console.log("✓ Profile picture updated");
}
```

**Constraints:**
- Image max ~100KB
- Recommended: 500x500px square image
- JPG or PNG format

---

## `getAuthorizationCode()`

Get the authorization code for linking a new phone number (backup).

**Method Signature:**
```typescript
getAuthorizationCode(phoneNumber: number): Promise<GetAuthorizationCode>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phoneNumber` | number | ✓ | Phone number (10-15 digits, no country code) |

**Response:**
```typescript
{
  authorizationCode: string;  // 6-digit code to enter on target phone
}
```

**Use Case:** For 2-device authorization or phone account recovery.

---

## `updateApiToken()`

Generate a new API token for this instance (security rotation).

**Method Signature:**
```typescript
updateApiToken(): Promise<UpdateApiTokenResponse>
```

**Response:**
```typescript
{
  apiTokenInstance: string;  // New token
}
```

**Example:**
```typescript
const response = await client.updateApiToken();
console.log(`New token: ${response.apiTokenInstance}`);
console.log("Update your code to use the new token");
```

**Caution:** Old token becomes invalid immediately. Update your code before generating new one.

---

## `getStateInstanceHistory()`

Retrieve the authorization history of the instance.

**Method Signature:**
```typescript
getStateInstanceHistory(count?: number): Promise<StateInstanceHistoryItem[]>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `count` | number | ✗ | Number of history entries (default: 100) |

**Response:**
```typescript
[
  {
    stateInstance: "authorized";
    lastStateChangeTime: number;  // Unix timestamp
  },
  // ... more entries
]
```

---

## Common Patterns

### Startup Health Check

```typescript
async function healthCheck() {
  try {
    const state = await client.getStateInstance();
    
    if (state.stateInstance === "authorized") {
      console.log("✓ Instance is ready");
      return true;
    } else if (state.stateInstance === "notAuthorized") {
      console.log("⚠ Not authorized. Getting QR code...");
      const qr = await client.getQR();
      console.log("Scan QR:", qr.qrCode);
      return false;
    } else if (state.stateInstance === "sleeping") {
      console.log("⚠ Instance sleeping. Rebooting...");
      await client.reboot();
      await new Promise(r => setTimeout(r, 10000));
      return await healthCheck(); // Retry
    }
  } catch (error) {
    console.error("✗ Health check failed:", error.message);
    return false;
  }
}

// On startup
if (await healthCheck()) {
  console.log("Ready to send messages");
}
```

### Rotate API Token Periodically

```typescript
async function rotateTokenMonthly() {
  const lastRotation = new Date(localStorage.getItem('lastTokenRotation') || 0);
  const daysSinceRotation = (Date.now() - lastRotation.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceRotation > 30) {
    console.log("Rotating API token...");
    const newToken = await client.updateApiToken();
    
    // Update environment or config
    console.log(`New token: ${newToken.apiTokenInstance}`);
    
    localStorage.setItem('lastTokenRotation', new Date().toISOString());
  }
}
```

---

**See Also:**
- [Receiving](./receiving.md) - for webhook configuration
- [Profile](./profile.md) - for avatar management
