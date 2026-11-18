[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / CallError

# Class: CallError

Defined in: [calls/call-errors.ts:27](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/call-errors.ts#L27)

Error thrown by the calls methods and the calls connection.
code tells what went wrong, serverMessage keeps the text GREEN-API sent.

## Example

```typescript
try {
  await client.callsDial({chatId: "79001234567@c.us"});
} catch (error) {
  if (error instanceof CallError && error.code === "NO_RECENT_CONTACT") {
    console.log(error.message);
  }
}
```

## Extends

- [`GreenApiError`](GreenApiError.md)

## Constructors

### Constructor

> **new CallError**(`code`, `options`): `CallError`

Defined in: [calls/call-errors.ts:36](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/call-errors.ts#L36)

Creates a call error.

#### Parameters

##### code

[`CallErrorCode`](../type-aliases/CallErrorCode.md)

What went wrong

##### options

[`CallErrorOptions`](../interfaces/CallErrorOptions.md) = `{}`

Message, HTTP status and response from GREEN-API

#### Returns

`CallError`

#### Overrides

[`GreenApiError`](GreenApiError.md).[`constructor`](GreenApiError.md#constructor)

## Properties

### code

> `readonly` **code**: [`CallErrorCode`](../type-aliases/CallErrorCode.md)

Defined in: [calls/call-errors.ts:36](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/call-errors.ts#L36)

What went wrong

***

### response?

> `readonly` `optional` **response**: `unknown`

Defined in: [client/errors.ts:13](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/errors.ts#L13)

Response body from GREEN-API

#### Inherited from

[`GreenApiError`](GreenApiError.md).[`response`](GreenApiError.md#response)

***

### serverMessage?

> `readonly` `optional` **serverMessage**: `string`

Defined in: [calls/call-errors.ts:28](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/call-errors.ts#L28)

***

### statusCode?

> `readonly` `optional` **statusCode**: `number`

Defined in: [client/errors.ts:13](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/errors.ts#L13)

HTTP status of the response, undefined when GREEN-API could not be reached

#### Inherited from

[`GreenApiError`](GreenApiError.md).[`statusCode`](GreenApiError.md#statuscode)
