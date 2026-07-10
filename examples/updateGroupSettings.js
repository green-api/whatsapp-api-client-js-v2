// Пример: настройки группового чата (Бета)
// Запуск: node examples/updateGroupSettings.js
// Установите GROUP_ID перед запуском:
//   Windows: set GROUP_ID=1234567890123456789@g.us
//   Linux/macOS: export GROUP_ID=1234567890123456789@g.us

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

const groupId = process.env.GROUP_ID || "120363426085142320@g.us";

async function main() {
    // Запретить участникам отправлять сообщения и менять настройки группы
    const restrict = await client.updateGroupSettings({
        groupId,
        allowParticipantsSendMessages: false,
        allowParticipantsEditGroupSettings: false,
    });
    if (restrict.updateGroupSettings) {
        console.log("Группа переведена в режим «только администраторы».");
    } else {
        console.log("Ошибка:", restrict.reason);
        return;
    }

    // Разрешить всем участникам отправлять сообщения
    const open = await client.updateGroupSettings({
        groupId,
        allowParticipantsSendMessages: true,
        allowParticipantsEditGroupSettings: true,
    });
    if (open.updateGroupSettings) {
        console.log("Группа переведена в открытый режим.");
    } else {
        console.log("Ошибка:", open.reason);
    }
}

main().catch(console.error);
