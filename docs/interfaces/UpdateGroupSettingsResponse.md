[**GREEN-API WhatsApp SDK v2 v1.0.3**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / UpdateGroupSettingsResponse

# Interface: UpdateGroupSettingsResponse

Defined in: [types/groups.ts](https://github.com/green-api/whatsapp-api-client-js-v2/blob/master/src/types/groups.ts)

Response from the updateGroupSettings method.

## Properties

### reason?

> `optional` **reason**: `string`

Error description. Only present when `updateGroupSettings` is `false`.

***

### updateGroupSettings

> **updateGroupSettings**: `boolean`

Whether the settings were successfully applied.
