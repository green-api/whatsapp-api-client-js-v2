// Пример: отправка опроса
// Запуск: node examples/sendPoll.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Опрос с единственным выбором
    const singleChoice = await client.sendPoll({
        chatId: config.recipientChatId,
        message: "Какой ваш любимый язык программирования?",
        options: [
            { optionName: "JavaScript" },
            { optionName: "TypeScript" },
            { optionName: "Python" },
            { optionName: "Go" },
        ],
        multipleAnswers: false,
    });
    console.log("Опрос (один выбор) отправлен, ID:", singleChoice.idMessage);

    // Опрос с множественным выбором
    const multiChoice = await client.sendPoll({
        chatId: config.recipientChatId,
        message: "Какие фреймворки вы используете?",
        options: [
            { optionName: "React" },
            { optionName: "Vue" },
            { optionName: "Angular" },
            { optionName: "Svelte" },
        ],
        multipleAnswers: true,
    });
    console.log("Опрос (несколько выборов) отправлен, ID:", multiChoice.idMessage);
}

main().catch(console.error);
