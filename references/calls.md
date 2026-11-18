# Calls Methods

Voice calls with WhatsApp users from an authorized instance: control methods (REST), the live calls connection (callsRtc) and the call audio (WebRTC).

Requirements:
- The instance plan includes calls. Otherwise the methods fail with `NOT_IN_TARIFF` or `CALLS_NOT_ENABLED`.
- One call per instance at a time, 1:1 voice only (no group or video calls).
- Outgoing calls only to chats that wrote or called in the last 72 hours (`NO_RECENT_CONTACT`).
- Audio needs the optional dependencies: `npm install werift@^0.25.2 ws`. Without audio the call rings and connects, but nobody hears anything.

---

## `callsDial()`

Starts an outgoing call.

```typescript
callsDial(params: CallsDial): Promise<CallIdResponse>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chatId` | string | ✓ | `79001234567@c.us` or `123456789012345@lid` |

Returns `{ callId }`. The same ID is `idMessage` in the call webhooks and the input of `getCallRecording`.

---

## `callsAccept()`, `callsReject()`, `callsHangUp()`

Accept or reject the incoming call, end the current call. No parameters, each returns `{ callId }`.

---

## `callsState()`

```typescript
callsState(): Promise<CallState>
// { state: "idle" | "inc-call" | "out-call" | "on-call", info?: { id, wid, name }, reason?: string }
```

After a call ends, REST returns a bare `{ state: "idle" }`. The end reason only arrives on the calls connection (`end-call` event).

---

## `callsGetIceServers()`

Returns the ICE servers for the call audio. `CallsConnection` calls it itself.

---

## `getCallRecording()`

```typescript
getCallRecording(params: GetCallRecording): Promise<CallRecording>
// { status: "processing" | "ready" | "notFound" | "failed", downloadUrl?, expireAt?, durationMs?, sizeBytes? }
```

`downloadUrl` works for 1 hour.

---

## `connectCalls()`

Creates the live calls connection.

```typescript
const calls = client.connectCalls();
await calls.open();
```

| Member | Description |
|--------|-------------|
| `open()` | Opens the connection, resolves to the current `CallState`, reconnects on its own after drops |
| `state` | Latest `CallState` or `null` |
| `startAudioBridge()` | Connects the call audio, call it after `callsDial` or `callsAccept` resolved |
| `stopAudioBridge()` | Disconnects the audio, the call goes on |
| `play(source, { ffmpegPath? })` | Plays a file path, http(s) URL, Buffer or stream into the call; Ogg Opus plays directly, anything else needs ffmpeg |
| `stopPlaying()` | Stops the audio that is playing |
| `sendPcm(chunk)` | Realtime audio into the call: 16-bit mono PCM at `pcmSampleRate`, chunks of any size, sent as they come |
| `clearAudio()` | Drops the queued audio that is not sent yet and stops `play()` |
| `drainAudio()` | Resolves when the queued audio is sent |
| `pendingAudioMs` | Milliseconds of queued audio |
| `waitFor(state, timeoutMs?)` | Resolves when the call reaches the state, rejects with `CALL_ENDED` and the reason if it ends first |
| `close()` | Closes the connection, does not end the call |

| Event | Payload |
|-------|---------|
| `connect` | none |
| `disconnect` | `{ reason, code?, permanent?, error? }` |
| `state` | `CallState` |
| `incoming-call` | `CallInfo` `{ id, wid, name }` |
| `end-call` | `{ reason: "call-ended" \| "connection-lost", cause?, description }` |
| `remote-audio` | `{ payload, sequenceNumber, timestamp }`, Opus packets from the other side |
| `remote-pcm` | `Buffer`, the other side's audio as 16-bit mono PCM at `pcmSampleRate`, in real time (silent gaps and lost packets arrive as silence with the next audio) |
| `error` | `CallError` |

### Realtime audio in both directions

`connectCalls({ pcmSampleRate })` takes 8000, 12000, 16000, 24000 (default) or 48000, the same rate for both directions. `sendPcm` and `remote-pcm` need the Opus codec: `npm install opusscript`. `play()` and `sendPcm()` replace each other.

```typescript
const calls = client.connectCalls({ pcmSampleRate: 24000 });
calls.on("remote-pcm", (pcm) => setTimeout(() => calls.sendPcm(pcm), 1500));
calls.on("incoming-call", async () => {
  await client.callsAccept();
  await calls.startAudioBridge();
});
await calls.open();
```

### Outgoing call with a message

```typescript
const calls = client.connectCalls();
await calls.open();
await client.callsDial({ chatId: "79001234567@c.us" });
await calls.startAudioBridge();
await calls.waitFor("on-call", 60000);
await calls.play("./hello.ogg");
await client.callsHangUp();
calls.close();
```

### Answering incoming calls

```typescript
const calls = client.connectCalls();
calls.on("incoming-call", async (info) => {
  await client.callsAccept();
  await calls.startAudioBridge();
  await calls.play("./greeting.ogg");
  await client.callsHangUp();
});
calls.on("end-call", (detail) => console.log(detail.description));
await calls.open();
```

---

## Errors

Calls methods and the connection throw `CallError` with a `code`, a readable `message` and `serverMessage` from GREEN-API.

| Code | When |
|------|------|
| `INVALID_CREDENTIALS` | Wrong `idInstance` or `apiTokenInstance` |
| `INVALID_CHAT_ID` | `callsDial` got a chatId that is not `...@c.us` or `...@lid` |
| `NOT_IN_TARIFF`, `CALLS_NOT_ENABLED` | Calls are not available for the instance |
| `NO_RECENT_CONTACT` | The 72-hour rule for outgoing calls |
| `ALREADY_IN_CALL`, `NO_INCOMING_CALL`, `NO_ACTIVE_CALL`, `CALL_ENDED` | The command does not fit the current call state |
| `INSTANCE_NOT_READY` | The instance is starting |
| `CALL_REFUSED`, `CALL_FAILED`, `TIMEOUT`, `RATE_LIMITED`, `CONNECTION_FAILED` | Server or network problems |
| `AUDIO_NOT_STARTED`, `AUDIO_BUSY`, `AUDIO_FAILED` | Audio used in the wrong order or could not connect |
| `INVALID_AUDIO`, `FFMPEG_NOT_FOUND`, `MISSING_DEPENDENCY`, `MISSING_OPUS_CODEC` | The audio, the sample rate or the optional dependencies |

```typescript
try {
  await client.callsDial({ chatId: "79001234567@c.us" });
} catch (error) {
  if (error instanceof CallError && error.code === "NO_RECENT_CONTACT") {
    console.log("Ask the person to write to the instance first");
  }
}
```

---

## Webhooks

Enable `incomingCallWebhook` and `outgoingCallWebhook` with `setSettings`. `isCallWebhook(webhook)` narrows a webhook to `IncomingCallWebhook | OutgoingCallWebhook`. Statuses: `offer`, `pickUp`, `hangUp` or `hungUp`, `declined`, `missed`, `invalid`. For incoming calls `declined` means the caller cancelled before the answer and `missed` means nobody answered; for outgoing calls `declined` means the person rejected and `missed` means it rang out.
