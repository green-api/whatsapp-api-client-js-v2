[**GREEN-API WhatsApp SDK v2 v1.0.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / MessageWebhook

# Interface: MessageWebhook

Defined in: [types/webhooks.ts:47](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L47)

## Properties

### idMessage

> **idMessage**: `string`

Defined in: [types/webhooks.ts:55](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L55)

***

### instanceData

> **instanceData**: `object`

Defined in: [types/webhooks.ts:49](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L49)

#### idInstance

> **idInstance**: `number`

#### typeInstance

> **typeInstance**: `string`

#### wid

> **wid**: `string`

***

### messageData

> **messageData**: [`WebhookMessageData`](../type-aliases/WebhookMessageData.md) & `object`

Defined in: [types/webhooks.ts:63](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L63)

#### Type declaration

##### quotedMessage?

> `optional` **quotedMessage**: QuotedMessage \| undefined

***

### senderData

> **senderData**: `object`

Defined in: [types/webhooks.ts:56](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L56)

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

Defined in: [types/webhooks.ts:54](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L54)

***

### typeWebhook

> **typeWebhook**: `"outgoingAPIMessageReceived"` \| `"outgoingMessageReceived"` \| `"incomingMessageReceived"`

Defined in: [types/webhooks.ts:48](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/webhooks.ts#L48)
