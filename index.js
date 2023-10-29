/**
 * `SettingsService` - представляет собой объект реализующий работу с настройками через `PropertiesService` и `CacheService`.
 * @class SettingsService
 * @namespace SettingsService
 * @version 1.1.0
 * @author Maksym Stoianov <stoianov.maksym@gmail.com>
 * @see [Snippet Source](https://script.google.com/home/projects/1eo_miOg4r4MU_G6_kPUBXI-W-8gejGWHOywMiplc1D1yk_dbNTR8zgKQ/edit)
 * @see [Snippet Documentation](https://apps-script.blog/)
 * @todo Использовать рекурсивный прокси для отслеживания изменений объектов в `Settings._values`.
 */
globalThis.SettingsService = class SettingsService {
  /**
   * Получает экземпляр настроек, ограниченный текущим документом и сценарием.
   * ```javascript
   * const settings = SettingsService.getDocumentSettings();
   * settings.email = 'stoianov.maksym@gmail.com';
   * Logger.log(settings.email);
   * ```
   * @return {SettingsService.Settings} Экземпляр настроек документа или `null`.
   */
  static getDocumentSettings() {
    return Reflect.construct(this.Settings, ['document']);
  }



  /**
   * Получает экземпляр настроек, ограниченный сценарием.
   * ```javascript
   * const settings = SettingsService.getScriptSettings();
   * settings.email = 'stoianov.maksym@gmail.com';
   * Logger.log(settings.email);
   * ```
   * @return {SettingsService.Settings} Экземпляр настроек скрипта или `null`.
   */
  static getScriptSettings() {
    return Reflect.construct(this.Settings, ['script']);
  }



  /**
   * Получает экземпляр настроек, ограниченный текущим пользователем и сценарием.
   * ```javascript
   * const settings = SettingsService.getUserSettings();
   * settings.email = 'stoianov.maksym@gmail.com';
   * Logger.log(settings.email);
   * ```
   * @return {SettingsService.Settings} Экземпляр настроек пользователя или `null`.
   */
  static getUserSettings() {
    return Reflect.construct(this.Settings, ['user']);
  }



  /**
   * Возвращает `true`, если объект является [`Settings`](#); иначе, `false`.
   * ```javascript
   * Logger.log(SettingsService.isSettings(value));
   * ```
   * @param {*} input Объект для проверки.
   * @return {boolean}
   */
  static isSettings(input) {
    return input instanceof this.Settings;
  }



  constructor() {
    throw new Error(`${this.constructor.name} is not a constructor.`);
  }
};





/**
 * Конструктор 'Settings' - представляет собой объект для работы с настройками.
 * @class Settings
 * @memberof SettingsService
 */
SettingsService.Settings = class Settings {
  /**
   * @param {string} [input=script] Может быть: `script`, `document` или `user`.
   */
  constructor(input = 'script') {
    if (!arguments.length)
      throw new Error(`Параметры () не соответствуют сигнатуре конструктора ${this}.`);

    if (typeof input !== 'string')
      throw new TypeError(`Параметры (${typeof input}) не соответствуют сигнатуре конструктора ${this}.`);

    if (!['document', 'script', 'user'].includes(input))
      throw new TypeError(`Параметр input содержит недопустимое значение.`);

    /**
     * @private
     * @type {string}
     */
    Object.defineProperty(this, '_service', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: input
    });

    /**
     * @private
     * @type {CacheService.Cache}
     */
    Object.defineProperty(this, '_cache', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: null
    });

    /**
     * @private
     * @type {PropertiesService.Properties}
     */
    Object.defineProperty(this, '_props', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: null
    });

    /**
     * @private
     * @type {Object}
     */
    Object.defineProperty(this, '_values', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: {}
    });

    /**
     * @private
     * @type {Proxy}
     */
    Object.defineProperty(this, '_proxy', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: new Proxy(this, {
        'get': (target, property) => {
          if (property === 'inspect') return null;

          if (typeof property === 'symbol')
            return target[property];

          if (property === '_cache')
            return this._cache ?? (this._cache = (input => {
              switch (input) {
                case 'document': return CacheService.getDocumentCache();
                case 'user': return CacheService.getUserCache();
                case 'script': default: return CacheService.getScriptCache();
              }
            })(this._service));

          if (property === '_props')
            return this._props ?? (this._props = (input => {
              switch (input) {
                case 'document': return PropertiesService.getDocumentProperties();
                case 'user': return PropertiesService.getUserProperties();
                case 'script': default: return PropertiesService.getScriptProperties();
              }
            })(this._service));

          if (typeof target[property] === 'function')
            return (...args) => target[property].apply(this, args);

          let value = target._values[property] ?? null;

          if (value === null) {
            value = this._proxy._cache.get(property) ?? null;

            if (value === null) {
              value = this._proxy._props.getProperty(property) ?? null;

              if (value !== null)
                this._proxy._cache.put(property, value, 21600);
            }
          }

          // Попытка преобразования строки JSON в объект
          try {
            value = JSON.parse(value);
          } catch (error) {
            // Если это не строка JSON, оставить как есть
          }

          return value;
        },


        'set': (target, property, value) => {
          // Преобразование объекта в строку JSON, если это объект
          const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;

          this._proxy._props.setProperty(property, valueToStore);
          this._proxy._cache.put(property, valueToStore, 21600);
          return (target._values[property] = value);
        },


        'deleteProperty': (target, property) => {
          this._props.deleteProperty(property);
          this._cache.remove(property);
          return delete target[property];
        }
      })
    });

    return this._proxy;
  }



  /**
   * Устанавливает заданную пару ключ-значение в текущем хранилище [`Settings`](#).
   * @param {string} key
   * @param {*} value
   * @return {SettingsService.Settings}
   */
  setProperty(key, value) {
    this._proxy[key] = value;
    return this._proxy;
  }



  /**
   * Устанавливает все пары ключ-значение из данного объекта в текущем хранилище [`Settings`](#), при необходимости удаляя все остальные свойства в хранилище.
   * @param {Object} properties Объект, содержащий пары ключ-значение для установки.
   * @param {boolean} [deleteAllOthers=false] Значение `true`, чтобы удалить все другие пары ключ-значение в объекте свойств; `false`, чтобы не удалять.
   * @return {SettingsService.Settings}
   * @todo
   */
  setProperties(properties, deleteAllOthers = false) {
    throw new Error(`Метод ${this}.setProperties еще в разработке!`);
    return this._proxy;
  }



  /**
   * Получает значение, связанное с данным ключом в текущем хранилище [`Settings`](#), или `null`, если такой ключ не существует.
   * @param {string} key Ключ для значения свойства, которое нужно получить.
   * @return {*}
   */
  getProperty(key) {
    return this._proxy[key];
  }



  /**
   * Получает все ключи в текущем хранилище [`Settings`](#).
   * @return {string[]}
   * @todo
   */
  getKeys() {
    throw new Error(`Метод ${this}.getKeys еще в разработке!`);
  }



  /**
   * Получает копию всех пар ключ-значение в текущем хранилище [`Settings`](#).
   * @return {Object} Копия всех пар ключ-значение в текущем хранилище [`Settings`](#).
   * @todo
   */
  getProperties() {
    throw new Error(`Метод ${this}.getProperties еще в разработке!`);
  }



  /**
   * Удаляет свойство с заданным ключом в текущем хранилище [`Settings`](#). 
   * @param {string} key Ключ для свойства, которое нужно удалить.
   * @return {SettingsService.Settings}
   */
  deleteProperty(key) {
    delete this._proxy[key];
    return this._proxy;
  }



  /**
   * Удаляет все свойства в текущем хранилище [`Settings`](#).
   * @return {SettingsService.Settings}
   * @todo
   */
  deleteAllProperties() {
    throw new Error(`Метод ${this}.deleteAllProperties еще в разработке!`);
    return this._proxy;
  }



  /**
   * Возвращает строку, представляющую объект.
   * @return {string}
   */
  toString() {
    return this.constructor.name;
  }
};
