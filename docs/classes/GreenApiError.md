[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / GreenApiError

# Class: GreenApiError

Defined in: [client/errors.ts:5](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/errors.ts#L5)

Error thrown by GreenApiClient when a GREEN-API request fails.
The message keeps the method name and the response, statusCode and response hold the raw values.

## Extends

- `Error`

## Extended by

- [`CallError`](CallError.md)

## Constructors

### Constructor

> **new GreenApiError**(`message`, `statusCode`?, `response`?): `GreenApiError`

Defined in: [client/errors.ts:13](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/errors.ts#L13)

Creates a GREEN-API error.

#### Parameters

##### message

`string`

Human-readable error message

##### statusCode?

`number`

HTTP status of the response, undefined when GREEN-API could not be reached

##### response?

`unknown`

Response body from GREEN-API

#### Returns

`GreenApiError`

#### Overrides

`Error.constructor`

## Properties

### response?

> `readonly` `optional` **response**: `unknown`

Defined in: [client/errors.ts:13](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/errors.ts#L13)

Response body from GREEN-API

***

### statusCode?

> `readonly` `optional` **statusCode**: `number`

Defined in: [client/errors.ts:13](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/client/errors.ts#L13)

HTTP status of the response, undefined when GREEN-API could not be reached
