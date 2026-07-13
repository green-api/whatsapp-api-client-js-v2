[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / Chat

# Interface: Chat

Defined in: [types/messages.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/messages.ts)

Represents a WhatsApp chat entry returned by the getChats method.

## Properties

### archive

> **archive**: `boolean`

Whether the chat is archived.

***

### ephemeralExpiration

> **ephemeralExpiration**: `0` \| `86400` \| `604800` \| `7776000`

Message lifespan in seconds. 0 means disabled.

***

### ephemeralSettingTimestamp

> **ephemeralSettingTimestamp**: `number`

Timestamp of the last ephemeral setting change in UNIX format.

***

### id

> **id**: `string`

Chat identifier.

***

### name

> **name**: `string`

Contact or group name.

***

### type

> **type**: `"user"` \| `"group"`

Chat type.
