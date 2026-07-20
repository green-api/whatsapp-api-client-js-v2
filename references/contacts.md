# Contacts Management Methods

Methods for managing WhatsApp contacts in your address book.

---

## `getContacts()`

Retrieve all saved contacts in your WhatsApp address book.

**Method Signature:**
```typescript
getContacts(): Promise<Contact[]>
```

**Response:**
```typescript
[
  {
    id: string;                // Contact chat ID
    name: string;              // Display name
    phoneContact: number;      // Phone number
    avatar?: string;           // Profile picture URL
    isWA: boolean;             // Whether they're on WhatsApp
  },
  // ...
]
```

**Example:**
```typescript
const contacts = await client.getContacts();

console.log(`Total contacts: ${contacts.length}`);

for (const contact of contacts) {
  if (contact.isWA) {
    console.log(`${contact.name} - ${contact.phoneContact}`);
  }
}
```

---

## `getContactInfo()`

Get detailed information about a specific contact.

**Method Signature:**
```typescript
getContactInfo(params: GetAvatar): Promise<ContactInfo>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | Contact ID in format `"1234567890@c.us"` |

**Response:**
```typescript
{
  id: string;                  // Contact ID
  name?: string;               // Display name (if saved)
  shortName?: string;          // Short name
  avatar?: string;             // Profile picture URL
  status?: string;             // Status text
  statusTimestamp?: number;    // When status was updated
  isWA: boolean;               // On WhatsApp
  phoneContact?: number;
}
```

**Example:**
```typescript
const info = await client.getContactInfo({
  chatId: "1234567890@c.us"
});

console.log(`${info.name}: ${info.status}`);
```

---

## `checkWhatsapp()`

Verify if a phone number has WhatsApp account.

**Method Signature:**
```typescript
checkWhatsapp(params: CheckWhatsapp): Promise<CheckWhatsappResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phoneNumber` | number | ✓ | Phone number (10-15 digits, no country code) |

**Response:**
```typescript
{
  isWA: boolean;  // true if has WhatsApp, false if not
}
```

**Example:**
```typescript
const result = await client.checkWhatsapp({ phoneNumber: 1234567890 });

if (result.isWA) {
  console.log("✓ This person has WhatsApp");
} else {
  console.log("✗ Not on WhatsApp");
}
```

**Use Case:** Before sending messages or adding to groups.

---

## `addContact()`

Save a new contact to the address book.

**Method Signature:**
```typescript
addContact(params: AddContact): Promise<AddContactResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phoneContact` | number | ✓ | Phone number |
| `firstName` | string | ✓ | First name |
| `lastName` | string | ✗ | Last name |
| `middleName` | string | ✗ | Middle name |
| `nameContact` | string | ✗ | Full display name |
| `company` | string | ✗ | Company |

**Response:**
```typescript
{
  contactId: string;  // Contact ID
  result: boolean;
}
```

**Example:**
```typescript
const contact = await client.addContact({
  phoneContact: 1234567890,
  firstName: "John",
  lastName: "Doe",
  company: "Acme Corp"
});

console.log(`Added contact: ${contact.contactId}`);
```

---

## `editContact()`

Update an existing contact's information.

**Method Signature:**
```typescript
editContact(params: EditContact): Promise<EditContactResponse>
```

**Parameters:** Same as `addContact()`, plus:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phoneContactOld` | number | ✓ | Old phone number (to identify which contact to update) |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
await client.editContact({
  phoneContactOld: 1234567890,
  phoneContact: 1234567891,  // New number
  firstName: "John",
  lastName: "Smith",         // Updated last name
  company: "Tech Solutions"
});
```

---

## `deleteContact()`

Remove a contact from the address book.

**Method Signature:**
```typescript
deleteContact(params: DeleteContact): Promise<DeleteContactResponse>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phoneContact` | number | ✓ | Phone number of contact to delete |

**Response:**
```typescript
{
  result: boolean;
}
```

**Example:**
```typescript
await client.deleteContact({ phoneContact: 1234567890 });
console.log("✓ Contact deleted");
```

---

## Common Patterns

### Sync External Contact List

```typescript
async function syncContactList(externalContacts: Array<{name: string, phone: number}>) {
  console.log("Syncing contacts...");
  
  for (const external of externalContacts) {
    try {
      await client.addContact({
        phoneContact: external.phone,
        firstName: external.name.split(' ')[0],
        lastName: external.name.split(' ').slice(1).join(' ') || ''
      });
      
      console.log(`✓ Added ${external.name}`);
    } catch (error) {
      console.log(`⚠ ${external.name} might already exist`);
    }
  }
}
```

### Find WhatsApp Users

```typescript
async function findWhatsAppUsers(phoneNumbers: number[]) {
  const waUsers = [];
  
  for (const phone of phoneNumbers) {
    try {
      const result = await client.checkWhatsapp({ phoneNumber: phone });
      
      if (result.isWA) {
        waUsers.push(phone);
        console.log(`✓ ${phone} has WhatsApp`);
      }
    } catch (error) {
      console.error(`✗ Error checking ${phone}:`, error.message);
    }
  }
  
  return waUsers;
}

const phoneList = [1234567890, 9876543210, 5555555555];
const waUsers = await findWhatsAppUsers(phoneList);
console.log(`Found ${waUsers.length} WhatsApp users`);
```

### Get Contact Avatar

```typescript
async function getContactAvatar(phoneNumber: number): Promise<string | null> {
  try {
    const chatId = `${phoneNumber}@c.us`;
    const info = await client.getContactInfo({ chatId });
    return info.avatar || null;
  } catch (error) {
    console.error(`Error fetching avatar for ${phoneNumber}:`, error.message);
    return null;
  }
}
```

---

**See Also:**
- [Message Sending](./sending.md) - send to contacts
- [Group Management](./groups.md) - add contacts to groups
