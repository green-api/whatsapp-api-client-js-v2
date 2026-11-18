[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / describeCallEndReason

# Function: describeCallEndReason()

> **describeCallEndReason**(`reason`?): `undefined` \| `string`

Defined in: [calls/call-states.ts:21](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/call-states.ts#L21)

Describes why a call ended, from the reason GREEN-API sends with the idle state.
Reasons the SDK does not know are returned as they came.

## Parameters

### reason?

`string`

The reason from the idle call state

## Returns

`undefined` \| `string`

Human-readable reason, or undefined when there is none
