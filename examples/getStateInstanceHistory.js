// Пример: история состояний инстанса
// Запуск: node examples/getStateInstanceHistory.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Получить последние 20 записей
    const history = await client.getStateInstanceHistory(20);

    console.log(`Записей в истории: ${history.length}`);

    const stateLabels = {
        authorized: "авторизован",
        notAuthorized: "не авторизован",
        blocked: "заблокирован",
    };

    history.forEach((item, i) => {
        const time = new Date(item.timestamp * 1000).toLocaleString("ru-RU");
        const state = stateLabels[item.stateInstance] || item.stateInstance;
        const phone = item.phoneNumber ? ` | телефон: +${item.phoneNumber}` : "";
        console.log(`  ${i + 1}. ${time} — ${state}${phone}`);
    });
}

main().catch(console.error);
