[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / CallState

# Interface: CallState

Defined in: [types/calls.ts:53](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L53)

Call state from callsState and the calls connection.
reason comes only with the idle state that ends a call, and only on the calls connection.

## Properties

### info?

> `optional` **info**: [`CallInfo`](CallInfo.md)

Defined in: [types/calls.ts:55](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L55)

***

### reason?

> `optional` **reason**: `string`

Defined in: [types/calls.ts:56](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L56)

***

### state

> **state**: [`CallStateKind`](../type-aliases/CallStateKind.md)

Defined in: [types/calls.ts:54](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L54)
