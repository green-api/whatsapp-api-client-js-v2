const { GreenApiClient, CallError } = require("../dist/index.js");
const config = require("./config.js");

async function show(title, action) {
    try {
        await action();
        console.log(`${title}: без ошибки`);
    } catch (error) {
        if (!(error instanceof CallError)) {
            throw error;
        }
        console.log(`${title}: ${error.code} | ${error.message}`);
    }
}

async function main() {
    const client = new GreenApiClient({
        idInstance: config.idInstance,
        apiTokenInstance: config.apiTokenInstance,
    });
    const wrongClient = new GreenApiClient({
        idInstance: config.idInstance,
        apiTokenInstance: "wrong-token",
    });

    await show("Неверный токен, REST", () => wrongClient.callsState());
    await show("Неверный токен, соединение звонков", async () => {
        const calls = wrongClient.connectCalls();
        try {
            await calls.open();
        } finally {
            calls.close();
        }
    });
    await show("Неверный номер", () => client.callsDial({ chatId: "123" }));
    await show("Положить трубку без звонка", () => client.callsHangUp());
}

main().catch(console.error);
