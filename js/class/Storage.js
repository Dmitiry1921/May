const SAVE_INTERVAL = 1000;
let INTERVAL_ID = null;

const REGISTERED_KEYS = [
  'stopAutoSave',
  'clearAll',
  'setOnce',
  'startAutoSave',
  'save',
  'load',
  'validate',
  'data',
];

export default new class Storage {
  constructor() {
    this.data = {};
    this.load();
    this.startAutoSave();
    return new Proxy(this, {
      set(target, property, value) {
        if (REGISTERED_KEYS.includes(property)) {
          throw new Error(`Property "${property}" is reserved`);
        }
        target.data[property] = value;
        return true;
      },
      get(target, property) {
        if (REGISTERED_KEYS.includes(property)) {
          return target[property].bind(target);
        }
        return Storage.getDataWrapper(target.data[property]);
      },
    });
  }

  load() {
    Object.keys(localStorage).forEach(key => {
      try {
        this.data[key] = JSON.parse(localStorage.getItem(key));
      } catch (err) {
        console.warn('Local storage data corrupted', key, err);
        localStorage.removeItem(key);
      }
    });
  }

  validate(data) {
    try {
      JSON.parse(JSON.stringify(data));
      return true;
    } catch (err) {
      return false;
    }
  }

  save() {
    Object.entries(this.data).forEach(([key, value]) => {
      localStorage[this.validate(value) ? 'setItem' : 'removeItem'](key, JSON.stringify(value));
    });
  }

  stopAutoSave(cause) {
    console.warn('Storage.stopAutoSave()', {cause}, new Error().stack);
    clearInterval(INTERVAL_ID);
  }

  clearAll() {
    this.stopAutoSave('clearAll');
    localStorage.clear();
  }

  setOnce(key, data) {
    if (Storage.getDataWrapper(this.data[key]) === null) {
      this.data[key] = data;
    }
  }

  startAutoSave() {
    // Останавливаем предыдущий интервал, если он был запущен
    if(INTERVAL_ID !== null) this.stopAutoSave('startAutoSave');
    INTERVAL_ID = setInterval(this.save.bind(this), SAVE_INTERVAL);
  }

  static getDataWrapper(data) {
    return data === undefined ? null : data;
  }
};
