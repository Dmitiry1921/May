import Map from "./Map.js";
import Storage from "./Storage.js";

import _lvl from "../config/lvl.js";
import sprite from "../config/sprite.js";
import {_com} from "../config/main.js";
import global from "../config/global.js";
import code from "../config/code.js";

let _level = Storage.get('_lvl');

export default class Enemy {
  /**
   * @param x - клетка по оси X
   * @param y - клетка по оси Y
   * @param sy - координата на страйн карте Y
   * @param sx - координата на страйн карте X
   * @param sid - !!!!СПРАЙТ ID в зависимости от этого спрайта у нас и будет противник.
   * @param type - enemy || nps || animal
   * @param option - enemy || nps || animal
   */
  constructor(type, sid, sx, sy, x, y, option) {
    this.type = 'enemy'; //Тип спрайта
    this.doit = true; //Флаг какого либо действия персонажа.
    this.actFlag = false; //Флаг говорящий о том действие будет выполняться..
    this.sid = null; //Спрайт id присваеваеться при создании персонажа.
    this.sx = null; //Координата на страйт карте.
    this.sy = null; //Координата на страйт карте.
    this.cell = {
      x: null,
      y: null
    }; //Координата на карте.
    this.x = null;  //Координата в игровом пространстве.
    this.y = null; //Координата в игровом пространстве.
    this.width = null; //Габариты персонажа.
    this.height = null; //Габариты персонажа.
    this.memory = {
      x: null,
      y: null,
      pos: 'bottom'
    };//Память противника.
    this.frame = {
      map: [0, 1, 2, 1],//Показывать кадры в порядке.
      msp: 0,//Счетчик задержки
      speed: 3,//Задержка показа кадров.
      im: 0, //Кадр отображаемый в текущий момент.
      status: {
        pos: {
          x: 3,
          y: -6
        }, //положение статуса относильно персонажа.
        w: 26,
        h: 4
      } //кол-во жизней персонажа
    }; //Параметры кадров.
    this.path = {
      mem: {
        x: null,
        y: null
      }, //Храним тут координату предыдущей клетки.
      wait: false, //Ожидание.
      timer: true, //Доступность таймера.
      delay: 10000, //Максимальное время остановки персонажа на одном месте.
      cell: 0, //яЯчейка на маршруте.
      step: 0, //текущий шаг на этой ячейке.
      arr: [], //Путь по которому будет двигаться персонаж.
      callback: null //Эту функция персонаж выполнить после того как дошел до места.
    }; //Точка куда персонаж идет в этот момент.
    this.options = {
      life: true, //Этот персонаж обрабатываем события связаные с ним Да\Нет
      visibility: true, //Рисовать персонажа на карте или нет..
      name: null, //Имя персонажа.
      code: null,
      type: 'enemy', //определяем тип в замисимости от типа. персонаж ведет себя по разному.
      face: null, //Аватарка персонажа если это например NPS
      max: {
        health: 4 //Очки жизни
      }, //макмимумы.
      speed: 1,//скорость
      health: 4, //Очки жизни
      radius: 1, //Радиус.
      damage: 1 //Урок по игрку..
    };

    if(arguments.length > 0) {
      this.sid = sid;
      this.type = type;
      this.sx = sx;
      this.sy = sy;
      this.cell.x = x;
      this.cell.y = y;
      this.x = x * _tile.param.w;
      this.y = y * _tile.param.h;
      this.width = sprite[type].frame.w;
      this.height = sprite[type].frame.h;
      for (let id in option) {
        this.options[id] = option[id];
      }
    }
  }

  actions() {
    if (this.actFlag && this.options.code != null) {
      global._Hero.can.walk = false;
      if(typeof this.options.code === 'function') {
        this.options.code.apply(code);
        return;
      }
      console.log(this.options.code)
      throw new Error('CODE_IS_TEXT');
    }
  }; //Выполняем заданное действие.
  init(type, sid, sx, sy, x, y, option) {

  };
  life() {
    this.movePath(); //Перемещение перса.
    this.actions(); //Запрограмирование действие.
    this.attack(); //Нападаем на игрока если наш персонаж типа enemy
  };
  attack() {
    if (this.type === 'enemy' && global._Hero.nps === null) { //Если персонаж не взаимодействует с НПС тогда может его атаковать.
      const e = {w: this.width, h: this.height, x: this.x, y: this.y}, //enemy
        h = {w: sprite.hero.frame.w, h: sprite.hero.frame.h, x: global._Hero.memory.x, y: global._Hero.memory.y}; //hero
      //Проверяем столкнулся ли я с игроком
      if (global._Hero.isCollision(e.x, e.y, e.w, e.h, h.x, h.y, h.w, h.h)) {
        const $this = this;
        //Наносим игроку какое-то кол-во урона.
        if ($this.doit) {
          this.doit = false;
          global._Hero.nps = null;
          global._Hero.options.health = global._Hero.options.health > 0 ? global._Hero.options.health - this.options.damage : 0;

          setTimeout(() => {
            this.doit = true;
          }, 700);
        }

      }
    }
  };
  findPath(world, pathStart, pathEnd) {
    // A* Pathfinding for HTML5 Canvas Tutorial
    // by Christer (McFunkypants) Kaitila
    // http://www.mcfunkypants.com
    // http://twitter.com/McFunkypants
    // Based on Edsger Dijkstra's 1959 algorithm and work by:
    // Andrea Giammarchi, Alessandro Crugnola, Jeroen Beckers,
    // Peter Hart, Nils Nilsson, Bertram Raphael
    // Permission is granted to use this source in any
    // way you like, commercial or otherwise. Enjoy!
    // world is a 2d array of integers (eg world[10][15] = 0)
    // pathStart and pathEnd are arrays like [5,10]
    // Эта функция взята мной из интернета и не много изменена. Права на нее я не заявляю она являеться доступной всем на сайте: http://www.websketches.ru/blog/algoritm-poiska-pitu-v-brauzernih-igrax
    var abs = Math.abs;
    var max = Math.max;
    var pow = Math.pow;
    var sqrt = Math.sqrt;
    var maxWalkableTileNum = 0; //Значение wall проходимости на карте.

    var worldWidth = world.length;
    var worldHeight = world[0].length;
    var worldSize = worldWidth * worldHeight;

    var distanceFunction = ManhattanDistance;
    var findNeighbours = function () {
    }; // empty

    function ManhattanDistance(Point, Goal) {
      return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
    }

    function Neighbours(x, y) {
      var N = y - 1,
        S = y + 1,
        E = x + 1,
        W = x - 1,
        myN = N > -1 && canWalkHere(x, N),
        myS = S < worldHeight && canWalkHere(x, S),
        myE = E < worldWidth && canWalkHere(E, y),
        myW = W > -1 && canWalkHere(W, y),
        result = [];
      if (myN)
        result.push({x: x, y: N});
      if (myE)
        result.push({x: E, y: y});
      if (myS)
        result.push({x: x, y: S});
      if (myW)
        result.push({x: W, y: y});
      findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
      return result;
    }

    function canWalkHere(x, y) {
      var world = _lvl[_level].map,
        bool = false;
      if (world[x] != null && world[x] !== undefined) {
        if (world[x][y] != null && world[x][y] !== undefined) {
          for (var l in world[x][y]) {
            var itm = world[x][y][l];
            if (itm.id == null) continue;
            if (itm.tile == null) continue;
            var tile = _tile[itm.tile].map[itm.id];
            if (tile.wall === maxWalkableTileNum) {
              //Столкновение.
              bool = true;
            } else {
              bool = false;
              break;
            }
          }
        }
      }
      return bool;
    }

    function Node(Parent, Point) {
      return {
        Parent,
        value: Point.x + (Point.y * worldWidth),
        x: Point.x,
        y: Point.y,
        f: 0,
        g: 0
      };
    }

    function calculatePath() {
      var mypathStart = Node(null, {x: pathStart[0], y: pathStart[1]});
      var mypathEnd = Node(null, {x: pathEnd[0], y: pathEnd[1]});
      var AStar = new Array(worldSize);
      var Open = [mypathStart];
      var Closed = [];
      var result = [];
      var myNeighbours;
      var myNode;
      var myPath;
      var length, max, min, i, j;
      while (length = Open.length) {
        max = worldSize;
        min = -1;
        for (i = 0; i < length; i++) {
          if (Open[i].f < max) {
            max = Open[i].f;
            min = i;
          }
        }
        myNode = Open.splice(min, 1)[0];

        if (myNode.value === mypathEnd.value) {
          myPath = Closed[Closed.push(myNode) - 1];
          do {
            result.push([myPath.x, myPath.y]);
          }
          while (myPath = myPath.Parent);
          AStar = Closed = Open = [];
          result.reverse();
        } else {
          myNeighbours = Neighbours(myNode.x, myNode.y);
          for (i = 0, j = myNeighbours.length; i < j; i++) {
            myPath = Node(myNode, myNeighbours[i]);
            if (!AStar[myPath.value]) {
              myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
              myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
              Open.push(myPath);
              AStar[myPath.value] = true;
            }
          }
          Closed.push(myNode);
        }
      }
      return result;
    }

    return calculatePath();
  };
  movePath(x, y, callback) {
    var $this = this,
      path = this.path,
      c = this.cell,
      t = this.type,
      tile = _tile.param;
    if (t !== 'nps') this.getPath();
    if (x !== undefined && y !== undefined) this.getPath(x, y);
    if (this.path.arr.length) {//Путь найден, Проходим его..

      if (typeof callback == "function") path.callback = callback; //Запоминаем функцию которую нужно выполнить по прохождению пути
      if (path.arr.length !== path.cell) {
        var itm = path.arr[path.cell];
        if (path.arr[path.cell + 1] !== undefined) {
          var next = path.arr[path.cell + 1];
          //---------------------
          this.x = tile.w * itm[0];
          this.y = tile.h * itm[1];
          //---------------------
          if (itm[0] !== path.mem.x) {
            if (itm[0] < next[0]) {
              if (path.mem.x < itm[0] && path.mem.x != null) {
                this.x += path.step;
              }
            } else if (itm[1] < next[1]) this.y += path.step;
            if (itm[0] > next[0]) {
              if (path.mem.x > itm[0] && path.mem.x != null) {
                this.x -= path.step;
              }
            } else if (itm[1] > next[1]) this.y -= path.step;
          }
          if (itm[1] !== path.mem.y) {
            if (itm[1] < next[1]) {
              if (path.mem.y < itm[1] && path.mem.x != null) {
                this.y += path.step;
              }
            } else if (itm[0] < next[0]) this.x += path.step;
            if (itm[1] > next[1]) {
              if (path.mem.y > itm[1] && path.mem.x != null) {
                this.y -= path.step;
              }
            } else if (itm[0] > next[0]) this.x -= path.step;
          }
        }
        path.step++;
        if (tile.w === path.step) {
          path.step = 0;

          path.mem.x = c.x = itm[0];
          path.mem.y = c.y = itm[1];

          path.cell++
        }
        //---------------------
      } else {
        //Путь пройден.
        path.mem.x = null;
        path.mem.y = null;
        path.count += 1;
        path.arr = [];
        path.cell = 0;
        path.step = 0;

        if (path.callback != null) path.callback();


        if (this.path.timer) {
          var random = Map.randomInteger(1000, this.path.delay);
          this.path.timer = false;
          setTimeout(function () {
            $this.path.timer = true;
            $this.path.wait = false;
          }, random);
        }
      }
    }
  };
  getPath(b1, b2) {
    var m = Map,
      c = this.cell,
      x1, y1, path;

    if (_lvl[_level]['accessibly'] === undefined) {
      var arr = _lvl[_level].map;
      _lvl[_level]['accessibly'] = []; //Создаем массив.
      for (let x in arr) {
        for (let y in arr[x]) {
          for (let l in arr[x][y]) {
            var i = arr[x][y][l];

            if (i.tile === _tile.defMap || i.id === _tile.default) continue;
            var itm = _tile[i.tile].map[i.id];

            if (itm.wall === 0) {
              _lvl[_level]['accessibly'].push({x: parseInt(x), y: parseInt(y)});
            } //Это стена

          }
        }
      }
    }
    if (!this.path.arr.length && !this.path.wait) {
      //генерируем случайные клетки по x,y b Проверяем доступность маршрута.
      if (b1 !== undefined && b2 !== undefined) {
        x1 = b1;
        y1 = b2;
      } else {
        var random = m.randomInteger(0, _lvl[_level]['accessibly'].length - 1),
          point = _lvl[_level]['accessibly'][random];

        x1 = point.x;
        y1 = point.y;
      }
      path = this.findPath(_lvl[_level].map, [c.x, c.y], [x1, y1]);
      //Путь туда доступен?
      if (path.length > 0) {

        this.path.wait = true;
        this.path.arr = path;
      }
    }

  };
  draw(ctx) {
    if (this.options.visibility) {
      const arr = sprite[this.type].map[this.sx][this.sy];
      const img = sprite[this.type].dom[this.sid];

      if (this.x !== this.memory.x || this.y !== this.memory.y) {
        this.frame.msp = this.frame.msp <= this.frame.speed ? this.frame.msp += 1 : this.frame.msp = 0;
        if (this.frame.msp === 0) {
          this.frame.im = this.frame.im >= this.frame.map.length - 1 ? 0 : this.frame.im += 1;
        }
      } else this.frame.im = 1;
      if (this.x || this.y) {
        if (this.memory.x !== this.x) {
          if (this.memory.x < this.x) this.memory.pos = 'right';
          if (this.memory.x > this.x) this.memory.pos = 'left';
        }
        if (this.memory.y !== this.y) {
          if (this.memory.y < this.y) this.memory.pos = 'bottom';
          if (this.memory.y > this.y) this.memory.pos = 'top';
        }
      }

      ctx.drawImage(img, arr.x + this.width * this.frame.map[this.frame.im], arr.y + this.height * _com[this.memory.pos], this.width, this.height, this.x, this.y, this.width, this.height);
      //Рисуем полоску жизней у персонажа.
      const pst = this.options.health / this.options.max.health; //Процент от чиста
      ctx.fillStyle = '#610101';
      const x = this.memory.x + this.frame.status.pos.x;
      const y = this.memory.y + this.frame.status.pos.y;
      if (pst !== 1) {
        ctx.fillRect(x, y, this.frame.status.w, this.frame.status.h);
        ctx.fillStyle = '#e11e26';
        ctx.fillRect(x + 1, y + 1, (this.frame.status.w - 2) * pst, this.frame.status.h - 2);
      }//Скрываем показатель жизней если он равен 100%
      this.memory.x = this.x;
      this.memory.y = this.y;
      //----------------------------
    }
    if (this.options.life) this.life();
  };
}
