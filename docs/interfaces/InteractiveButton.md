[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / InteractiveButton

# Interface: InteractiveButton

Defined in: [types/messages.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/messages.ts)

Represents a single interactive action button for use with sendInteractiveButtons.
Button text is limited to 25 characters and a maximum of 3 buttons are allowed per message.

## Properties

### buttonId

> **buttonId**: `string`

Unique button identifier.

***

### buttonText

> **buttonText**: `string`

Button label text. Maximum 25 characters.

***

### copyCode?

> `optional` **copyCode**: `string`

Value to copy when button is pressed. Used when `type` is `"copy"`.

***

### phoneNumber?

> `optional` **phoneNumber**: `string`

Phone number to call. Used when `type` is `"call"`.

***

### type

> **type**: [`InteractiveButtonType`](../type-aliases/InteractiveButtonType.md)

Button action type: `"copy"`, `"call"`, or `"url"`.

***

### url?

> `optional` **url**: `string`

URL to open. Used when `type` is `"url"`.
