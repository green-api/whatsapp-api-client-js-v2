[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / InteractiveButtonReply

# Interface: InteractiveButtonReply

Defined in: [types/messages.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/messages.ts)

Represents a single reply button for use with sendInteractiveButtonsReply.
When clicked, the button text is returned as a message to the chat.
Button text is limited to 25 characters and a maximum of 3 buttons are allowed per message.

## Properties

### buttonId

> **buttonId**: `string`

Unique button identifier.

***

### buttonText

> **buttonText**: `string`

Button label text returned to the chat when clicked. Maximum 25 characters.
