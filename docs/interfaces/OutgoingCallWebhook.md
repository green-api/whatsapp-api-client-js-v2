[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / OutgoingCallWebhook

# Interface: OutgoingCallWebhook

Defined in: [types/webhooks.ts:94](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L94)

## Properties

### duration?

> `optional` **duration**: `number`

Defined in: [types/webhooks.ts:106](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L106)

***

### from

> **from**: `string`

Defined in: [types/webhooks.ts:95](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L95)

***

### idMessage

> **idMessage**: `string`

Defined in: [types/webhooks.ts:104](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L104)

***

### instanceData

> **instanceData**: `object`

Defined in: [types/webhooks.ts:97](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L97)

#### idInstance

> **idInstance**: `number`

#### typeInstance

> **typeInstance**: `string`

#### wid

> **wid**: `string`

***

### isVideo?

> `optional` **isVideo**: `boolean`

Defined in: [types/webhooks.ts:105](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L105)

***

### participants?

> `optional` **participants**: [`OutgoingCallParticipantStatus`](OutgoingCallParticipantStatus.md)[]

Defined in: [types/webhooks.ts:107](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L107)

***

### sendByApi?

> `optional` **sendByApi**: `boolean`

Defined in: [types/webhooks.ts:108](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L108)

***

### status

> **status**: [`CallStatus`](../type-aliases/CallStatus.md)

Defined in: [types/webhooks.ts:102](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L102)

***

### timestamp

> **timestamp**: `number`

Defined in: [types/webhooks.ts:103](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L103)

***

### typeWebhook

> **typeWebhook**: `"outgoingCall"`

Defined in: [types/webhooks.ts:96](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/webhooks.ts#L96)
