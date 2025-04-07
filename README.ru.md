# GREEN-API WhatsApp SDK v2

TypeScript/JavaScript SDK для взаимодействия с GREEN-API WhatsApp шлюзом.

## Установка

```bash
npm install @green-api/whatsapp-api-client-js-v2
# или
yarn add @green-api/whatsapp-api-client-js-v2
```

## Начало работы

Для использования SDK необходимо создать экземпляр `GreenApiClient` с вашими учетными данными GREEN-API:

```typescript
import { GreenApiClient } from '@green-api/whatsapp-api-client-js-v2';

const client = new GreenApiClient({
    idInstance: 12345,
    apiTokenInstance: 'ваш-api-токен'
});
```

Для доступа к API Партнера используйте `GreenApiPartnerClient`:

```typescript
import { GreenApiPartnerClient } from '@green-api/whatsapp-api-client-js-v2';

const partnerClient = new GreenApiPartnerClient({
    partnerToken: 'ваш-партнерский-токен',
    partnerApiUrl: 'https://api.green-api.com' // Опционально, по умолчанию этот URL
});
```

## Примеры использования

### Отправка текстового сообщения

```typescript
await client.sendMessage({
    chatId: '1234567890@c.us',
    message: 'Привет от GREEN-API SDK!'
});
```

### Отправка файла по URL

```typescript
await client.sendFileByUrl({
    chatId: '1234567890@c.us',
    file: {
        url: 'https://example.com/file.pdf',
        fileName: 'document.pdf'
    },
    caption: 'Посмотри этот файл'
});
```

### Создание опроса

```typescript
await client.sendPoll({
    chatId: '1234567890@c.us',
    message: 'Какой ваш любимый цвет?',
    options: [
        {optionName: 'Красный'},
        {optionName: 'Синий'},
        {optionName: 'Зеленый'}
    ],
    multipleAnswers: false
});
```

### Управление группами

```typescript
// Создание группы
const group = await client.createGroup({
    groupName: 'Моя тестовая группа',
    chatIds: ['1234567890@c.us', '0987654321@c.us']
});

// Добавление участника
await client.addGroupParticipant({
    groupId: group.chatId,
    participantChatId: '1122334455@c.us'
});
```

### Получение уведомлений

```typescript
// Получение уведомления с таймаутом 30 секунд
const notification = await client.receiveNotification(30);
if (notification) {
    console.log('Получено уведомление:', notification.body.typeWebhook);

    // Обработка уведомления
    if (notification.body.typeWebhook === 'incomingMessageReceived') {
        // Обработка входящего сообщения
        console.log('Сообщение:', notification.body.messageData);
    }

    // Удаление уведомления из очереди после обработки
    await client.deleteNotification(notification.receiptId);
}

// Скачивание файла из сообщения
const fileData = await client.downloadFile({
    chatId: '1234567890@c.us',
    idMessage: 'ID_СООБЩЕНИЯ_С_ФАЙЛОМ'
});
console.log('URL файла:', fileData.downloadUrl);
```

### Работа со статусами WhatsApp (Бета)

```typescript
// Отправка текстового статуса
await client.sendTextStatus({
    message: "Привет от GREEN-API SDK!",
    backgroundColor: "#228B22", // Зеленый фон
    font: "SERIF",
    participants: ["1234567890@c.us"] // Опционально: ограничить видимость для конкретных контактов
});

// Отправка медиа-статуса
await client.sendMediaStatus({
    urlFile: "https://example.com/image.jpg",
    fileName: "image.jpg",
    caption: "Посмотрите на этот вид!",
    participants: ["1234567890@c.us"]
});

// Получение статистики статуса
const stats = await client.getStatusStatistic({
    idMessage: "BAE5F4886F6F2D05"
});
console.log(`Статус просмотрели ${stats.length} контактов`);

// Получение входящих статусов от контактов
const statuses = await client.getIncomingStatuses({minutes: 60}); // За последний час
statuses.forEach(status => {
    console.log(`Статус от ${status.senderName} в ${new Date(status.timestamp * 1000)}`);
});
```

### API партнера (Управление инстансами)

```typescript
// Получение всех инстансов
const instances = await partnerClient.getInstances();
console.log(`Всего инстансов: ${instances.length}`);
console.log(`Активных инстансов: ${instances.filter(i => !i.deleted).length}`);

// Создание нового инстанса
const instance = await partnerClient.createInstance({
    name: "Маркетинговая кампания",
    incomingWebhook: "yes",
    outgoingWebhook: "yes",
    delaySendMessagesMilliseconds: 3000
});
console.log(`Создан инстанс с ID: ${instance.idInstance}`);
console.log(`API Токен: ${instance.apiTokenInstance}`);

// Удаление инстанса
const result = await partnerClient.deleteInstanceAccount({
    idInstance: instance.idInstance
});
if (result.deleteInstanceAccount) {
    console.log("Инстанс успешно удален");
}
```

### Редактирование и удаление сообщений

```typescript
// Редактирование сообщения
const editResult = await client.editMessage({
    chatId: '1234567890@c.us',
    idMessage: 'BAE5367237E13A87',
    message: 'Это отредактированный текст сообщения'
});
console.log('ID отредактированного сообщения:', editResult.idMessage);

// Удаление сообщения для всех
await client.deleteMessage({
    chatId: '1234567890@c.us',
    idMessage: 'BAE5F4886F6F2D05'
});

// Удаление сообщения только для отправителя
await client.deleteMessage({
    chatId: '1234567890@c.us',
    idMessage: 'BAE5F4886F6F2D05',
    onlySenderDelete: true
});
```

## Документация API

SDK предоставляет следующие группы методов:

1. **Методы отправки сообщений**
    - `sendMessage` - отправка текстового сообщения
    - `sendFileByUrl` - отправка файла по URL
    - `sendFileByUpload` - отправка файла с загрузкой
    - `sendPoll` - создание опроса
    - `forwardMessages` - пересылка сообщений
    - `sendLocation` - отправка местоположения
    - `sendContact` - отправка контакта
    - `uploadFile` - загрузка файла

2. **Методы управления аккаунтом**
    - `reboot` - перезагрузка
    - `logout` - выход из аккаунта
    - `getStateInstance` - получение состояния инстанса
    - `getQR` - получение QR-кода
    - `getSettings` - получение настроек
    - `setSettings` - установка настроек
    - `getWaSettings` - получение настроек WhatsApp
    - `setProfilePicture` - установка фото профиля
    - `getAuthorizationCode` - получение кода авторизации

3. **Методы очереди сообщений**
    - `showMessagesQueue` - отображение очереди сообщений
    - `clearMessagesQueue` - очистка очереди сообщений

4. **Сервисные методы**
    - `readChat` - отметить чат как прочитанный
    - `checkWhatsapp` - проверка наличия WhatsApp
    - `getAvatar` - получение аватара
    - `getContacts` - получение контактов
    - `getContactInfo` - получение информации о контакте
    - `archiveChat` - архивирование чата
    - `unarchiveChat` - разархивирование чата
    - `setDisappearingChat` - настройка исчезающих сообщений
    - `editMessage` - редактирование сообщения
    - `deleteMessage` - удаление сообщения

5. **Методы управления группами**
    - `createGroup` - создание группы
    - `updateGroupName` - обновление имени группы
    - `getGroupData` - получение данных группы
    - `addGroupParticipant` - добавление участника
    - `removeGroupParticipant` - удаление участника
    - `setGroupAdmin` - назначение администратора
    - `removeAdmin` - снятие прав администратора
    - `setGroupPicture` - установка фото группы
    - `leaveGroup` - выход из группы

6. **Методы журнала**
    - `getMessage` - получение сообщения
    - `getChatHistory` - получение истории чата
    - `lastIncomingMessages` - последние входящие сообщения
    - `lastOutgoingMessages` - последние исходящие сообщения

7. **Методы получения сообщений**
    - `receiveNotification` - получение уведомления из очереди
    - `deleteNotification` - удаление уведомления из очереди
    - `downloadFile` - скачивание файла сообщения

8. **Методы статусов (Бета)**
    - `sendTextStatus` - отправка текстового статуса
    - `sendVoiceStatus` - отправка голосового статуса
    - `sendMediaStatus` - отправка медиа-статуса
    - `deleteStatus` - удаление статуса
    - `getStatusStatistic` - получение статистики статуса
    - `getIncomingStatuses` - получение входящих статусов
    - `getOutgoingStatuses` - получение исходящих статусов

9. **Методы API партнера**
    - `getInstances` - получение всех инстансов
    - `createInstance` - создание инстанса
    - `deleteInstanceAccount` - удаление инстанса

## Лицензия

MIT
