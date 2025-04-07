[**GREEN-API WhatsApp SDK v2 v1.0.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / OutgoingMessageStatusWebhook

# Interface: OutgoingMessageStatusWebhook

Defined in: [types/webhooks.ts:21](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L21)

Webhook payload received when a message status changes.
Used to track delivery and read receipts.

## Properties

### chatId

> **chatId**: `string`

Defined in: [types/webhooks.ts:23](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L23)

***

### description?

> `optional` **description**: `string`

Defined in: [types/webhooks.ts:32](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L32)

***

### idMessage

> **idMessage**: `string`

Defined in: [types/webhooks.ts:30](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L30)

***

### instanceData

> **instanceData**: `object`

Defined in: [types/webhooks.ts:24](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L24)

#### idInstance

> **idInstance**: `number`

#### typeInstance

> **typeInstance**: `string`

#### wid

> **wid**: `string`

***

### sendByApi

> **sendByApi**: `boolean`

Defined in: [types/webhooks.ts:33](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L33)

***

### status

> **status**: [`OutgoingMessageStatus`](../type-aliases/OutgoingMessageStatus.md)

Defined in: [types/webhooks.ts:31](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L31)

***

### timestamp

> **timestamp**: `number`

Defined in: [types/webhooks.ts:29](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L29)

***

### typeWebhook

> **typeWebhook**: `"outgoingMessageStatus"`

Defined in: [types/webhooks.ts:22](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L22)
