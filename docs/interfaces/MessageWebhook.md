[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / MessageWebhook

# Interface: MessageWebhook

Defined in: [types/webhooks.ts:49](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L49)

## Properties

### idMessage

> **idMessage**: `string`

Defined in: [types/webhooks.ts:57](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L57)

***

### instanceData

> **instanceData**: `object`

Defined in: [types/webhooks.ts:51](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L51)

#### idInstance

> **idInstance**: `number`

#### typeInstance

> **typeInstance**: `string`

#### wid

> **wid**: `string`

***

### messageData

> **messageData**: [`WebhookMessageData`](../type-aliases/WebhookMessageData.md) & `object`

Defined in: [types/webhooks.ts:65](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L65)

#### Type declaration

##### quotedMessage?

> `optional` **quotedMessage**: QuotedMessage \| undefined

***

### senderData

> **senderData**: `object`

Defined in: [types/webhooks.ts:58](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L58)

#### chatId

> **chatId**: `string`

#### chatName

> **chatName**: `string`

#### sender

> **sender**: `string`

#### senderContactName?

> `optional` **senderContactName**: `string`

#### senderName

> **senderName**: `string`

***

### timestamp

> **timestamp**: `number`

Defined in: [types/webhooks.ts:56](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L56)

***

### typeWebhook

> **typeWebhook**: `"outgoingAPIMessageReceived"` \| `"outgoingMessageReceived"` \| `"incomingMessageReceived"`

Defined in: [types/webhooks.ts:50](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L50)
