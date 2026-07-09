[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / SendInteractiveButtonsReply

# Interface: SendInteractiveButtonsReply

Defined in: [types/messages.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/messages.ts)

Parameters for sending a message with reply buttons that return text to the chat when clicked.
Supports up to 3 buttons per message. Each button can only be clicked once. Beta feature.

## Properties

### body

> **body**: `string`

Main message text.

***

### buttons

> **buttons**: [`InteractiveButtonReply`](InteractiveButtonReply.md)[]

Array of reply buttons. Maximum 3 buttons.

***

### chatId

> **chatId**: `string`

Chat identifier.

***

### footer?

> `optional` **footer**: `string`

Footer text displayed below the message body.

***

### header?

> `optional` **header**: `string`

Header text displayed above the message body.
