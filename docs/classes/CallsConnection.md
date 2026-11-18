[**GREEN-API WhatsApp SDK v2 v1.3.0**](../README.md)

***

[GREEN-API WhatsApp SDK v2](../globals.md) / CallsConnection

# Class: CallsConnection

Defined in: [calls/calls-connection.ts:62](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L62)

Live connection to the calls of an instance (the callsRtc WebSocket) and the audio of the current call.
Create it with GreenApiClient.connectCalls(). Control the call with the client's calls methods.

Events: "connect", "disconnect", "state", "incoming-call", "end-call", "remote-audio", "remote-pcm" and "error".
"remote-pcm" keeps real time: silent gaps and lost packets arrive as silence with the next audio.
Audio needs the optional dependencies werift and ws: npm install werift@^0.25.2 ws
Live PCM audio (sendPcm, remote-pcm) also needs the Opus codec: npm install opusscript

## Example

```typescript
const calls = client.connectCalls();
await calls.open();
await client.callsDial({chatId: "79001234567@c.us"});
await calls.startAudioBridge();
await calls.waitFor("on-call");
await calls.play("./hello.ogg");
await client.callsHangUp();
calls.close();
```

## Extends

- `EventEmitter`\<[`CallsConnectionEvents`](../interfaces/CallsConnectionEvents.md)\>

## Constructors

### Constructor

> **new CallsConnection**(`client`, `url`, `options`): `CallsConnection`

Defined in: [calls/calls-connection.ts:86](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L86)

Creates the connection. Use GreenApiClient.connectCalls() instead.

#### Parameters

##### client

`Pick`\<[`GreenApiClient`](GreenApiClient.md), `"callsGetIceServers"`\>

GREEN-API client of the instance

##### url

`string`

The callsRtc WebSocket URL

##### options

[`CallsConnectionOptions`](../interfaces/CallsConnectionOptions.md) = `{}`

Sample rate of the live PCM audio

#### Returns

`CallsConnection`

#### Throws

INVALID_AUDIO if pcmSampleRate is not supported

#### Overrides

`EventEmitter<CallsConnectionEvents>.constructor`

## Accessors

### hasAudioBridge

#### Get Signature

> **get** **hasAudioBridge**(): `boolean`

Defined in: [calls/calls-connection.ts:109](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L109)

Whether the audio of a call is connected or connecting now.

##### Returns

`boolean`

***

### pendingAudioMs

#### Get Signature

> **get** **pendingAudioMs**(): `number`

Defined in: [calls/calls-connection.ts:116](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L116)

How much live PCM audio from sendPcm is queued and not yet sent, in milliseconds.

##### Returns

`number`

***

### state

#### Get Signature

> **get** **state**(): `null` \| [`CallState`](../interfaces/CallState.md)

Defined in: [calls/calls-connection.ts:102](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L102)

The latest call state of the instance, null before the first state arrives or after the connection is lost.

##### Returns

`null` \| [`CallState`](../interfaces/CallState.md)

## Methods

### clearAudio()

> **clearAudio**(): `void`

Defined in: [calls/calls-connection.ts:279](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L279)

Drops the live audio that is queued and stops play(), for example when the other side starts talking.

#### Returns

`void`

***

### close()

> **close**(): `void`

Defined in: [calls/calls-connection.ts:344](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L344)

Disconnects the audio and closes the connection. The call itself is not ended.

#### Returns

`void`

***

### drainAudio()

> **drainAudio**(): `Promise`\<`void`\>

Defined in: [calls/calls-connection.ts:289](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L289)

Waits until the queued live audio has been sent.

#### Returns

`Promise`\<`void`\>

Promise that resolves when the queue is empty, cleared, or the audio stopped

***

### open()

> **open**(): `Promise`\<[`CallState`](../interfaces/CallState.md)\>

Defined in: [calls/calls-connection.ts:126](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L126)

Opens the connection. Reconnects on its own after network drops until close() is called.

#### Returns

`Promise`\<[`CallState`](../interfaces/CallState.md)\>

Promise resolving to the current call state

#### Throws

INVALID_CREDENTIALS, NOT_IN_TARIFF, CALLS_NOT_ENABLED or CONNECTION_FAILED

***

### play()

> **play**(`source`, `options`): `Promise`\<`void`\>

Defined in: [calls/calls-connection.ts:189](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L189)

Plays audio into the call. Waits until the audio is connected and the other side is heard, then plays in real time.
Ogg Opus files play as they are. Other formats, and Ogg files with SILK frames that WhatsApp calls do not play, go through ffmpeg.
The whole source is read before it plays, for live audio use sendPcm. A new play stops the previous one and drops queued live audio.

#### Parameters

##### source

[`CallAudioSource`](../type-aliases/CallAudioSource.md)

Path or http(s) URL of an audio file, a Buffer, or a readable stream

##### options

[`CallPlayOptions`](../interfaces/CallPlayOptions.md) = `{}`

Path to ffmpeg

#### Returns

`Promise`\<`void`\>

Promise that resolves when the audio has been played, stopped, or the call ended

#### Throws

AUDIO_NOT_STARTED, AUDIO_FAILED, INVALID_AUDIO or FFMPEG_NOT_FOUND

***

### sendPcm()

> **sendPcm**(`pcm`): `void`

Defined in: [calls/calls-connection.ts:266](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L266)

Sends live audio into the call: 16-bit little-endian mono PCM at pcmSampleRate (24000 by default).
Chunks of any size are queued, encoded to Opus in 20 ms frames and sent in real time.
The first audio waits until the audio is connected and the other side is heard. Stops a running play().

#### Parameters

##### pcm

PCM samples

`Buffer`\<`ArrayBufferLike`\> | `Uint8Array`\<`ArrayBufferLike`\> | `Int16Array`\<`ArrayBufferLike`\>

#### Returns

`void`

#### Throws

AUDIO_NOT_STARTED, or MISSING_OPUS_CODEC when opusscript is not installed

#### Example

```typescript
const calls = client.connectCalls({pcmSampleRate: 16000});
calls.on("remote-pcm", (pcm) => calls.sendPcm(pcm));
```

***

### startAudioBridge()

> **startAudioBridge**(): `Promise`\<`void`\>

Defined in: [calls/calls-connection.ts:149](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L149)

Connects the audio of the current call. Call it after callsDial or callsAccept has resolved.

#### Returns

`Promise`\<`void`\>

Promise that resolves when GREEN-API has answered the audio offer

#### Throws

If there is no call, the call ends first, or the audio cannot start

***

### stopAudioBridge()

> **stopAudioBridge**(): `void`

Defined in: [calls/calls-connection.ts:173](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L173)

Disconnects the audio of the call. The call itself goes on, end it with callsHangUp.

#### Returns

`void`

***

### stopPlaying()

> **stopPlaying**(): `void`

Defined in: [calls/calls-connection.ts:247](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L247)

Stops the audio that is playing.

#### Returns

`void`

***

### waitFor()

> **waitFor**(`state`, `timeoutMs`?): `Promise`\<[`CallState`](../interfaces/CallState.md)\>

Defined in: [calls/calls-connection.ts:301](https://github.com/green-api/whatsapp-api-client-js-v2/blob/1421d2d05dac53d804ec594a75a66b56a72f1918/src/calls/calls-connection.ts#L301)

Waits until the call reaches a state.

#### Parameters

##### state

[`CallStateKind`](../type-aliases/CallStateKind.md)

The state to wait for

##### timeoutMs?

`number`

How long to wait, no limit by default

#### Returns

`Promise`\<[`CallState`](../interfaces/CallState.md)\>

Promise resolving to the call state

#### Throws

CALL_ENDED with the reason if the call ends first, TIMEOUT, or the connection error
