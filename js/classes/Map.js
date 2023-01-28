import Storage from "./Storage.js";
import {_gameSet} from "../lib/engine.js";
import {_LevelLoader} from "../game.js";


import global from '../config/global.js'
import _lvl from '../config/lvl.js'

let _Mobs = global._Mobs;
let _level = global._level;

export default new class Map {
  constructor() {
    this.setting = {
      map: {
        count: {
          x: 40,
          y: 22
        } //Размеры карты.
      },
      tile: {
        count: 0 //Количество тайлов в массиве.
      }, //Параметры тайлов
      canvas: {
        dom: null //Наш канвас.
      },
      elem: {
        canvasID: "myCanvas"
      },
      flag: {
        start: true
      },
      overlay: [] //Массив с перекрытиями
    };
    this.canvasSetting(); //
  }

  //Функция рисования поверх персонажа.
  overlay() {
    for (let i in this.setting.overlay) {
      const [image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = this.setting.overlay[i];
      this.setting.canvas.dom.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
  }

  //Функция загружает тайл карты.
  tileLoader(callback) {
    var flag = this.setting.flag,
      tile = this.setting.tile;
    if (flag.start) {
      flag.start = false;
      for (var id in _tile) {
        if (id !== "defMap" && id !== "default" && id !== "param") {
          var i = _tile[id];
          i.dom = document.createElement("img");
          i.dom.src = i.url;
          tile.count += 1;
        }
      }
    }
    var j = 0; //счетчик загруженных картинок.
    for (let id in _tile) {
      if (id !== "defMap" && id !== "default" && id !== "param") {
        //проверяем загрузилась ли картинка
        j = _tile[id].dom.src !== "" ? j += 1 : j;
        if (j === tile.count) {
          if (typeof callback == "function") callback();
        }
      }
    }
  }

  canvasSetting() {
    this.setting.canvas.dom = document.getElementById(this.setting.elem.canvasID).getContext('2d');
    console.log('Dom..');
  }

  randomInteger(min, max) {
    var rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
  }

  draw() {
    var map = _lvl[_level].map, //Игровая карта
      cns = this.setting.canvas.dom,
      tile = _tile;

    //TODO точно можно оптимизировать и перенести за функцию рисования выделить в отдельный таймер например раз в 1 сек.
    this.saveStat(); //Сохраняем пользовательские данные и уровень в целом.
    this.setting.overlay = []; //Записываем данные для отрисовки поверх персонажа.

    for (var x in map) {
      for (var y in map[x]) {
        for (var l in map[x][y]) {
          var j = map[x][y][l],
            dx = x * tile.param.w,
            dy = y * tile.param.h,
            itm, id, ti;
          if (j !== undefined) {
            id = j.id;
            ti = j.tile;
            if (ti !== tile.defMap && ti !== undefined) {
              itm = tile[ti].map[id];
              if (id !== tile.default && itm !== undefined) {
                if (itm.overlay === 1) {
                  this.setting.overlay.push([tile[ti].dom, itm.x, itm.y, tile.param.w, tile.param.h, dx, dy, tile.param.w, tile.param.h]);
                } else cns.drawImage(tile[ti].dom, itm.x, itm.y, tile.param.w, tile.param.h, dx, dy, tile.param.w, tile.param.h);
              }
            }
          }
        }
      }
    }

    return this.setting.canvas.dom;
  }

  saveStat() {
    //Сохраняем состояние уровня каждый раз когда вызвана функция.
    Storage.save(); //Сохраняем весь уровень.
  }

  searchNPS(value) {
    //выполняем поиск поик НПС по его имени
    return _Mobs.filter(({type}) => type !== 'npc').find(({options}) => options.name === value);
    // for(var i in _Mobs){
    //   var mob = _Mobs[i];
    //   if(mob.type !== "nps") continue;
    //   if(mob.options.name === name) break;
    // }
    // return mob;
  }

  levelSet(lvl) {
    _gameSet(function () {}); //останавливаем игровой процесс
    _level = lvl;
    Storage.set('_lvl', lvl);
    //Очищаем массив с мобами..
    _Mobs.length = 0;
    _LevelLoader(lvl);
  }

  countEnemy() {
    let j = 0;
    for (let id in _Mobs) {
      const mob = _Mobs[id];
      if (mob.type !== 'enemy') continue;
      j++
    }
    return j;
  }
};
