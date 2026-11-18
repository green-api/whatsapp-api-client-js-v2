[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / CallsRtcServerFrame

# Type Alias: CallsRtcServerFrame

> **CallsRtcServerFrame** = \{ `state`: [`CallState`](../interfaces/CallState.md); `type`: `"state"`; \} \| \{ `answer`: \{ `sdp`: `string`; `type`: `"answer"`; \}; `type`: `"answer"`; \} \| \{ `candidate`: [`CallsRtcIceCandidate`](../interfaces/CallsRtcIceCandidate.md); `type`: `"ice-candidate"`; \} \| \{ `message`: `string`; `type`: `"error"`; \}

Defined in: [types/calls.ts:116](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/types/calls.ts#L116)
