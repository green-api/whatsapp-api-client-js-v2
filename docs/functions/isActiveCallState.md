[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / isActiveCallState

# Function: isActiveCallState()

> **isActiveCallState**(`state`): `boolean`

Defined in: [calls/call-states.ts:10](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/call-states.ts#L10)

Checks whether a call state means a call is ringing or running.

## Parameters

### state

The call state

`undefined` | [`CallStateKind`](../type-aliases/CallStateKind.md)

## Returns

`boolean`

True for inc-call, out-call and on-call
