const path = require("path");
const { GreenApiClient, CallError } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function answer(calls, info) {
    console.log("Входящий звонок от", info.name || info.wid);
    try {
        await client.callsAccept();
        await calls.startAudioBridge();
        await calls.play(path.join(__dirname, "data", "call-hello.ogg"));
        await client.callsHangUp();
    } catch (error) {
        if (error instanceof CallError) {
            console.log("Звонок не удался:", error.code, error.message);
            return;
        }
        throw error;
    }
}

async function main() {
    const calls = client.connectCalls();
    let audioPackets = 0;

    calls.on("state", (state) => console.log("Состояние звонка:", state.state));
    calls.on("remote-audio", () => audioPackets++);
    calls.on("end-call", (detail) => {
        console.log("Звонок завершён:", detail.description, "| получено аудиопакетов:", audioPackets);
        audioPackets = 0;
    });
    calls.on("error", (error) => console.log("Ошибка звонка:", error.code, error.message));
    calls.on("incoming-call", (info) => answer(calls, info).catch(console.error));

    await calls.open();
    console.log("Ждём входящий звонок. Ctrl+C для выхода");
}

main().catch((error) => {
    console.error(error instanceof CallError ? `${error.code}: ${error.message}` : error);
    process.exit(1);
});
