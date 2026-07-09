// Пример: отправка интерактивных кнопок (Бета)
// Запуск: node examples/sendInteractiveButtons.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Кнопки с действиями (url / call / copy)
    const actionButtons = await client.sendInteractiveButtons({
        chatId: config.recipientChatId,
        header: "Свяжитесь с нами",
        body: "Выберите удобный способ связи",
        footer: "Powered by GREEN-API",
        buttons: [
            {
                type: "url",
                buttonId: "1",
                buttonText: "Открыть сайт",
                url: "https://green-api.com",
            },
            {
                type: "call",
                buttonId: "2",
                buttonText: "Позвонить",
                phoneNumber: "74951234567",
            },
            {
                type: "copy",
                buttonId: "3",
                buttonText: "Скопировать код",
                copyCode: "PROMO2025",
            },
        ],
    });
    console.log("Кнопки с действиями отправлены, ID:", actionButtons.idMessage);

    // Кнопки-ответы (текст возвращается в чат при нажатии)
    const replyButtons = await client.sendInteractiveButtonsReply({
        chatId: config.recipientChatId,
        header: "Быстрый ответ",
        body: "Как вы оцениваете наш сервис?",
        footer: "Ваше мнение важно для нас",
        buttons: [
            { buttonId: "1", buttonText: "Отлично!" },
            { buttonId: "2", buttonText: "Хорошо" },
            { buttonId: "3", buttonText: "Нужны улучшения" },
        ],
    });
    console.log("Кнопки-ответы отправлены, ID:", replyButtons.idMessage);
}

main().catch(console.error);
