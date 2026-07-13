// Пример: управление очередью входящих вебхуков
// Запуск: node examples/webhookQueue.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Получить количество ожидающих уведомлений
    const { count } = await client.getWebhooksCount();
    console.log(`Ожидающих уведомлений в очереди: ${count}`);

    if (count === 0) {
        console.log("Очередь пуста, очищать нечего.");
        return;
    }

    // Очистить очередь
    const result = await client.clearWebhooksQueue();
    if (result.isCleared) {
        console.log("Очередь успешно очищена.");
    } else {
        console.log(`Не удалось очистить: ${result.reason}. Повтор через ${result.leftTime}с.`);
    }
}

main().catch(console.error);
