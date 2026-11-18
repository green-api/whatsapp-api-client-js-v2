const { GreenApiClient, CallError } = require("../dist/index.js");
const config = require("./config.js");

const ECHO_DELAY_MS = 1500;
const CALL_LIMIT_MS = 60000;

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    const calls = client.connectCalls({ pcmSampleRate: 24000 });
    let receivedMs = 0;
    let limit;

    calls.on("remote-pcm", (pcm) => {
        receivedMs += pcm.length / 48;
        setTimeout(() => {
            if (calls.hasAudioBridge) {
                calls.sendPcm(pcm);
            }
        }, ECHO_DELAY_MS);
    });
    calls.on("state", (state) => console.log("Состояние звонка:", state.state));
    calls.on("end-call", (detail) => {
        clearTimeout(limit);
        console.log("Звонок завершён:", detail.description, "| получено звука, мс:", Math.round(receivedMs));
        receivedMs = 0;
    });
    calls.on("error", (error) => console.log("Ошибка звонка:", error.code, error.message));
    calls.on("incoming-call", async (info) => {
        console.log("Входящий звонок от", info.name || info.wid, "| говорите, бот повторит через", ECHO_DELAY_MS, "мс");
        try {
            await client.callsAccept();
            await calls.startAudioBridge();
            limit = setTimeout(() => client.callsHangUp().catch(() => undefined), CALL_LIMIT_MS);
        } catch (error) {
            console.log("Звонок не удался:", error instanceof CallError ? `${error.code} ${error.message}` : error);
        }
    });

    await calls.open();
    console.log("Ждём входящий звонок. Ctrl+C для выхода");
}

main().catch((error) => {
    console.error(error instanceof CallError ? `${error.code}: ${error.message}` : error);
    process.exit(1);
});
