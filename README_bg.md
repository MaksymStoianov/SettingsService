**BG** | [**DE**](README_de.md) | [**EN**](README.md) | [**RU**](README_ru.md) | [**UK**](README_uk.md)

# SettingsService

SettingsService е обект, предназначен за работа с настройки чрез `PropertiesService` и `CacheService`.

## Инсталация

1. Отворете вашия проект в [Google Apps Script Dashboard](https://script.google.com/).
2. Копирайте съдържанието на файла `index.js` и го поставете в нов файл във вашия проект на Google Apps Script.

## Употреба

### Получаване на инстанция на настройките на документа

```javascript
const settings = SettingsService.getDocumentSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Получаване на инстанция на настройките на скрипта
```javascript
const settings = SettingsService.getScriptSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Получаване на инстанция на потребителските настройки
```javascript
const settings = SettingsService.getUserSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

## Задачи

- [ ] Използвайте рекурсивен прокси за проследяване на промени в обектите в `Settings._values`.
- [ ] Създайте метод `setProperties()`.
- [ ] Създайте метод `getKeys()`.
- [ ] Създайте метод `getProperties()`.
- [ ] Създайте метод `deleteAllProperties()`.

## История на промените
- **1.1.0**: Коригирани грешки. Подобрена JSDoc документация.
- **1.0.0**: Първоначална публикация.
