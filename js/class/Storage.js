const SAVE_INTERVAL = 1000;

const storage = new class Storage {
  #data = {};
  constructor() {
    // Загрузка данных из localStorage
    this.#load();
    // Запуск таймера сохранения
    setInterval(this.#save.bind(this), SAVE_INTERVAL);
    // Возвращаем прокси для работы с данными
    return new Proxy(this, {
      set(target, property, value) {
        console.info(`Установлено свойство "${property}" со значением "${value}"`);
        target.#data[property] = value;
        return true;
      },
      get(target, property) {
        const data = target.#data[property];
        return data === undefined ? null : data;
      },
    });
  }

  #load() {
    Object.keys(localStorage).forEach(key => {
      try {
        this.#data[key] = JSON.parse(localStorage.getItem(key));
      } catch (err) {
        console.warn('Local storage data corrupted', key, err);
        localStorage.removeItem(key);
      }
    });
  }

  #validate(data) {
    try {
      JSON.parse(JSON.stringify(data));
      return true;
    } catch (err) {
      return false;
    }
  }

  #save() {
    Object.entries(this.#data)
      .forEach(([key, value]) => {
        // В случае если данные не валидны, удаляем их из localStorage
        localStorage[this.#validate(value) ? 'setItem': 'removeItem'](key, JSON.stringify(this.#data[key]));
      });
  }
}

export function setOne(key, data) {
  if(storage[key] == null){
    storage[key] = data;
  }
}
export function unSet() {

}

export default storage;



