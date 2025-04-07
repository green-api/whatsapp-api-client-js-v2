[**GREEN-API WhatsApp SDK v2 v1.0.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / OutgoingTextStatusMessage

# Interface: OutgoingTextStatusMessage

Defined in: [types/statuses.ts:105](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L105)

## Extends

- [`OutgoingStatusBase`](OutgoingStatusBase.md)

## Properties

### chatId

> **chatId**: `string`

Defined in: [types/statuses.ts:99](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L99)

#### Inherited from

[`OutgoingStatusBase`](OutgoingStatusBase.md).[`chatId`](OutgoingStatusBase.md#chatid)

***

### extendedTextMessage

> **extendedTextMessage**: [`ExtendedTextMessageDataStatus`](ExtendedTextMessageDataStatus.md) & `object`

Defined in: [types/statuses.ts:108](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L108)

#### Type declaration

##### participants?

> `optional` **participants**: `string`[]

***

### idMessage

> **idMessage**: `string`

Defined in: [types/statuses.ts:96](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L96)

#### Inherited from

[`OutgoingStatusBase`](OutgoingStatusBase.md).[`idMessage`](OutgoingStatusBase.md#idmessage)

***

### participants?

> `optional` **participants**: `string`[]

Defined in: [types/statuses.ts:102](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L102)

#### Inherited from

[`OutgoingStatusBase`](OutgoingStatusBase.md).[`participants`](OutgoingStatusBase.md#participants)

***

### sendByApi

> **sendByApi**: `boolean`

Defined in: [types/statuses.ts:101](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L101)

#### Inherited from

[`OutgoingStatusBase`](OutgoingStatusBase.md).[`sendByApi`](OutgoingStatusBase.md#sendbyapi)

***

### statusMessage

> **statusMessage**: [`OutgoingMessageStatus`](../type-aliases/OutgoingMessageStatus.md)

Defined in: [types/statuses.ts:100](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L100)

#### Inherited from

[`OutgoingStatusBase`](OutgoingStatusBase.md).[`statusMessage`](OutgoingStatusBase.md#statusmessage)

***

### textMessage

> **textMessage**: `string`

Defined in: [types/statuses.ts:107](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L107)

***

### timestamp

> **timestamp**: `number`

Defined in: [types/statuses.ts:97](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L97)

#### Inherited from

[`OutgoingStatusBase`](OutgoingStatusBase.md).[`timestamp`](OutgoingStatusBase.md#timestamp)

***

### type

> **type**: `"outgoing"`

Defined in: [types/statuses.ts:95](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L95)

#### Inherited from

[`OutgoingStatusBase`](OutgoingStatusBase.md).[`type`](OutgoingStatusBase.md#type)

***

### typeMessage

> **typeMessage**: `"extendedTextMessage"`

Defined in: [types/statuses.ts:106](https://github.com/green-api/whatsapp-api-client-js-v2/blob/6c31521abaa4e85365f3538298181cae99417bce/src/types/statuses.ts#L106)

#### Overrides

[`OutgoingStatusBase`](OutgoingStatusBase.md).[`typeMessage`](OutgoingStatusBase.md#typemessage)
