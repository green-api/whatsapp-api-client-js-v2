// Пример: журнал исходящих звонков
// Запуск: node examples/lastOutgoingCalls.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Звонки за последние 24 часа (по умолчанию)
    const calls = await client.lastOutgoingCalls();

    console.log(`Исходящих звонков за 24 часа: ${calls.length}`);

    if (calls.length === 0) {
        console.log("Звонков нет.");
        return;
    }

    const statusLabels = {
        pickUp: "принят",
        hungUp: "завершён",
        declined: "отклонён",
        invalid: "недоступен",
    };

    calls.forEach((call) => {
        const time = new Date(call.timestamp * 1000).toLocaleString("ru-RU");
        const status = statusLabels[call.status] || call.status;
        const type = call.isVideo ? "видеозвонок" : "звонок";
        const duration = call.status === "pickUp" ? ` (${call.duration}с)` : "";
        console.log(`  ${time} | ${type} на ${call.chatId} — ${status}${duration}`);

        // Статусы отдельных участников (для групповых звонков)
        if (call.participants && call.participants.length > 0) {
            call.participants.forEach((p) => {
                const pStatus = statusLabels[p.status] || p.status;
                console.log(`    └ ${p.id}: ${pStatus}`);
            });
        }
    });

    // Общая длительность принятых звонков
    const totalDuration = calls
        .filter((c) => c.status === "pickUp")
        .reduce((sum, c) => sum + c.duration, 0);
    console.log(`\nОбщая длительность принятых звонков: ${totalDuration}с`);
}

main().catch(console.error);
