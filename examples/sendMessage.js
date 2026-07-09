// Пример: отправка текстового сообщения
// Запуск: node examples/sendMessage.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Простое сообщение
    const result = await client.sendMessage({
        chatId: config.recipientChatId,
        message: "Привет от GREEN-API SDK!",
    });
    console.log("Сообщение отправлено, ID:", result.idMessage);

    // Сообщение-ответ на другое сообщение
    const reply = await client.sendMessage({
        chatId: config.recipientChatId,
        message: "Это ответ на ваше сообщение",
        quotedMessageId: result.idMessage,
    });
    console.log("Ответ отправлен, ID:", reply.idMessage);
}

main().catch(console.error);
