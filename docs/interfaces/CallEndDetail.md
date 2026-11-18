[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / CallEndDetail

# Interface: CallEndDetail

Defined in: [types/calls.ts:141](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L141)

How a call ended. reason is call-ended when GREEN-API ended it, connection-lost when the calls connection dropped.
cause is GREEN-API's own word (hangup, timeout, rejected, accepted_elsewhere...), description is readable text.

## Properties

### cause?

> `optional` **cause**: `string`

Defined in: [types/calls.ts:143](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L143)

***

### description

> **description**: `string`

Defined in: [types/calls.ts:144](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L144)

***

### reason

> **reason**: `"call-ended"` \| `"connection-lost"`

Defined in: [types/calls.ts:142](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L142)
