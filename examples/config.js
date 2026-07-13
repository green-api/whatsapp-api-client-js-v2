// Конфигурация для примеров
// Установите переменные окружения перед запуском:
//   Windows: set ID_INSTANCE=12345 && set API_TOKEN=your-token
//   Linux/macOS: export ID_INSTANCE=12345 API_TOKEN=your-token
//
// Или замените значения прямо здесь (не рекомендуется для продакшена):

module.exports = {
    idInstance: Number(process.env.ID_INSTANCE) || 3453454354,
    apiTokenInstance: process.env.API_TOKEN || "345345435345345",

    // Номер получателя для примеров отправки (формат: 7XXXXXXXXXX@c.us)
    recipientChatId: process.env.RECIPIENT || "345345345@c.us",
};
