// Пример: цикл получения и обработки уведомлений
// Запуск: node examples/receiveNotifications.js
// Остановка: Ctrl+C

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

let running = true;

process.on("SIGINT", () => {
    console.log("\nОстанавливаем цикл...");
    running = false;
});

async function handleNotification(notification) {
    const { typeWebhook } = notification.body;

    switch (typeWebhook) {
        case "incomingMessageReceived": {
            const { senderData, messageData } = notification.body;
            console.log(`Входящее сообщение от ${senderData.senderName} (${senderData.chatId})`);
            console.log(`  Тип: ${messageData.typeMessage}`);
            if (messageData.typeMessage === "textMessage") {
                console.log(`  Текст: ${messageData.textMessageData.textMessage}`);
            }
            break;
        }
        case "outgoingMessageStatus": {
            const { idMessage, status } = notification.body;
            console.log(`Статус сообщения ${idMessage}: ${status}`);
            break;
        }
        case "incomingCall": {
            const { from, status } = notification.body;
            console.log(`Входящий звонок от ${from}: ${status}`);
            break;
        }
        case "incomingBlock": {
            const { chatId } = notification.body;
            console.log(`Контакт ${chatId} заблокировал аккаунт`);
            break;
        }
        case "stateInstanceChanged": {
            const { stateInstance } = notification.body;
            console.log(`Состояние инстанса изменилось: ${stateInstance}`);
            break;
        }
        default:
            console.log(`Уведомление типа: ${typeWebhook}`);
    }
}

async function main() {
    console.log("Ожидаем уведомления (таймаут 5 сек)... Ctrl+C для остановки\n");

    while (running) {
        const notification = await client.receiveNotification(5);

        if (!notification) {
            process.stdout.write(".");
            continue;
        }

        console.log(`\n[receiptId: ${notification.receiptId}]`);
        await handleNotification(notification);
        await client.deleteNotification(notification.receiptId);
    }

    console.log("Завершено.");
}

main().catch(console.error);
