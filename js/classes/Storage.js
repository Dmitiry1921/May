import {_gameSet} from "../lib/engine.js";

import global from "../config/global.js";
import _lvl from "../config/lvl.js";

export default new class Storage {
  constructor() {
    //Если пользователь зашел первый раз в игру устанавливаем настройки..
    this.setOne('_lvl', 0); //Устанавливаем уровень персонажа.
    this.setOne('_inventory', {tool: null, itms: {0: null, 1: null, 2: null, 3: null, 4: null}});
  }
  set(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
  };
  setOne(key, data) {
    if (localStorage.getItem(key) == null) {
      this.set(key, data);
    }
  };
  get(name) {
    return JSON.parse(localStorage.getItem(name));
  };
  save() {
    const _level = this.get("_lvl");
    this.set(_level, {_mobs: global._Mobs, _map: _lvl[_level].map});
    this.set('_hero', global._Hero);
  };
  unset(lvl) {
    _gameSet(function () {});
    if (lvl === undefined) localStorage.clear(); else this.set(lvl, null);
  }
}
