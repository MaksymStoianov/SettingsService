# SettingsService

`SettingsService` - это объект, предназначенный для работы с настройками через `PropertiesService` и `CacheService`.

- **Версия**: 1.1.0
- **Автор**: Maksym Stoianov <stoianov.maksym@gmail.com>
- [Исходный код](https://script.google.com/home/projects/1eo_miOg4r4MU_G6_kPUBXI-W-8gejGWHOywMiplc1D1yk_dbNTR8zgKQ/edit)
- [Документация](https://apps-script.blog/)

## Описание

`SettingsService` предоставляет удобный способ работы с настройками, ограниченными текущим документом, сценарием или пользователем, используя `PropertiesService` и `CacheService`.

## Примеры использования

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

## TODO:
- Использовать рекурсивный прокси для отслеживания изменений объектов в `Settings._values`.
- setProperties()
- getKeys()
- getProperties()
- deleteAllProperties()

## История изменений:
- **1.1.0** - Исправлены ошибки. Улучшена документация JSDoc.
- **1.0.0** - Релиз.
