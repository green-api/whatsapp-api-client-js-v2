[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / ClearWebhooksQueueResponse

# Interface: ClearWebhooksQueueResponse

Defined in: [types/messages.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/messages.ts)

Response from the clearWebhooksQueue method.

## Properties

### isCleared

> **isCleared**: `boolean`

Whether the queue was successfully cleared.

***

### leftTime?

> `optional` **leftTime**: `number`

Seconds remaining until the next call is allowed. Present when rate-limited.

***

### reason?

> `optional` **reason**: `string`

Error description. Present when `isCleared` is `false`.
