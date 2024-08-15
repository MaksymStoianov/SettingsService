/**
 * MIT License
 * 
 * Copyright (c) 2023 Maksym Stoianov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// - 3

/**
 * [`SettingsService`](https://github.com/MaksymStoianov/SettingsService) работает подобно [`PropertiesService`](https://developers.google.com/apps-script/reference/properties), но с улучшенными возможностями.
 * 
 * Текущая модификация уменьшае нагрузку на системные лимиты при чтении и записи свойств.
 * Это достигается за счет параллельного хранения данных в [`CacheService`](https://developers.google.com/apps-script/reference/cache).
 * 
 * __Внимание!__ Использование этого сервиса может увеличить время выполнения скрипта.
 * 
 * @class               SettingsService
 * @namespace           SettingsService
 * @version             1.1.5
 * @author              Maksym Stoianov <stoianov.maksym@gmail.com>
 * @license             MIT
 * @tutorial            https://maksymstoianov.com/
 * @see                 [Source](https://script.google.com/home/projects/1eo_miOg4r4MU_G6_kPUBXI-W-8gejGWHOywMiplc1D1yk_dbNTR8zgKQ/edit)
 * @see                 [GitHub](https://github.com/MaksymStoianov/SettingsService)
 * 
 * @todo Использовать рекурсивный прокси для отслеживания изменений объектов в `settings._values`.
 */
class SettingsService {

  /**
   * Создает и возвращает экземпляр класса [`Settings`](#).
   * @return {SettingsService.Settings}
   */
  static newSettings(...args) {
    return Reflect.construct(this.Settings, args);
  }



  /**
   * Получает экземпляр настроек, ограниченный текущим документом и сценарием.
   * 
   * #### Example 1
   * ```javascript
   * const settings = SettingsService.getDocumentSettings();
   * settings.setProperty('email', 'stoianov.maksym@gmail.com');
   * console.log(settings.getProperty());
   * ```
   * 
   * #### Example 2
   * ```javascript
   * const settings = SettingsService.getDocumentSettings();
   * settings.email = 'stoianov.maksym@gmail.com';
   * console.log(settings.email);
   * ```
   * @return {SettingsService.Settings} Экземпляр настроек документа или `null`.
   */
  static getDocumentSettings() {
    return this.newSettings('document');
  }



  /**
   * Получает экземпляр настроек, ограниченный сценарием.
   * 
   * #### Example 1
   * ```javascript
   * const settings = SettingsService.getScriptSettings();
   * settings.setProperty('email', 'stoianov.maksym@gmail.com');
   * console.log(settings.getProperty());
   * ```
   * 
   * #### Example 2
   * ```javascript
   * const settings = SettingsService.getScriptSettings();
   * settings.email = 'stoianov.maksym@gmail.com';
   * console.log(settings.email);
   * ```
   * @return {SettingsService.Settings} Экземпляр настроек скрипта или `null`.
   */
  static getScriptSettings() {
    return this.newSettings('script');
  }



  /**
   * Получает экземпляр настроек, ограниченный текущим пользователем и сценарием.
   * 
   * #### Example 1
   * ```javascript
   * const settings = SettingsService.getUserSettings();
   * settings.setProperty('email', 'stoianov.maksym@gmail.com');
   * console.log(settings.getProperty());
   * ```
   *
   * #### Example 2
   * ```javascript
   * const settings = SettingsService.getUserSettings();
   * settings.email = 'stoianov.maksym@gmail.com';
   * console.log(settings.email);
   * ```
   * @return {SettingsService.Settings} Экземпляр настроек пользователя или `null`.
   */
  static getUserSettings() {
    return this.newSettings('user');
  }



  /**
   * Возвращает `true`, если объект является [`Settings`](#); иначе, `false`.
   * @param {*} input Значение для проверки.
   * @return {boolean}
   */
  static isSettings(input) {
    if (!arguments.length)
      throw new Error(`The parameters () don't match any method signature for ${this.name}.isSettings.`);

    return (input instanceof this.Settings);
  }



  constructor() {
    throw new Error(`${this.constructor.name} is not a constructor.`);
  }

}





/**
 * Конструктор 'Settings' - представляет собой объект для работы с настройками.
 * @class               Settings
 * @memberof            SettingsService
 * @version             1.1.5
 */
SettingsService.Settings = class Settings {

  /**
   * @param {string} [service = 'script'] Может быть: `script`, `document` или `user`.
   */
  constructor(service = 'script') {

    /**
     * @private
     * @type {string}
     */
    this._service = null;


    /**
     * @private
     * @type {PropertiesService.Properties}
     */
    this._props = null;


    /**
     * @private
     * @type {CacheService.Cache}
     */
    this._cache = null;


    /**
     * @private
     * @type {Object}
     */
    this._values = {};


    /**
     * @private
     * @type {Proxy}
     */
    this._proxy = new Proxy(this, {

      /**
       * @param {Object} target 
       * @param {string} prop 
       * @param {Object} receiver
       * @return {*}
       */
      get(target, prop, receiver) {
        if (prop === 'inspect') {
          return null;
        }

        if (prop == '_proxy') {
          return receiver;
        }

        if (typeof prop === 'symbol' || ['_service', '_cache', '_props', '_values'].includes(prop)) {
          return target[prop];
        }

        if (typeof target[prop] === 'function') {
          return (...args) => target[prop](...args);
        }

        return target.getProperty(prop);
      },



      /**
       * @param {Object} target 
       * @param {string} prop 
       * @param {*} value 
       * @param {Object} receiver
       * @return {*}
       */
      set(target, prop, value) {
        if (['_service', '_cache', '_props', '_values', '_proxy'].includes(prop)) {
          return void 0;
        }

        return target.setProperty(prop, value);
      },



      /**
       * @param {Object} target 
       * @param {string} prop 
       * @return {*}
       */
      deleteProperty(target, prop) {
        return target.deleteProperty(prop);
      }

    });


    for (const key of Object.getOwnPropertyNames(this)) {
      if (key.startsWith('_')) {
        // Скрыть свойство
        Object.defineProperty(this, key, {
          "configurable": true,
          "enumerable": false,
          "writable": true
        });
      }
    }

    if (service) {
      this.setService(service);
    }

    return this._proxy;
  }



  /**
   * Устанавливает сервис.
   * @param {string} [input = 'script'] Может быть: `script`, `document` или `user`.
   */
  setService(input = 'script') {
    if (!arguments.length) {
      throw new Error(`Параметры () не соответствуют сигнатуре метода ${this.constructor.name}.setService.`);
    }

    if (typeof input !== 'string') {
      throw new TypeError(`Параметры (${typeof input}) не соответствуют сигнатуре конструктора ${this.constructor.name}.setService.`);
    }

    if (!['document', 'script', 'user'].includes(input)) {
      throw new TypeError(`Параметр input содержит недопустимое значение.`);
    }

    this._service = input;

    // Инициализация сервисов
    switch (this._service) {
      case 'document':
        this._props = PropertiesService.getDocumentProperties();
        this._cache = CacheService.getDocumentCache();
        break;

      case 'user':
        this._props = PropertiesService.getUserProperties();
        this._cache = CacheService.getUserCache();
        break;

      case 'script':
      default:
        this._props = PropertiesService.getScriptProperties();
        this._cache = CacheService.getScriptCache();
        break;
    }
  }



  /**
   * Устанавливает заданную пару ключ-значение в текущем хранилище [`Settings`](#).
   * @param {string} key
   * @param {*} value
   */
  setProperty(key, value) {
    if (!arguments.length)
      throw new Error(`Параметры () не соответствуют сигнатуре метода ${this.constructor.name}.setProperty.`);

    // Преобразование объекта в строку JSON, если это объект
    const valueToStore = (typeof value === 'object' && value !== null ? JSON.stringify(value) : value);

    const result = this._props.setProperty(key, valueToStore);

    // Сохранить значение во временное хранилище сеанса (в текущем объекте).
    this._values[key] = valueToStore;

    try {
      this._cache.put(key, valueToStore, 21600);
    } catch (error) {
      console.error(error.stack);
    }

    return result;
  }



  /**
   * Устанавливает все пары ключ-значение из данного объекта в текущем хранилище [`Settings`](#), при необходимости удаляя все остальные свойства в хранилище.
   * @param {Object} properties Объект, содержащий пары ключ-значение для установки.
   * @param {boolean} [deleteAllOthers = false] Значение `true`, чтобы удалить все другие пары ключ-значение в объекте свойств; `false`, чтобы не удалять.
   * @return {SettingsService.Settings}
   * @todo
   */
  setProperties(properties, deleteAllOthers = false) {
    throw new Error(`Метод ${this.constructor.name}.setProperties еще в разработке!`);
  }



  /**
   * Получает значение, связанное с данным ключом в текущем хранилище [`Settings`](#), или `null`, если такой ключ не существует.
   * @param {string} key Ключ для значения свойства, которое нужно получить.
   * @return {*}
   */
  getProperty(key) {
    if (!arguments.length)
      throw new Error(`Параметры () не соответствуют сигнатуре метода ${this.constructor.name}.getProperty.`);

    let value = null;

    // Извлечь значение из временного хранилища сеанса (в текущем объекте).
    if (key in this._values) {
      value = (this._values[key] ?? null);
    }

    // Извлечь значение из cache.
    if (value === null) {
      try {
        value = (this._cache.get(key) ?? null);
      } catch (error) {
        console.warn(error.stack);
      }
    }

    // Извлечь значение из props.
    if (value === null) {
      value = (this._props.getProperty(key) ?? null);
    }

    // Сохранить значение в cache.
    if (value !== null) {
      try {
        this._cache.put(key, value, 21600);
      } catch (error) {
        console.warn(error.stack);
      }
    }

    // Попытка преобразования строки JSON в объект
    try {
      value = JSON.parse(value);
    } catch (error) { }

    return value;
  }



  /**
   * Получает все ключи в текущем хранилище [`Settings`](#).
   * @return {string[]}
   * @todo
   */
  getKeys() {
    throw new Error(`Метод ${this.constructor.name}.getKeys еще в разработке!`);
  }



  /**
   * Получает копию всех пар ключ-значение в текущем хранилище [`Settings`](#).
   * @return {Object} Копия всех пар ключ-значение в текущем хранилище [`Settings`](#).
   * @todo
   */
  getProperties() {
    throw new Error(`Метод ${this.constructor.name}.getProperties еще в разработке!`);
  }



  /**
   * Удаляет свойство с заданным ключом в текущем хранилище [`Settings`](#).
   * @param {string} key Ключ для свойства, которое нужно удалить.
   */
  deleteProperty(key) {
    if (!arguments.length)
      throw new Error(`Параметры () не соответствуют сигнатуре метода ${this.constructor.name}.deleteProperty.`);

    // Удалить значение из временного хранилища сеанса (в текущем объекте).
    if (key in this._values) {
      delete this._values[key];
    }

    const result = this._props.deleteProperty(key);

    try {
      this._cache.remove(key);
    } catch (error) {
      console.warn(error.stack);
    }

    return result;
  }



  /**
   * Удаляет все свойства в текущем хранилище [`Settings`](#).
   * @return {SettingsService.Settings}
   * @todo
   */
  deleteAllProperties() {
    throw new Error(`Метод ${this.constructor.name}.deleteAllProperties еще в разработке!`);
  }



  /**
   * Возвращает строку, представляющую объект.
   * @return {string}
   */
  toString() {
    return this.constructor.name;
  }

};
