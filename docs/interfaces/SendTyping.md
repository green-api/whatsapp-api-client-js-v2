[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / SendTyping

# Interface: SendTyping

Defined in: [types/messages.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/messages.ts)

Parameters for sending a typing or audio recording indicator to a chat.

## Properties

### chatId

> **chatId**: `string`

Chat identifier.

***

### typingTime?

> `optional` **typingTime**: `number`

Duration the indicator is displayed, in milliseconds. Valid range: 1000–20000.

***

### typingType?

> `optional` **typingType**: `"recording"`

Set to `"recording"` to show an audio recording indicator instead of the default typing indicator.
