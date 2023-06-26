'use strict';

let SAVE_INTERVAL = 1000;
let INTERVAL_ID = null;

const STORAGE = localStorage;

const REGISTERED_KEYS = [
  'getAutoSaveInterval',
  'setAutoSaveInterval',
  'stopAutoSave',
  'clearAll',
  'setOnce',
  'startAutoSave',
  'save',
  'load',
  'validate',
  '_data',
  '_setAutoSaveInterval',
  '_getAutoSaveInterval',
];

export default new class Storage {
  constructor() {
    this._data = {};
    this.load();
    this.startAutoSave();
    return new Proxy(this, {
      set(target, property, value) {
        if (REGISTERED_KEYS.includes(property)) {
          throw new Error(`Property "${property}" is reserved`);
        }
        target._data[property] = value;
        return true;
      },
      get(target, property) {
        if (REGISTERED_KEYS.includes(property)) {
          if(typeof target[property] === 'function') {
            return target[property].bind(target);
          }
          return target[property];
        }
        return Storage.getDataWrapper(target._data[property]);
      },
    });
  }
  _getAutoSaveInterval() {
    return SAVE_INTERVAL;
  }
  _setAutoSaveInterval(time) {
    if(typeof time !== 'number') throw new TypeError('AUTO_SAVE_INTERVAL_SHOULD_BE_NUMBER');
    this.stopAutoSave();
    SAVE_INTERVAL = time;
    this.startAutoSave();
    return this._getAutoSaveInterval();
  }
  load() {
    Object.keys(STORAGE).forEach(key => {
      try {
        this._data[key] = JSON.parse(STORAGE.getItem(key));
      } catch (err) {
        console.warn('Local storage data corrupted', key, err);
        STORAGE.removeItem(key);
      }
    });
  }

  save() {
    Object.entries(this._data).forEach(([key, value]) => {
      STORAGE[Storage.validate(value) ? 'setItem' : 'removeItem'](key, JSON.stringify(value));
    });
  }

  stopAutoSave() {
    clearInterval(INTERVAL_ID);
    INTERVAL_ID = null;
    return INTERVAL_ID;
  }

  startAutoSave() {
    // Останавливаем предыдущий интервал, если он был запущен
    if(INTERVAL_ID !== null) this.stopAutoSave('startAutoSave');
    INTERVAL_ID = setInterval(this.save.bind(this), this._getAutoSaveInterval());
    return INTERVAL_ID;
  }

  clearAll() {
    this.stopAutoSave();
    this._data = {}; // очищаем proxy хранилище
    STORAGE.clear(); // очищаем STORAGE
  }

  setOnce(key, data) {
    if (Storage.getDataWrapper(this._data[key]) === null) {
      this._data[key] = data;
    }
  }

  static getDataWrapper(data) {
    return data === undefined ? null : data;
  }

  static validate(data) {
    try {
      JSON.parse(JSON.stringify(data));
      return true;
    } catch (err) {
      return false;
    }
  }
}

