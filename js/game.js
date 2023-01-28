/**
 * Created by Dima101 on 22.04.2016.
 */
import Interface from './classes/Interface.js';
import Map from './classes/Map.js';
import Storage from './classes/Storage.js';
import Sprite from './classes/Sprite.js';

import Enemy from './classes/Enemy.js';
import Person from './classes/Person.js';

import _lvl from "./config/lvl.js";
import global from "./config/global.js";
import {_gameStart, _gameSet} from "./lib/engine.js";

const _level = global._level;
let _Mobs =  global._Mobs;

function createMobs() {
  let j = 0;
  const mp = _lvl[_level];
  for (let type in mp) {
    if (type === "map") continue;
    if (type === "hero") {
      //Моб №1 Это персонаж.
      _Mobs.push(new Person(Map.setting.canvas.dom, mp[type].x, mp[type].y));
      if (Storage.get('_hero') != null) {
        _Mobs[j].sprite = Storage.get('_hero').sprite;
        _Mobs[j].options = Storage.get('_hero').options;
      }
      console.log('Set _Hero 1')
      global._Hero = _Mobs[j];
    } else {
      for (let id in mp[type]) {
        const i = mp[type][id];
        _Mobs.push(new Enemy(type, i[0], i[1], i[2], i[3], i[4], i[5]));
        _Mobs[j].type = type;
        j++
      }
    }
  }
}

function heroInit() {
  var hero = Storage.get('_hero'),
    j = _Mobs.length,
    mp = _lvl[_level].hero,
    x = mp.x * _tile.param.w,
    y = mp.y * _tile.param.h;
  _Mobs.push(new Person(Map.setting.canvas.dom));
  for (let m in hero) {
    _Mobs[j][m] = hero[m];
    _Mobs[j].options.tool = Storage.get('_inventory').tool;
    _Mobs[j].memory.dump.x = x;
    _Mobs[j].memory.dump.y = y;
    _Mobs[j].memory.x = x;
    _Mobs[j].memory.y = y;
    _Mobs[j].memory.pos = 'bottom';
    _Mobs[j].can.walk = true;
    _Mobs[j].nps = null;
  }
  console.log('Set _Hero 2')
  global._Hero = _Mobs[j];
}

function mobInit(lvl) {
  var mobs = Storage.get(lvl)._mobs,
    j = 0; //счетчик.
  for (var i in mobs) {
    if (mobs[i].type === "hero" || mobs[i].type === "accessibly") continue;
    else _Mobs.push(new Enemy());
    for (var m in mobs[i]) {
      _Mobs[j][m] = mobs[i][m];
      _Mobs[j].path.wait = false; //Убираем флаг ожидания у объекта. Что бы он продолжал перемещения по карте.
      _Mobs[j].path.timer = true;
      _Mobs[j].actFlag = false;
      _Mobs[j].doit = true;
      _Mobs[j].timer = true; //Таймер.
    }
    j++;
  }
}

function mapInit(lvl) {
  _lvl[lvl].map = Storage.get(lvl)._map;
}

function drawMobs(ctx) {
  for (var id in _Mobs) {
    var im = _Mobs[id];
    im.draw(ctx);
  }
}

export function _LevelLoader(lvl) {
  //Загружаем всех персонажей, NPS и противников, которые есть на карте.
  // _Interface = _Interface === undefined ? new Interface() : _Interface;
  Sprite.load(function () { //Загружаем спрайт карты.
    if (Storage.get(_level) == null) {
      createMobs();
    } else {
      mapInit(lvl);
      mobInit(lvl);
      heroInit(lvl);
    }
    Map.tileLoader(() => {
      _gameSet(loop);
    }); //Загружаем тайл карты которые у нас имеются.
  });
} //Функция меняющая уровни..


function loop() {
  const ctx = Map.draw(); //Отрисовка карты.
  drawMobs(ctx); //Прорисовываем мобов.
  Map.overlay(); //Перекрываем персонажа.
  Interface.draw(); //Рисуем диалог.
}


document.addEventListener('DOMContentLoaded', () => {
  _gameStart(() => {
    _LevelLoader(_level);
  });
}, false);
