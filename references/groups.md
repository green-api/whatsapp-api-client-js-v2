# Group Management Methods

Methods for creating, modifying, and managing WhatsApp groups.

---

## `createGroup()`

Create a new WhatsApp group with participants.

**Method Signature:**
```typescript
createGroup(params: CreateGroup): Promise<CreateGroupResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupName` | string | ✓ | Group name (max 25 characters) |
| `chatIds` | string[] | ✓ | Participant phone IDs in format `"1234567890@c.us"` |

**Response:**
```typescript
{
  chatId: string;  // Group ID in format "120363xxxxx-123456789@g.us"
}
```

**Important:** The returned `chatId` is the group's unique identifier for all subsequent group operations.

**Example:**
```typescript
const group = await client.createGroup({
  groupName: "Project Team",
  chatIds: [
    "1234567890@c.us",
    "9876543210@c.us",
    "5555555555@c.us"
  ]
});

console.log(`Group created: ${group.chatId}`);
```

**Constraints:**
- Group name max 25 characters
- At least 2 participants required (besides creator)
- Group ID format: `120363xxxxxxxxxxxxx-123456789@g.us`
- Creator is automatically added as member

---

## `updateGroupName()`

Change the group's name.

**Method Signature:**
```typescript
updateGroupName(params: UpdateGroupName): Promise<UpdateGroupNameResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID in format `"...-...@g.us"` |
| `groupName` | string | ✓ | New group name (max 25 characters) |

**Response:**
```typescript
{
  result: boolean;  // true if successful
}
```

**Example:**
```typescript
const result = await client.updateGroupName({
  groupId: "120363xxxxxxxxxxxx-123456789@g.us",
  groupName: "Updated Project Team"
});

console.log(`Name updated: ${result.result}`);
```

**Constraints:**
- Only group admins can change the name
- Max 25 characters
- Instance account must be admin

---

## `getGroupData()`

Retrieve detailed information about a group.

**Method Signature:**
```typescript
getGroupData(params: GetGroupData): Promise<GroupData>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID |

**Response:**
```typescript
{
  id: string;                    // Group ID
  title: string;                 // Group name
  description?: string;          // Group description (if set)
  descId?: string;
  owner: string;                 // Group creator/admin chat ID
  creation: number;              // Unix timestamp of creation
  subjectOwner?: string;
  picture?: string;              // Group icon URL (if set)
  participants: Array<{
    id: string;                  // Participant chat ID
    isAdmin: boolean;            // Admin status
    isSuperAdmin: boolean;       // Super admin (creator) status
    displayName?: string;        // Participant name
  }>;
  isReadOnly?: boolean;          // Locked from participants
}
```

**Example:**
```typescript
const group = await client.getGroupData({
  groupId: "120363xxxxxxxxxxxx-123456789@g.us"
});

console.log(`Group: ${group.title}`);
console.log(`Members: ${group.participants.length}`);
console.log(`Admins: ${group.participants.filter(p => p.isAdmin).length}`);

for (const participant of group.participants) {
  console.log(`  - ${participant.displayName} ${participant.isAdmin ? '(admin)' : ''}`);
}
```

---

## `addGroupParticipant()`

Add a member to the group.

**Method Signature:**
```typescript
addGroupParticipant(params: AddGroupParticipant): Promise<AddGroupParticipantResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID |
| `participantChatId` | string | ✓ | Participant ID in format `"1234567890@c.us"` |

**Response:**
```typescript
{
  result: boolean;  // true if successfully added
}
```

**Example:**
```typescript
const result = await client.addGroupParticipant({
  groupId: "120363xxxxxxxxxxxx-123456789@g.us",
  participantChatId: "2222222222@c.us"
});

console.log(`Added: ${result.result}`);
```

**Constraints:**
- Only admins can add members
- Cannot add same person twice (returns false)
- Target must be a valid WhatsApp contact

---

## `removeGroupParticipant()`

Remove a member from the group.

**Method Signature:**
```typescript
removeGroupParticipant(params: RemoveGroupParticipant): Promise<RemoveGroupParticipantResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID |
| `participantChatId` | string | ✓ | Participant ID to remove |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
await client.removeGroupParticipant({
  groupId: "120363xxxxxxxxxxxx-123456789@g.us",
  participantChatId: "2222222222@c.us"
});
```

**Constraints:**
- Only admins can remove members
- Cannot remove the creator/owner
- Cannot remove if participant is not in group

---

## `setGroupAdmin()`

Promote a member to admin.

**Method Signature:**
```typescript
setGroupAdmin(params: SetGroupAdmin): Promise<SetGroupAdminResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID |
| `participantChatId` | string | ✓ | Participant to promote |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
await client.setGroupAdmin({
  groupId: "120363xxxxxxxxxxxx-123456789@g.us",
  participantChatId: "1234567890@c.us"
});
```

**Constraints:**
- Only current admins can promote
- Target must be an existing participant

---

## `removeAdmin()`

Demote an admin to regular member.

**Method Signature:**
```typescript
removeAdmin(params: RemoveAdmin): Promise<RemoveAdminResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID |
| `participantChatId` | string | ✓ | Admin to demote |

**Response:**
```typescript
{
  result: boolean;
}
```

---

## `setGroupPicture()`

Set or change the group's profile picture.

**Method Signature:**
```typescript
setGroupPicture(params: SetGroupPicture): Promise<SetGroupPictureResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID |
| `file` | Blob \| File | ✓ | Image file (JPG/PNG) |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example (Browser):**
```typescript
const fileInput = document.getElementById('image') as HTMLInputElement;
const imageFile = fileInput.files?.[0];

if (imageFile) {
  await client.setGroupPicture({
    groupId: "120363xxxxxxxxxxxx-123456789@g.us",
    file: imageFile
  });
}
```

**Constraints:**
- Only admins can set picture
- Image max ~100KB
- Recommended: JPG 500x500px

---

## `leaveGroup()`

Make the instance account leave the group.

**Method Signature:**
```typescript
leaveGroup(params: LeaveGroup): Promise<LeaveGroupResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
await client.leaveGroup({
  groupId: "120363xxxxxxxxxxxx-123456789@g.us"
});

console.log("Left the group");
```

**Constraints:**
- Cannot undo; must be re-added by someone else
- Instance must be a member

---

## `updateGroupSettings()`

Configure group settings (e.g., restricted messaging).

**Method Signature:**
```typescript
updateGroupSettings(params: UpdateGroupSettings): Promise<UpdateGroupSettingsResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `groupId` | string | ✓ | Group ID |
| `editGroupInfo` | "EVERYONE" \| "ADMIN_ONLY" | ✗ | Who can edit group info |
| `sendMessages` | "EVERYONE" \| "ADMIN_ONLY" | ✗ | Who can send messages |
| `disappearingMessagesInChat` | number | ✗ | Auto-delete messages in N days (0 to disable) |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
await client.updateGroupSettings({
  groupId: "120363xxxxxxxxxxxx-123456789@g.us",
  editGroupInfo: "ADMIN_ONLY",      // Only admins can modify group info
  sendMessages: "EVERYONE",          // All members can send messages
  disappearingMessagesInChat: 7      // Messages auto-delete after 7 days
});
```

**Constraints:**
- Only group admins can change settings
- Settings apply to all group members

---

## Common Patterns

### Create Group and Add Members

```typescript
async function setupNewTeam(teamName: string, memberPhones: number[]) {
  // Create initial group with first member
  const group = await client.createGroup({
    groupName: teamName,
    chatIds: [`${memberPhones[0]}@c.us`]
  });
  
  // Add remaining members
  for (let i = 1; i < memberPhones.length; i++) {
    await client.addGroupParticipant({
      groupId: group.chatId,
      participantChatId: `${memberPhones[i]}@c.us`
    });
    
    await new Promise(r => setTimeout(r, 500)); // Delay between adds
  }
  
  // Set group picture
  const logoUrl = 'https://example.com/logo.png';
  const response = await fetch(logoUrl);
  const imageBlob = await response.blob();
  
  await client.setGroupPicture({
    groupId: group.chatId,
    file: imageBlob
  });
  
  // Configure settings
  await client.updateGroupSettings({
    groupId: group.chatId,
    editGroupInfo: "ADMIN_ONLY",
    sendMessages: "EVERYONE"
  });
  
  return group.chatId;
}

// Usage
const groupId = await setupNewTeam("Sales Team", [1234567890, 9876543210, 5555555555]);
```

### List All Group Members and Their Roles

```typescript
async function listGroupMembers(groupId: string) {
  const group = await client.getGroupData({ groupId });
  
  console.log(`\n=== ${group.title} ===`);
  console.log(`Created: ${new Date(group.creation * 1000)}`);
  console.log(`Total members: ${group.participants.length}\n`);
  
  for (const participant of group.participants) {
    const role = participant.isSuperAdmin ? 'Creator' : participant.isAdmin ? 'Admin' : 'Member';
    console.log(`${participant.displayName} - ${role}`);
  }
}

await listGroupMembers("120363xxxxxxxxxxxx-123456789@g.us");
```

### Broadcast to Multiple Groups

```typescript
async function broadcastMessage(groupIds: string[], message: string) {
  for (const groupId of groupIds) {
    try {
      await client.sendMessage({
        chatId: groupId,
        message
      });
      console.log(`✓ Sent to group ${groupId}`);
      
      await new Promise(r => setTimeout(r, 700)); // Rate limit
    } catch (error) {
      console.error(`✗ Failed to send to ${groupId}:`, error.message);
    }
  }
}

const groups = [
  "120363xxx-111@g.us",
  "120363yyy-222@g.us",
  "120363zzz-333@g.us"
];

await broadcastMessage(groups, "Announcement: Meeting at 3 PM!");
```

---

**See Also:**
- [Message Sending](./sending.md) - send group messages
- [Receiving](./receiving.md) - get group notifications
