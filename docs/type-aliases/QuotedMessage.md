[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / QuotedMessage

# Type Alias: QuotedMessage

> **QuotedMessage** = `object` & \{ `textMessage`: `string`; `typeMessage`: `"textMessage"`; \} \| \{ `extendedTextMessage`: \{ `description`: `string`; `jpegThumbnail`: `string` \| `null`; `previewType`: `string`; `title`: `string`; \}; `textMessage`: `string`; `typeMessage`: `"extendedTextMessage"`; \} \| \{ `contact`: \{ `displayName`: `string`; `vcard`: `string`; \}; `typeMessage`: `"contactMessage"`; \} \| \{ `contacts`: `object`[]; `typeMessage`: `"contactsArrayMessage"`; \} \| \{ `location`: \{ `address`: `string`; `jpegThumbnail`: `string`; `latitude`: `number`; `longitude`: `number`; `nameLocation`: `string`; \}; `typeMessage`: `"locationMessage"`; \} \| \{ `caption`: `string`; `downloadUrl`: `string`; `jpegThumbnail`: `string`; `typeMessage`: `"imageMessage"` \| `"videoMessage"` \| `"documentMessage"` \| `"audioMessage"`; \} \| \{ `caption`: `string`; `downloadUrl`: `string`; `isAnimated`: `boolean`; `jpegThumbnail`: `string`; `typeMessage`: `"stickerMessage"`; \} \| \{ `buttons`: [`ButtonData`](../interfaces/ButtonData.md)[]; `contentText`: `string`; `footer`: `string`; `typeMessage`: `"buttonsMessage"`; \} \| \{ `buttonText`: `string`; `contentText`: `string`; `footer`: `string`; `sections`: [`ListSectionData`](../interfaces/ListSectionData.md)[]; `title`: `string`; `typeMessage`: `"listMessage"`; \} \| \{ `buttons`: [`TemplateButtonData`](../interfaces/TemplateButtonData.md)[]; `contentText`: `string`; `footer`: `string`; `typeMessage`: `"templateMessage"`; \} \| \{ `groupInviteMessageData`: [`GroupInviteMessageData`](../interfaces/GroupInviteMessageData.md); `typeMessage`: `"groupInviteMessage"`; \}

Defined in: [types/messages.ts:396](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/messages.ts#L396)

## Type declaration

### participant

> **participant**: `string`

### stanzaId

> **stanzaId**: `string`

### typeMessage

> **typeMessage**: [`MessageType`](MessageType.md)
