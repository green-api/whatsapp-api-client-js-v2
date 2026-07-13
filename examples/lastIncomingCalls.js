// Пример: журнал входящих звонков
// Запуск: node examples/lastIncomingCalls.js
//
// Требования: в настройках инстанса должны быть включены
//   incomingWebhook: "yes"
//   incomingCallWebhook: "yes"

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Звонки за последний час
    const calls = await client.lastIncomingCalls(60);

    console.log(`Входящих звонков за последний час: ${calls.length}`);

    if (calls.length === 0) {
        console.log("Звонков нет. Попробуйте увеличить период (передайте большее число минут).");
        return;
    }

    const statusLabels = {
        pickUp: "принят",
        hungUp: "завершён",
        declined: "отклонён",
    };

    calls.forEach((call) => {
        const time = new Date(call.timestamp * 1000).toLocaleString("ru-RU");
        const status = statusLabels[call.status] || call.status;
        const type = call.isVideo ? "видеозвонок" : "звонок";
        const group = call.isGroup ? " [группа]" : "";
        console.log(`  ${time} | ${type}${group} от ${call.chatId} — ${status}`);
    });

    // Статистика
    const answered = calls.filter((c) => c.status === "pickUp").length;
    const declined = calls.filter((c) => c.status === "declined").length;
    const missed = calls.filter((c) => c.status === "hungUp").length;
    console.log(`\nИтого: принято ${answered}, отклонено ${declined}, пропущено ${missed}`);
}

main().catch(console.error);
