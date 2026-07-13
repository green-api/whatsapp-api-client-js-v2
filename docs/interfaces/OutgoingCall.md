[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / OutgoingCall

# Interface: OutgoingCall

Defined in: [types/calls.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/calls.ts)

Represents an outgoing call entry from the lastOutgoingCalls journal.

## Properties

### chatId

> **chatId**: `string`

Chat identifier where the call occurred.

***

### duration

> **duration**: `number`

Call duration in seconds.

***

### idMessage

> **idMessage**: `string`

Unique identifier for the outgoing call.

***

### isVideo

> **isVideo**: `boolean`

Whether it was a video call.

***

### participants

> **participants**: [`OutgoingCallParticipant`](OutgoingCallParticipant.md)[]

Array of individual participant statuses.

***

### status

> **status**: [`OutgoingCallStatus`](../type-aliases/OutgoingCallStatus.md)

Overall call status: `pickUp`, `hungUp`, `invalid`, or `declined`.

***

### timestamp

> **timestamp**: `number`

Call end time in UNIX format.

***

### type

> **type**: `"outgoing"`

***

### typeMessage

> **typeMessage**: `"outgoingCall"`
