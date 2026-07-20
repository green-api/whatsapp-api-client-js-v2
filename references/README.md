# Method References Index

Quick reference for all documented methods organized by category.

---

## Message Sending

**File:** [`sending.md`](./sending.md)

| Method | Purpose | Key Params |
|--------|---------|-----------|
| `sendMessage()` | Text message | chatId, message |
| `sendFileByUrl()` | File from URL | chatId, file.url, file.fileName |
| `sendFileByUpload()` | File from upload | chatId, file.data, file.fileName |
| `sendPoll()` | Poll/survey | chatId, message, options |
| `sendLocation()` | Map location | chatId, latitude, longitude |
| `sendContact()` | Contact card | chatId, contact.phoneContact |
| `sendInteractiveButtons()` | Buttons (v1) | chatId, message, buttons |
| `sendInteractiveButtonsReply()` | Buttons (v2) | chatId, message, buttons |
| `forwardMessages()` | Forward from chat | chatId, chatIdFrom, messages |
| `uploadFile()` | Upload to storage | file, customFileName |
| `sendTyping()` | Typing indicator | chatId, typing |

---

## Receiving & Notifications

**File:** [`receiving.md`](./receiving.md)

| Method | Purpose | Returns |
|--------|---------|---------|
| `receiveNotification()` | Poll single notification | ReceiveNotificationResponse \| null |
| `deleteNotification()` | Remove from queue | DeleteNotificationResponse |
| `lastIncomingMessages()` | Recent incoming | IncomingJournalResponse[] |
| `lastOutgoingMessages()` | Recent outgoing | OutgoingJournalResponse[] |
| `lastIncomingCalls()` | Recent incoming calls | IncomingCall[] |
| `lastOutgoingCalls()` | Recent outgoing calls | OutgoingCall[] |

---

## Message Management

**File:** [`messages.md`](./messages.md)

| Method | Purpose | Key Params |
|--------|---------|-----------|
| `editMessage()` | Edit sent message | chatId, idMessage, message |
| `deleteMessage()` | Delete message | chatId, idMessage |
| `readChat()` | Mark as read | chatId |
| `archiveChat()` | Archive chat | chatId |
| `unarchiveChat()` | Restore chat | chatId |
| `setDisappearingChat()` | Auto-delete msgs | chatId, ephemeralExpiration |
| `getChats()` | List recent chats | count (optional) |
| `sendTyping()` | Typing indicator | chatId, typing |

---

## Group Management

**File:** [`groups.md`](./groups.md)

| Method | Purpose | Key Params |
|--------|---------|-----------|
| `createGroup()` | Create group | groupName, chatIds |
| `updateGroupName()` | Rename group | groupId, groupName |
| `getGroupData()` | Get group info | groupId |
| `addGroupParticipant()` | Add member | groupId, participantChatId |
| `removeGroupParticipant()` | Remove member | groupId, participantChatId |
| `setGroupAdmin()` | Promote to admin | groupId, participantChatId |
| `removeAdmin()` | Demote from admin | groupId, participantChatId |
| `setGroupPicture()` | Change group icon | groupId, file |
| `leaveGroup()` | Leave group | groupId |
| `updateGroupSettings()` | Configure group | groupId, editGroupInfo, sendMessages |

---

## Account & Instance

**File:** [`account.md`](./account.md)

| Method | Purpose | Returns |
|--------|---------|---------|
| `getStateInstance()` | Auth state | StateInstance |
| `getQR()` | QR code | QR |
| `getSettings()` | Instance settings | Settings |
| `setSettings()` | Update settings | SetSettingsResponse |
| `getWaSettings()` | WhatsApp settings | WaSettings |
| `setProfilePicture()` | Change profile pic | SetProfilePicture |
| `getAuthorizationCode()` | Auth code | GetAuthorizationCode |
| `updateApiToken()` | Rotate token | UpdateApiTokenResponse |
| `getStateInstanceHistory()` | Auth history | StateInstanceHistoryItem[] |
| `reboot()` | Restart instance | Reboot |
| `logout()` | Sign out | Logout |

---

## Contacts

**File:** [`contacts.md`](./contacts.md)

| Method | Purpose | Key Params |
|--------|---------|-----------|
| `getContacts()` | List contacts | (none) |
| `getContactInfo()` | Contact details | chatId |
| `checkWhatsapp()` | Is on WhatsApp? | phoneNumber |
| `addContact()` | Save contact | phoneContact, firstName |
| `editContact()` | Update contact | phoneContactOld, ... |
| `deleteContact()` | Remove contact | phoneContact |

---

## Journal & History

**File:** [`journal.md`](./journal.md)

| Method | Purpose | Returns |
|--------|---------|---------|
| `getMessage()` | Single message | JournalResponse |
| `getChatHistory()` | Chat messages | JournalResponse[] |
| `lastIncomingMessages()` | Time-based incoming | IncomingJournalResponse[] |
| `lastOutgoingMessages()` | Time-based outgoing | OutgoingJournalResponse[] |
| `lastIncomingCalls()` | Time-based calls | IncomingCall[] |
| `lastOutgoingCalls()` | Time-based outgoing calls | OutgoingCall[] |

---

## Files & Downloads

**File:** [`files.md`](./files.md)

| Method | Purpose | Key Params |
|--------|---------|-----------|
| `downloadFile()` | Get download URL | chatId, idMessage |
| `uploadFile()` | Upload to storage | file, customFileName |

---

## Queues & Webhooks

**File:** [`queues.md`](./queues.md)

| Method | Purpose | Returns |
|--------|---------|---------|
| `showMessagesQueue()` | Pending messages | QueueMessage[] |
| `clearMessagesQueue()` | Clear msg queue | ClearMessagesQueue |
| `getWebhooksCount()` | Undelivered hooks | GetWebhooksCountResponse |
| `clearWebhooksQueue()` | Clear webhook queue | ClearWebhooksQueueResponse |

---

## Statuses (Beta)

**File:** [`statuses.md`](./statuses.md)

| Method | Purpose | Key Params |
|--------|---------|-----------|
| `sendTextStatus()` | Post text status | message, backgroundColor |
| `sendMediaStatus()` | Post media status | file, caption |
| `sendVoiceStatus()` | Post voice status | file, caption |
| `deleteStatus()` | Delete status | statusId |
| `getStatusStatistic()` | View count & reactions | statusId |
| `getIncomingStatuses()` | Received statuses | minutes |
| `getOutgoingStatuses()` | Your statuses | minutes |

---

## Profile & Avatar

**File:** [`profile.md`](./profile.md)

| Method | Purpose | Key Params |
|--------|---------|-----------|
| `getAvatar()` | Get profile picture | chatId |
| `setProfilePicture()` | Change profile pic | file |

---

## Chat ID Formats (Critical)

Always use these exact formats:

```typescript
// Individual contact (phone number → chat ID)
"1234567890@c.us"              // ✓ Correct
"1234567890"                   // ✗ Wrong (missing @c.us)
"+11234567890@c.us"            // ✗ Wrong (country code)

// Group (from createGroup response)
"120363xxxxxxxxxxxxx-123456789@g.us"  // ✓ Correct
"120363xxxxxxxxxxxxx-123456789"       // ✗ Wrong (missing @g.us)
```

---

## Rate Limiting (Important)

Add delays between sends to avoid hitting API limits:

```typescript
await new Promise(r => setTimeout(r, 700));    // 700ms between messages
await new Promise(r => setTimeout(r, 1000));   // 1s between file sends
```

---

## Error Handling Patterns

```typescript
// Always wrap in try-catch
try {
  const response = await client.sendMessage({...});
  console.log("Success:", response.idMessage);
} catch (error) {
  console.error("Failed:", error.message);
  // 400: Invalid chatId or not authorized
  // 401: Invalid token
  // 429: Rate limited
}
```

---

## Cross-References

### Common Workflows

**Send message with file:**
1. `uploadFile()` from `files.md`
2. `sendFileByUrl()` from `sending.md`

**Receive and respond:**
1. `receiveNotification()` from `receiving.md`
2. `sendMessage()` from `sending.md`
3. `deleteNotification()` from `receiving.md`

**Manage group:**
1. `createGroup()` from `groups.md`
2. `addGroupParticipant()` from `groups.md`
3. `setGroupAdmin()` from `groups.md`
4. `sendMessage()` to groupId from `sending.md`

**Authenticate:**
1. `getStateInstance()` from `account.md`
2. If not authorized, `getQR()` from `account.md`
3. Scan QR with WhatsApp
4. Verify with `getStateInstance()` again

---

## Navigation Tips

- **By Use Case:** Start with `SKILL.md` for your scenario
- **By Method Name:** Use this index to find the reference file
- **By Category:** Look for method group in table above
- **Detailed Examples:** Read the full reference file

---

**For detailed documentation, see individual reference files:**

- [`sending.md`](./sending.md) - 11 methods
- [`receiving.md`](./receiving.md) - 6 methods  
- [`messages.md`](./messages.md) - 8 methods
- [`groups.md`](./groups.md) - 10 methods
- [`account.md`](./account.md) - 11 methods
- [`contacts.md`](./contacts.md) - 6 methods
- [`journal.md`](./journal.md) - 6 methods
- [`files.md`](./files.md) - 2 methods
- [`queues.md`](./queues.md) - 4 methods
- [`statuses.md`](./statuses.md) - 7 methods
- [`profile.md`](./profile.md) - 2 methods

**Total: 73 method references across 11 categories**
