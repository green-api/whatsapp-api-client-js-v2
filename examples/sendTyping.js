// Пример: индикатор набора текста и записи аудио
// Запуск: node examples/sendTyping.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Показать "печатает..." на 5 секунд, затем отправить сообщение
    console.log("Отправляем индикатор набора текста на 5 секунд...");
    await client.sendTyping({
        chatId: config.recipientChatId,
        typingTime: 5000,
    });

    const message = await client.sendMessage({
        chatId: config.recipientChatId,
        message: "Сообщение после индикатора набора!",
    });
    console.log("Сообщение отправлено, ID:", message.idMessage);

    // Показать "записывает аудио..." на 3 секунды
    console.log("Отправляем индикатор записи аудио на 3 секунды...");
    await client.sendTyping({
        chatId: config.recipientChatId,
        typingTime: 3000,
        typingType: "recording",
    });
    console.log("Индикаторы отправлены");
}

main().catch(console.error);
