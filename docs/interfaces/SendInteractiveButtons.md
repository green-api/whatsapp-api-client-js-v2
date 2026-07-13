[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / SendInteractiveButtons

# Interface: SendInteractiveButtons

Defined in: [types/messages.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/messages.ts)

Parameters for sending a message with interactive action buttons (copy/call/url) to a private chat.
Supports up to 3 buttons per message. Beta feature.

## Properties

### body

> **body**: `string`

Main message text. Maximum 20,000 characters.

***

### buttons

> **buttons**: [`InteractiveButton`](InteractiveButton.md)[]

Array of interactive buttons. Maximum 3 buttons.

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
