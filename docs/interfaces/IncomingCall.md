[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / IncomingCall

# Interface: IncomingCall

Defined in: [types/calls.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/calls.ts)

Represents an incoming call entry from the lastIncomingCalls journal.

## Properties

### chatId

> **chatId**: `string`

Chat identifier where the call occurred.

***

### idMessage

> **idMessage**: `string`

Unique identifier for the incoming call.

***

### isGroup

> **isGroup**: `boolean`

Whether the call was to a group.

***

### isVideo

> **isVideo**: `boolean`

Whether it was a video call.

***

### status

> **status**: [`IncomingCallStatus`](../type-aliases/IncomingCallStatus.md)

Call status: `pickUp`, `hungUp`, or `declined`.

***

### timestamp

> **timestamp**: `number`

Call end time in UNIX format.

***

### type

> **type**: `"incoming"`

***

### typeMessage

> **typeMessage**: `"incomingCall"`
