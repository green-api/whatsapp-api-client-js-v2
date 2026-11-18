const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    const callId = process.argv[2];
    if (!callId) {
        console.log("Запуск: node examples/callRecording.js <callId>");
        return;
    }

    const recording = await client.getCallRecording({ idMessage: callId });
    console.log("Статус записи:", recording.status);
    if (recording.status === "ready") {
        console.log("Ссылка на запись (действует 1 час):", recording.downloadUrl);
    }
}

main().catch(console.error);
