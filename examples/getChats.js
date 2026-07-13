// Пример: получение списка чатов
// Запуск: node examples/getChats.js

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    // Получить 20 последних активных чатов
    const chats = await client.getChats(20);

    console.log(`Найдено чатов: ${chats.length}`);

    const groups = chats.filter((c) => c.type === "group");
    const personal = chats.filter((c) => c.type === "user");
    const archived = chats.filter((c) => c.archive);

    console.log(`  Личных: ${personal.length}`);
    console.log(`  Групп: ${groups.length}`);
    console.log(`  Архивных: ${archived.length}`);

    console.log("\nПоследние 5 чатов:");
    chats.slice(0, 5).forEach((chat) => {
        const archiveLabel = chat.archive ? " [архив]" : "";
        const disappear = chat.ephemeralExpiration > 0
            ? ` [исчезают через ${chat.ephemeralExpiration / 86400}д]`
            : "";
        console.log(`  ${chat.name} (${chat.type})${archiveLabel}${disappear}`);
    });
}

main().catch(console.error);
