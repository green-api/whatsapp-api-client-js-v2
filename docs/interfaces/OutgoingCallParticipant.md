[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / OutgoingCallParticipant

# Interface: OutgoingCallParticipant

Defined in: [types/calls.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/calls.ts)

Represents a participant's individual call status within an outgoing call.

## Properties

### id

> **id**: `string`

Personal chat identifier of the participant.

***

### status

> **status**: [`OutgoingCallStatus`](../type-aliases/OutgoingCallStatus.md)

Individual participant status: `pickUp`, `hungUp`, `declined`, or `invalid`.
