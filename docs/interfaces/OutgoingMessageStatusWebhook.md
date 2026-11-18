[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / OutgoingMessageStatusWebhook

# Interface: OutgoingMessageStatusWebhook

Defined in: [types/webhooks.ts:23](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L23)

Webhook payload received when a message status changes.
Used to track delivery and read receipts.

## Properties

### chatId

> **chatId**: `string`

Defined in: [types/webhooks.ts:25](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L25)

***

### description?

> `optional` **description**: `string`

Defined in: [types/webhooks.ts:34](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L34)

***

### idMessage

> **idMessage**: `string`

Defined in: [types/webhooks.ts:32](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L32)

***

### instanceData

> **instanceData**: `object`

Defined in: [types/webhooks.ts:26](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L26)

#### idInstance

> **idInstance**: `number`

#### typeInstance

> **typeInstance**: `string`

#### wid

> **wid**: `string`

***

### sendByApi

> **sendByApi**: `boolean`

Defined in: [types/webhooks.ts:35](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L35)

***

### status

> **status**: [`OutgoingMessageStatus`](../type-aliases/OutgoingMessageStatus.md)

Defined in: [types/webhooks.ts:33](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L33)

***

### timestamp

> **timestamp**: `number`

Defined in: [types/webhooks.ts:31](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L31)

***

### typeWebhook

> **typeWebhook**: `"outgoingMessageStatus"`

Defined in: [types/webhooks.ts:24](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L24)
