[**BG**](README_bg.md) | **DE** | [**EN**](README.md) | [**RU**](README_ru.md) | [**UK**](README_uk.md)

# SettingsService

SettingsService ist ein Objekt, das zur Arbeit mit Einstellungen über `PropertiesService` und `CacheService` vorgesehen ist.

## Installation

1. Öffnen Sie Ihr Projekt im [Google Apps Script Dashboard](https://script.google.com/).
2. Kopieren Sie den Inhalt der Datei `index.js` und fügen Sie ihn in eine neue Datei in Ihrem Google Apps Script-Projekt ein.

## Verwendung

### Instanz der Dokumenteinstellungen erhalten

```javascript
const settings = SettingsService.getDocumentSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Instanz der Skripteinstellungen erhalten
```javascript
const settings = SettingsService.getScriptSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

### Instanz der Benutzereinstellungen erhalten
```javascript
const settings = SettingsService.getUserSettings();
settings.email = 'stoianov.maksym@gmail.com';
Logger.log(settings.email);
```

## Aufgaben

- [ ] Rekursiven Proxy verwenden, um Änderungen an Objekten in `Settings._values` zu verfolgen.
- [ ] Methode `setProperties()` erstellen.
- [ ] Methode `getKeys()` erstellen.
- [ ] Methode `getProperties()` erstellen.
- [ ] Methode `deleteAllProperties()` erstellen.

## Änderungsprotokoll
- **1.1.0**: Fehlerbehebungen. Verbesserte JSDoc-Dokumentation.
- **1.0.0**: Erstveröffentlichung.
