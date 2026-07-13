// Пример: обновление API токена (Бета)
// Запуск: node examples/updateApiToken.js
//
// ВНИМАНИЕ: старый токен немедленно аннулируется после вызова этого метода.
// Обновите значение apiTokenInstance во всех местах, где он используется.

const { GreenApiClient } = require("../dist/index.js");
const config = require("./config.js");

const client = new GreenApiClient({
    idInstance: config.idInstance,
    apiTokenInstance: config.apiTokenInstance,
});

async function main() {
    console.log("Текущий токен:", config.apiTokenInstance.slice(0, 8) + "...");
    console.log("Запрашиваем новый токен...");

    const result = await client.updateApiToken();

    console.log("Новый токен получен:", result.apiTokenInstance.slice(0, 8) + "...");
    console.log("Обновите переменную окружения API_TOKEN и перезапустите приложение.");
}

main().catch(console.error);
