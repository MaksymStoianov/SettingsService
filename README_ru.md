[**BG**](README_bg.md) | [**DE**](README_de.md) | [**EN**](README.md) | **RU** | [**UK**](README_uk.md)

# SettingsService

`SettingsService` - это объект, предназначенный для работы с настройками через `PropertiesService` и `CacheService`.

## Установка

1. Откройте свой проект в [Google Apps Script Dashboard](https://script.google.com/).
2. Скопируйте содержимое файла `index.js` и вставьте его в новый файл в вашем проекте Google Apps Script.

## Использование

### Получение экземпляра настроек документа

```javascript
const settings = SettingsService.getDocumentSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Получение экземпляра настроек сценария
```javascript
const settings = SettingsService.getScriptSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Получение экземпляра настроек пользователя
```javascript
const settings = SettingsService.getUserSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

## Задачи

- [ ] Использовать рекурсивный прокси для отслеживания изменений объектов в `Settings._values`.
- [ ] Создать метод `setProperties()`.
- [ ] Создать метод `getKeys()`.
- [ ] Создать метод `getProperties()`.
- [ ] Создать метод `deleteAllProperties()`.

## История изменений
- **1.1.0**: Исправлены ошибки. Улучшена документация JSDoc.
- **1.0.0**: Релиз.
