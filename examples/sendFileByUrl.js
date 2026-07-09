// Пример: отправка файла по URL
// Запуск: node examples/sendFileByUrl.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Отправка изображения по URL
    const image = await client.sendFileByUrl({
        chatId: config.recipientChatId,
        file: {
            url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
            fileName: "google-logo.png",
        },
        caption: "Логотип Google",
    });
    console.log("Изображение отправлено, ID:", image.idMessage);

    // Отправка документа по URL
    const doc = await client.sendFileByUrl({
        chatId: config.recipientChatId,
        file: {
            url: "https://www.w3.org/WAI/WCAG21/wcag-2.1.pdf",
            fileName: "wcag-2.1.pdf",
        },
    });
    console.log("Документ отправлен, ID:", doc.idMessage);
}

main().catch(console.error);
