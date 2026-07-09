// Конфигурация для примеров
// Установите переменные окружения перед запуском:
//   Windows: set ID_INSTANCE=12345 && set API_TOKEN=your-token
//   Linux/macOS: export ID_INSTANCE=12345 API_TOKEN=your-token
//
// Или замените значения прямо здесь (не рекомендуется для продакшена):

module.exports = {
    idInstance: Number(process.env.ID_INSTANCE) || 710701676160,
    apiTokenInstance: process.env.API_TOKEN || "06b3940ae41d4d059957bedd7073d0af8b4dbd9f06894fa59a",

    // Номер получателя для примеров отправки (формат: 7XXXXXXXXXX@c.us)
    recipientChatId: process.env.RECIPIENT || "77075054206@c.us",
};
