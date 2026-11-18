const path = require("path");
const { GreenApiClient, CallError } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    const calls = client.connectCalls();
    calls.on("state", (state) => console.log("Состояние звонка:", state.state));
    calls.on("end-call", (detail) => console.log("Звонок завершён:", detail.description));
    calls.on("error", (error) => console.log("Ошибка звонка:", error.code, error.message));

    try {
        await calls.open();
        const { callId } = await client.callsDial({ chatId: config.recipientChatId });
        console.log("Звоним, callId:", callId);

        await calls.startAudioBridge();
        await calls.waitFor("on-call", 60000);
        console.log("Ответили, проигрываем сообщение");

        await calls.play(path.join(__dirname, "data", "call-hello.ogg"));
        await client.callsHangUp();
    } catch (error) {
        if (error instanceof CallError) {
            console.log("Звонок не удался:", error.code, error.message);
        } else {
            throw error;
        }
    } finally {
        calls.close();
    }
}

main().catch(console.error);
