[**BG**](README_bg.md) | [**DE**](README_de.md) | [**EN**](README.md) | [**RU**](README_ru.md) | **UK**

# SettingsService

SettingsService - це об'єкт, призначений для роботи з налаштуваннями через PropertiesService та CacheService.

## Встановлення

1. Відкрийте свій проект в [Google Apps Script Dashboard](https://script.google.com/).
2. Скопіюйте вміст файлу `index.js` та вставте його в новий файл у вашому проекті Google Apps Script.

## Використання

### Отримання екземпляра налаштувань документа

```javascript
const settings = SettingsService.getDocumentSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Отримання екземпляра налаштувань сценарію
```javascript
const settings = SettingsService.getScriptSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Отримання екземпляра налаштувань користувача
```javascript
const settings = SettingsService.getUserSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

## Завдання

- [ ] Використовувати рекурсивний проксі для відслідковування змін об'єктів у `Settings._values`.
- [ ] Створити метод `setProperties()`.
- [ ] Створити метод `getKeys()`.
- [ ] Створити метод `getProperties()`.
- [ ] Створити метод `deleteAllProperties()`.

## Історія змін
- **1.1.0**: Виправлені помилки. Покращена документація JSDoc.
- **1.0.0**: Реліз.
