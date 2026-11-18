[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / SendFileByUpload

# Interface: SendFileByUpload

Defined in: [types/messages.ts:37](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/messages.ts#L37)

Common properties shared by all message types.

## Extends

- [`BaseMessage`](BaseMessage.md)

## Properties

### caption?

> `optional` **caption**: `string`

Defined in: [types/messages.ts:42](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/messages.ts#L42)

***

### chatId

> **chatId**: `string`

Defined in: [types/messages.ts:7](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/messages.ts#L7)

#### Inherited from

[`BaseMessage`](BaseMessage.md).[`chatId`](BaseMessage.md#chatid)

***

### file

> **file**: `object`

Defined in: [types/messages.ts:38](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/messages.ts#L38)

#### data

> **data**: `Blob` \| `File`

#### fileName

> **fileName**: `string`

***

### quotedMessageId?

> `optional` **quotedMessageId**: `string`

Defined in: [types/messages.ts:8](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/messages.ts#L8)

#### Inherited from

[`BaseMessage`](BaseMessage.md).[`quotedMessageId`](BaseMessage.md#quotedmessageid)

***

### typingTime?

> `optional` **typingTime**: `number`

Defined in: [types/messages.ts:43](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/messages.ts#L43)

***

### typingType?

> `optional` **typingType**: `"recording"`

Defined in: [types/messages.ts:44](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/messages.ts#L44)
