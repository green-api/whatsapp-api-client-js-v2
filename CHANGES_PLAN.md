# План доработки SDK — сравнение с документацией GREEN-API

> Дата составления: 2026-07-09  
> Источник документации: https://green-api.com/docs/api/  
> Принцип: **обратная совместимость не нарушается** — все новые поля опциональны (`?`), существующие методы и типы не изменяются.

---

## 1. НОВЫЕ МЕТОДЫ (добавить в `green-api-client.ts`)

### 1.1 Раздел Account

#### `updateApiToken()`
- **Метод API:** `GET /waInstance{id}/updateApiToken/{token}`
- **Описание:** Генерирует новый токен API для инстанса. Бета-версия.
- **Параметры запроса:** нет
- **Ответ:** `{ apiTokenInstance: string }`
- **Пример:**
  ```typescript
  const result = await client.updateApiToken();
  console.log('Новый токен:', result.apiTokenInstance);
  ```

#### `getStateInstanceHistory(count?: number)`
- **Метод API:** `GET /waInstance{id}/GetStateInstanceHistory/{token}?count=100`
- **Описание:** Возвращает историю изменений состояния инстанса в хронологическом порядке.
- **Параметры запроса:** `count` (integer, optional) — количество записей, по умолчанию 100
- **Ответ:** `StateInstanceHistoryItem[]`
  - `stateInstance` (string): `"notAuthorized"` | `"authorized"` | `"blocked"`
  - `timestamp` (integer): время события в UNIX формате
  - `phoneNumber` (integer): связанный номер телефона
- **Пример:**
  ```typescript
  const history = await client.getStateInstanceHistory(50);
  history.forEach(item => {
    console.log(`${item.stateInstance} — ${new Date(item.timestamp * 1000)}`);
  });
  ```

---

### 1.2 Раздел Sending

#### `sendInteractiveButtons(params: SendInteractiveButtons)`
- **Метод API:** `POST /waInstance{id}/sendInteractiveButtons/{token}`
- **Описание:** Отправляет сообщение с интерактивными кнопками (copy/call/url). Бета-версия.
- **⚠️ Предупреждения "Attention, please! The method is temporarily not working" в документации НЕТ** — метод реализовать можно.
- **Параметры запроса:**
  - `chatId` (string, обязательный)
  - `header` (string, optional) — заголовок
  - `body` (string, обязательный) — текст, макс. 20 000 символов
  - `footer` (string, optional) — подвал
  - `buttons` (array, обязательный) — массив кнопок, макс. 3 штуки:
    - `type`: `"copy"` | `"call"` | `"url"`
    - `buttonId` (string)
    - `buttonText` (string, макс. 25 символов)
    - `copyCode` (string, optional) — для type=copy
    - `phoneNumber` (string, optional) — для type=call
    - `url` (string, optional) — для type=url
- **Ответ:** `{ idMessage: string }`
- **Пример:**
  ```typescript
  await client.sendInteractiveButtons({
    chatId: "1234567890@c.us",
    header: "Заголовок",
    body: "Выберите действие",
    footer: "Подвал",
    buttons: [
      { type: "url", buttonId: "1", buttonText: "Открыть сайт", url: "https://example.com" },
      { type: "call", buttonId: "2", buttonText: "Позвонить", phoneNumber: "79001234567" },
      { type: "copy", buttonId: "3", buttonText: "Скопировать", copyCode: "PROMO2025" }
    ]
  });
  ```

#### `sendInteractiveButtonsReply(params: SendInteractiveButtonsReply)`
- **Метод API:** `POST /waInstance{id}/sendInteractiveButtonsReply/{token}`
- **Описание:** Отправляет сообщение с кнопками, возвращающими текст в чат при нажатии. Бета-версия.
- **⚠️ Предупреждения "temporarily not working" НЕТ** — метод реализовать можно.
- **Параметры запроса:**
  - `chatId` (string, обязательный)
  - `header` (string, optional)
  - `body` (string, обязательный)
  - `footer` (string, optional)
  - `buttons` (array, обязательный) — макс. 3 кнопки:
    - `buttonId` (string)
    - `buttonText` (string, макс. 25 символов)
- **Ответ:** `{ idMessage: string }`
- **Пример:**
  ```typescript
  await client.sendInteractiveButtonsReply({
    chatId: "1234567890@c.us",
    header: "Опрос",
    body: "Как вас зовут?",
    footer: "Выберите вариант",
    buttons: [
      { buttonId: "1", buttonText: "Иван" },
      { buttonId: "2", buttonText: "Мария" },
      { buttonId: "3", buttonText: "Другое" }
    ]
  });
  ```

---

### 1.3 Раздел Service

#### `sendTyping(params: SendTyping)`
- **Метод API:** `POST /waInstance{id}/sendTyping/{token}`
- **Описание:** Отправляет индикатор набора текста или записи аудио в чат.
- **Параметры запроса:**
  - `chatId` (string, обязательный)
  - `typingTime` (integer, optional) — длительность в миллисекундах, диапазон 1000–20000
  - `typingType` (string, optional) — `"recording"` для индикатора записи аудио (по умолчанию — набор текста)
- **Ответ:** пустое тело (HTTP 200)
- **Пример:**
  ```typescript
  // Индикатор набора текста на 5 секунд
  await client.sendTyping({
    chatId: "1234567890@c.us",
    typingTime: 5000
  });

  // Индикатор записи аудио
  await client.sendTyping({
    chatId: "1234567890@c.us",
    typingTime: 3000,
    typingType: "recording"
  });
  ```

#### `getChats(count?: number)`
- **Метод API:** `GET /waInstance{id}/getChats/{token}?count=N`
- **Описание:** Возвращает список чатов, отсортированных по времени последней активности.
- **Параметры запроса:** `count` (integer, optional)
- **Ответ:** `Chat[]`
  - `archive` (boolean)
  - `id` (string) — идентификатор чата
  - `ephemeralExpiration` (integer) — 0 / 86400 / 604800 / 7776000
  - `ephemeralSettingTimestamp` (integer)
  - `name` (string)
  - `type` (string): `"user"` | `"group"`
- **Пример:**
  ```typescript
  const chats = await client.getChats(20);
  chats.forEach(chat => {
    console.log(`${chat.name} (${chat.type}): архив=${chat.archive}`);
  });
  ```

---

### 1.4 Раздел Journals

#### `lastIncomingCalls(minutes?: number)`
- **Метод API:** `GET /waInstance{id}/lastIncomingCalls/{token}?minutes=1440`
- **Описание:** Возвращает журнал входящих звонков за указанный период. По умолчанию 1440 минут (24 часа). Требует включённых настроек `incomingWebhook` и `incomingCallWebhook`.
- **Параметры запроса:** `minutes` (integer, optional)
- **Ответ:** `IncomingCall[]`
  - `type`: `"incoming"`
  - `idMessage` (string)
  - `timestamp` (integer) — время окончания звонка в UNIX
  - `typeMessage`: `"incomingCall"`
  - `chatId` (string)
  - `isVideo` (boolean)
  - `status`: `"pickUp"` | `"hungUp"` | `"declined"`
  - `isGroup` (boolean)
- **Пример:**
  ```typescript
  const calls = await client.lastIncomingCalls(60);
  calls.forEach(call => {
    console.log(`Звонок от ${call.chatId}: ${call.status}, видео=${call.isVideo}`);
  });
  ```

#### `lastOutgoingCalls(minutes?: number)`
- **Метод API:** `GET /waInstance{id}/lastOutgoingCalls/{token}?minutes=1440`
- **Описание:** Возвращает журнал исходящих звонков за указанный период. По умолчанию 1440 минут.
- **Параметры запроса:** `minutes` (integer, optional)
- **Ответ:** `OutgoingCall[]`
  - `type`: `"outgoing"`
  - `idMessage` (string)
  - `timestamp` (integer)
  - `typeMessage`: `"outgoingCall"`
  - `chatId` (string)
  - `duration` (integer) — длительность в секундах
  - `isVideo` (boolean)
  - `status`: `"pickUp"` | `"hungUp"` | `"invalid"` | `"declined"`
  - `participants` (array): `{ id: string; status: "pickUp" | "hungUp" | "declined" | "invalid" }[]`
- **Пример:**
  ```typescript
  const calls = await client.lastOutgoingCalls();
  calls.forEach(call => {
    console.log(`Звонок на ${call.chatId}: ${call.status}, длительность=${call.duration}с`);
  });
  ```

---

## 2. ИЗМЕНЕНИЯ В СУЩЕСТВУЮЩИХ ТИПАХ

### 2.1 `src/types/instance.ts` — интерфейс `Settings`

Добавить недостающие поля (все опциональные — обратная совместимость сохранена):

| Поле | Тип | Описание |
|------|-----|----------|
| `countryInstance` | `string` | Не используется в настоящее время |
| `sharedSession` | `string` | Не используется в настоящее время |
| `deviceWebhook` | `"yes" \| "no"` | Уведомления о статусе устройства (временно недоступно) |
| `autoTyping` | `number` | Автоматическое время набора (шкала 0–10) |
| `linkPreview` | `"yes" \| "no"` | Показывать предпросмотр ссылок |
| `enableLidMode` | `"yes" \| "no"` | Использовать формат идентификатора чата `@lid` |

> **Поля `statusInstanceWebhook` и `enableMessagesHistory`** из документации SetSettings помечены "Not in use" — не добавляем.

---

### 2.2 `src/types/webhooks.ts` — тип `WebhookType`

Добавить недостающее значение:
- `"incomingBlock"` — уведомление о блокировке пользователем

Добавить интерфейс `IncomingBlockWebhook`:
```typescript
export interface IncomingBlockWebhook {
  typeWebhook: "incomingBlock";
  instanceData: {
    idInstance: number;
    wid: string;
    typeInstance: string;
  };
  timestamp: number;
  chatId: string;
}
```

Добавить `IncomingBlockWebhook` в union `GreenApiWebhook`.

---

## 3. НОВЫЕ ТИПЫ (добавить в соответствующие файлы)

### 3.1 В `src/types/instance.ts`

```typescript
export interface UpdateApiTokenResponse {
  apiTokenInstance: string;
}

export interface StateInstanceHistoryItem {
  stateInstance: "notAuthorized" | "authorized" | "blocked";
  timestamp: number;
  phoneNumber: number;
}
```

### 3.2 В `src/types/messages.ts` (или новый файл `src/types/service.ts`)

```typescript
export interface SendTyping {
  chatId: string;
  typingTime?: number;      // 1000–20000 мс
  typingType?: "recording"; // по умолчанию — набор текста
}

export interface Chat {
  archive: boolean;
  id: string;
  ephemeralExpiration: EphemeralExpiration; // переиспользовать из contacts.ts
  ephemeralSettingTimestamp: number;
  name: string;
  type: ContactType; // переиспользовать из contacts.ts
}
```

### 3.3 Новый файл `src/types/calls.ts` (или добавить в `messages.ts`)

```typescript
export type IncomingCallStatus = "pickUp" | "hungUp" | "declined";
export type OutgoingCallStatus = "pickUp" | "hungUp" | "invalid" | "declined";

export interface IncomingCall {
  type: "incoming";
  idMessage: string;
  timestamp: number;
  typeMessage: "incomingCall";
  chatId: string;
  isVideo: boolean;
  status: IncomingCallStatus;
  isGroup: boolean;
}

export interface OutgoingCallParticipant {
  id: string;
  status: OutgoingCallStatus;
}

export interface OutgoingCall {
  type: "outgoing";
  idMessage: string;
  timestamp: number;
  typeMessage: "outgoingCall";
  chatId: string;
  duration: number;
  isVideo: boolean;
  status: OutgoingCallStatus;
  participants: OutgoingCallParticipant[];
}
```

### 3.4 В `src/types/messages.ts` — интерактивные кнопки

```typescript
export type InteractiveButtonType = "copy" | "call" | "url";

export interface InteractiveButton {
  type: InteractiveButtonType;
  buttonId: string;
  buttonText: string;       // макс. 25 символов
  copyCode?: string;        // для type="copy"
  phoneNumber?: string;     // для type="call"
  url?: string;             // для type="url"
}

export interface InteractiveButtonReply {
  buttonId: string;
  buttonText: string;       // макс. 25 символов
}

export interface SendInteractiveButtons {
  chatId: string;
  header?: string;
  body: string;             // макс. 20 000 символов
  footer?: string;
  buttons: InteractiveButton[];  // макс. 3 кнопки
}

export interface SendInteractiveButtonsReply {
  chatId: string;
  header?: string;
  body: string;
  footer?: string;
  buttons: InteractiveButtonReply[];  // макс. 3 кнопки
}
```

---

## 4. ОБРАТНАЯ СОВМЕСТИМОСТЬ

| Изменение | Влияние на существующий код |
|-----------|----------------------------|
| Новые поля в `Settings` | ✅ Все опциональные (`?`), старый код компилируется без изменений |
| Новые поля в `WebhookType` | ✅ Расширение union — существующий код с `switch/if` просто не обработает новый тип, но не сломается |
| Новый `IncomingBlockWebhook` в `GreenApiWebhook` | ⚠️ Если пользователь использует exhaustive check (`never`) — нужно добавить ветку. Стоит отметить в changelog. |
| Новые методы в `GreenApiClient` | ✅ Только добавление, ничего не меняется |
| Новые интерфейсы и типы | ✅ Экспортируются из `src/types/index.ts` дополнительно, ничего не удаляется |

---

## 5. МЕТОДЫ ИЗ ДОКУМЕНТАЦИИ, КОТОРЫЕ НЕ РЕАЛИЗУЕМ

| Метод | Причина |
|-------|---------|
| `GetStatusInstance` | Помечен в доке как "Архив" (устарел, заменён `GetStateInstance`) |
| `SendButtons` | Архив |
| `SendTemplateButtons` | Архив |
| `SendListMessage` | Архив |
| `deviceWebhook`, `incomingBlockWebhook` в settings | Помечены как "temporarily unavailable" в SetSettings |

---

## 6. ПОРЯДОК РЕАЛИЗАЦИИ (предлагаемый)

1. Добавить новые типы в файлы типов (`instance.ts`, `messages.ts`, `webhooks.ts`)
2. Создать `src/types/calls.ts` с типами звонков
3. Обновить `src/types/index.ts` — экспортировать все новые типы
4. Добавить новые методы в `green-api-client.ts`
5. При необходимости — добавить валидацию для `sendInteractiveButtons` (макс. 3 кнопки, макс. 25 символов в `buttonText`)
