[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / IncomingBlockWebhook

# Interface: IncomingBlockWebhook

Defined in: [types/webhooks.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/webhooks.ts)

Webhook payload received when a contact blocks the account.

## Properties

### chatId

> **chatId**: `string`

Identifier of the chat where the block occurred.

***

### instanceData

> **instanceData**: `object`

#### idInstance

> **idInstance**: `number`

#### typeInstance

> **typeInstance**: `string`

#### wid

> **wid**: `string`

***

### timestamp

> **timestamp**: `number`

Event time in UNIX format.

***

### typeWebhook

> **typeWebhook**: `"incomingBlock"`
