[**BG**](README_bg.md) | [**DE**](README_de.md) | **EN** | [**RU**](README_ru.md) | [**UK**](README_uk.md)

# SettingsService

SettingsService is an object designed for working with settings through `PropertiesService` and `CacheService`.

## Installation

1. Open your project in [Google Apps Script Dashboard](https://script.google.com/).
2. Copy the contents of the `index.js` file and paste it into a new file in your Google Apps Script project.

## Usage

### Getting document settings instance

```javascript
const settings = SettingsService.getDocumentSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Getting script settings instance
```javascript
const settings = SettingsService.getScriptSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Getting user settings instance
```javascript
const settings = SettingsService.getUserSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

## Tasks

- [ ] Use recursive proxy to track object changes in `Settings._values`.
- [ ] Create `setProperties()` method.
- [ ] Create `getKeys()` method.
- [ ] Create `getProperties()` method.
- [ ] Create `deleteAllProperties()` method.

## Changelog
- **1.1.0**: Bug fixes. Improved JSDoc documentation.
- **1.0.0**: Release.
