[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / StateInstanceHistoryItem

# Interface: StateInstanceHistoryItem

Defined in: [types/instance.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/instance.ts)

Represents a single state change record from the instance state history.

## Properties

### phoneNumber

> **phoneNumber**: `number`

Phone number associated with this state.

***

### stateInstance

> **stateInstance**: `"notAuthorized"` \| `"authorized"` \| `"blocked"`

Instance state at the time of the event.

***

### timestamp

> **timestamp**: `number`

Event time in UNIX format.
