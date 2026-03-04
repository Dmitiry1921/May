import { _tile } from '../data/tiles';
import { _lvl } from '../data/levels';
import { _spt } from '../data/sprites';
import { _itms } from '../data/items';
import storage from '../../js/class/Storage.js';
import { removeTileFromLayers } from '../systems/TileMap';
import MobMicroTask from '../../js/class/MobMicroTask.js';
import code from '../../js/code.js';

// Module-level shared state
let _Hero: any = null;
let _Map: any = null;
let _Mobs: any[] = [];
let _Interface: any = null;
let _com: Record<string, number> = { top: 3, left: 1, right: 2, bottom: 0 };
let isKeyDown: (key: string) => boolean = () => false;
let gameOver: () => void = () => {};
let getContextForMicrotask: () => any = () => ({});
let _scene: Phaser.Scene | null = null;

// Phaser GameObjects for hero rendering (created lazily on first draw)
let _heroSprite: Phaser.GameObjects.Sprite | null = null;
let _statusBgRect: Phaser.GameObjects.Rectangle | null = null;
let _statusFillRect: Phaser.GameObjects.Rectangle | null = null;
let _digBgRect: Phaser.GameObjects.Rectangle | null = null;
let _digFillRect: Phaser.GameObjects.Rectangle | null = null;
let _toolText: Phaser.GameObjects.Text | null = null;
let _toolBgRect: Phaser.GameObjects.Rectangle | null = null;
let _toolSprite: Phaser.GameObjects.Sprite | null = null;

export function setHeroSharedState(state: {
  _Hero?: any;
  _Map?: any;
  _Mobs?: any[];
  _Interface?: any;
  _com?: Record<string, number>;
  isKeyDown?: (key: string) => boolean;
  gameOver?: () => void;
  getContextForMicrotask?: () => any;
  scene?: Phaser.Scene;
}): void {
  if (state._Hero !== undefined) _Hero = state._Hero;
  if (state._Map !== undefined) _Map = state._Map;
  if (state._Mobs !== undefined) _Mobs = state._Mobs;
  if (state._Interface !== undefined) _Interface = state._Interface;
  if (state._com !== undefined) _com = state._com;
  if (state.isKeyDown !== undefined) isKeyDown = state.isKeyDown;
  if (state.gameOver !== undefined) gameOver = state.gameOver;
  if (state.getContextForMicrotask !== undefined) getContextForMicrotask = state.getContextForMicrotask;
  if (state.scene !== undefined) _scene = state.scene;
}

export interface PersonInstance {
  nps: any;
  type: string;
  face: number;
  sprite: { x: number; y: number };
  status: { pos: { x: number; y: number }; w: number; h: number };
  tool: {
    s: Record<number, { name: string; pos: string }>;
    frame: {
      speed: number;
      msp: number;
      im: number;
      map: number[];
      width: number;
      height: number;
      x: number;
      y: number;
    };
    x: number;
    y: number;
  };
  can: { attack: boolean; walk: boolean };
  memory: {
    dump: { x: any; y: any; cell: any };
    x: any;
    y: any;
    pos: string;
    cell: any;
    digger: number;
  };
  options: {
    quest: any;
    digger: number;
    tool: any;
    max: { health: number };
    radios: number;
    speed: number;
    damage: number;
    health: number;
  };
  canTakeIt: () => void;
  setTool: (id: any) => void;
  setQuest: (obj: any) => void;
  questComplete: () => void;
  attack: () => void;
  drawStatus: () => void;
  isCollision: (x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) => boolean;
  collision: (nx: number, ny: number, callback: (x: number, y: number) => void) => void;
  event: () => void;
  life: () => void;
  init: (x: number, y: number) => void;
  drawTool: () => void;
  draw: () => void;
}

export interface PersonConstructor {
  new(): PersonInstance;
  new(x: number, y: number): PersonInstance;
  (this: PersonInstance, x?: number, y?: number): void;
}

/**
 * Ensure the Phaser Sprite and related GameObjects exist for the hero.
 * Created lazily on first draw() when _scene is available.
 */
function ensureHeroSprite(instance: PersonInstance): void {
  if (_heroSprite || !_scene) return;

  // Use the hero texture key registered by SpriteLoader: "hero_0" (face=0) or "hero_1" (face=1)
  const textureKey = `hero_${instance.face}`;
  if (!_scene.textures.exists(textureKey)) return;

  _heroSprite = _scene.add.sprite(0, 0, textureKey).setOrigin(0, 0).setDepth(5);

  // Status bar rectangles (health bar over hero)
  _statusBgRect = _scene.add.rectangle(0, 0, 26, 4, 0x610101).setOrigin(0, 0).setDepth(6).setVisible(false);
  _statusFillRect = _scene.add.rectangle(0, 0, 24, 2, 0xe11e26).setOrigin(0, 0).setDepth(6).setVisible(false);

  // Digging progress bar rectangles
  _digBgRect = _scene.add.rectangle(0, 0, 26, 4, 0x054807).setOrigin(0, 0).setDepth(6).setVisible(false);
  _digFillRect = _scene.add.rectangle(0, 0, 24, 2, 0x2AFF10).setOrigin(0, 0).setDepth(6).setVisible(false);

  // Tool text (shown when no tool equipped and SPACE held)
  _toolText = _scene.add.text(0, 0, '', {
    fontSize: '23px',
    fontFamily: 'Arial',
    color: '#000',
  }).setDepth(6).setVisible(false);

  // Tool action background rectangle (white bg for '...' text)
  _toolBgRect = _scene.add.rectangle(0, 0, 22, 6, 0xffffff).setOrigin(0, 0).setDepth(5.5).setVisible(false);

  // Tool sprite (shown when tool is equipped and SPACE held)
  _toolSprite = _scene.add.sprite(0, 0, textureKey).setOrigin(0, 0).setDepth(6).setVisible(false);
}

const _Person = function (this: PersonInstance, x?: number, y?: number) {
  // Closure variables shared across methods (assigned in draw(), used in drawTool())
  var sell: any, arr: any, c: any, map: any, mem: any, img: any;

  this.nps = null; //id nps с которым я взаимодействую.
  this.type = "hero";
  this.face = 0; //Пол персонажа парень 0 девушка 1. !!!!!(Не проверялось..)!!!!!!!!!
  this.sprite = {
    x: 2, //Положение персонажа на спрайт карте
    y: 0 //Положение персонажа на спрайт карте
  };
  this.status = {
    pos: {
      x: 3,
      y: -6
    }, //положение статуса относительно персонажа.
    w: 26,
    h: 4
  };
  this.tool = {
    s: {
      0: {name: 'Топор', pos: 'top'},
      1: {name: 'Тесак', pos: 'right'},
      2: {name: 'Сабля', pos: 'left'},
      3: {name: 'Мачете', pos: 'bottom'}
    }, //Предметы доступные персонажу.
    frame: {
      speed: 5, //задержка отображение следующего кадра
      msp: 0, //Ячейка памяти задержки отображение следующего кадра
      im: 0, //Кадр с которого начнется воспроизведение.
      map: [0, 1, 2, 1], //Порядок воспроизведения кадров.
      width: 32,
      height: 32,
      x: 5, //Положение топора относительно персонажа
      y: -38 //Положение топора относительно персонажа
    },//Параметры кадров.
    x: 3, //Положение топора на спрайт карте
    y: 1 //Положение топора на спрайт карте
  };
  this.can = {
    attack: false, //Можем ли мы атаковать ?
    walk: true //Флаг говорящий о том что персонаж может перемещаться..
  };
  this.memory = {
    dump: {
      x: null, //точка персонажа на холсте
      y: null, //точка персонажа на холсте
      cell: undefined //точка x, y на карте, где находиться персонаж.
    },
    x: null, //точка персонажа на холсте
    y: null, //точка персонажа на холсте
    pos: 'bottom', //положение в пространстве
    cell: undefined, //точка x, y на карте, где находиться персонаж.
    digger: 0 //счетчик выполнения действия.
  };
  this.options = {
    quest: null, //текущее задание.
    digger: 200, //время пока персонаж добывает что-либо..
    tool: null, //Активный предмет.
    max: {
      health: 5 //Очки жизни
    }, //максимумы.
    radios: 5, //Радиус атаки игрока..
    speed: 2,//скорость
    damage: 1, //Урон, который может нанести персонаж.
    health: 1 //Очки жизни
  }; // Статистика персонажа.

  this.canTakeIt = function () {
    //Проверяем если действие происходит в координате, есть ли там объект который я могу получить ?
    var h: any = {w: (_tile as any).param.w, h: (_tile as any).param.h, x: this.memory.x, y: this.memory.y, s: this.status},//Персонаж.
      dx: number, dy: number, bool = false;
    //Получаем ячейку на которой стоит персонаж сходя из его размеров
    dx = Math.floor((h.x + h.w / 2) / h.w);
    dy = Math.floor((h.y + h.h) / h.h);
    //Смотрим ячейку на которой стоим и проверяем можем ли мы ее взять.
    var cell = (_lvl as any)[(storage as any)._lvl].map[dx][dy], stop = false;
    //Проверяем каждый слой карты на наличие на нем предметов.
    var l: any;
    var itm: any;
    for (l in cell) {
      var cellItem = cell[l];
      for (itm in _itms) {
        var i = (_itms as any)[itm].map;
        if (cellItem.id === i.id && cellItem.tile === i.tile) {
          stop = true;
          bool = true;
          break;
        }
      }
      if (stop) break;
    }
    if (bool) {
      var memRef = this.memory,
        max = this.options,
        ps = memRef.digger / max.digger,
        w = (h.s.w - 2) * ps;
      // Render dig progress bar via Phaser GameObjects
      if (_digBgRect && _digFillRect) {
        _digBgRect.setPosition(h.x + h.s.pos.x, h.y + h.s.pos.y - 5).setSize(h.s.w, h.s.h).setVisible(true);
        _digFillRect.setPosition(h.x + h.s.pos.x + 1, h.y + h.s.pos.y - 4).setSize(w, h.s.h - 2).setVisible(true);
      }
      //предмет найден запускаем таймер для того что бы получить его.
      memRef.digger = memRef.digger + 1 < max.digger ? memRef.digger + 1 : max.digger; //Увеличиваем счетчик.
      if (memRef.digger === max.digger) {
        //удаляем этот элемент с карты
        (_lvl as any)[(storage as any)._lvl].map[dx][dy][l] = {tile: null, id: null};
        removeTileFromLayers(dx, dy, cellItem.tile, cellItem.id);
        _Interface.inventory.add(parseInt(itm), parseInt('1')); //Добавляем 1 элемент в инвентарь игрока.
        //Выкапываем на этом участке карты предмет который нас интересует.
        memRef.digger = 0;//Обнуляем счетчик..
      }
    } else {
      // Hide dig progress bar when not digging
      if (_digBgRect) _digBgRect.setVisible(false);
      if (_digFillRect) _digFillRect.setVisible(false);
    }
  };

  this.setTool = function (id: any) {
    this.options.tool = id;
    (storage as any)._inventory.tool = id; //Записываем..
  };

  this.setQuest = function (obj: any) {
    /**
     * @type {obj} - Объект типа {itm: @id, count,callback: function(){}}
     * функция устанавливаем ивент, для персонажа.
     */
    this.options.quest = obj;
  }; //Устанавливаем тот или другой квест.

  this.questComplete = function () {
    var q = this.options.quest; //квест.
    if (q != null) {
      //определяем что это за квест.
      if (q.itm !== undefined && q.count !== undefined) {
        if (_Interface.inventory.isset(q.itm, q.count)) {
          const microtask = new MobMicroTask(q.callback);
          microtask.run(code, getContextForMicrotask());
          this.options.quest = null;
        }
      } else {
        //Задание убить всех мобов
        if (q.lvl === (storage as any)._lvl && _Map.countEnemy() === 0) {
          //Убиты все враги..
          const microtask = new MobMicroTask(q.callback);
          microtask.run(code, getContextForMicrotask());
          this.options.quest = null;
        }
      }
    }

  };//Проверяем квест на завершение.

  this.attack = function () {
    if (this.options.tool !== null && this.can.attack) {//В руке имеется что-то чем можно бить по башке
      //Проверяем на столкновение в радиусе..
      for (var i = 0; i < _Mobs.length; i++) {
        var mob: any = _Mobs[i];
        if (mob.type != "enemy") continue;
        //И так это враг, получаем его координату. и радиус..
        var enemy = {x: mob.x - (mob.width / 2), y: mob.y - (mob.height / 2), r: mob.options.radius + mob.width};
        var hero = {x: this.memory.x - 16, y: this.memory.y - 16, r: this.options.radios + 32};

        var adx = enemy.x - hero.x;
        var ady = enemy.y - hero.y;
        var distance = Math.sqrt(adx * adx + ady * ady);

        if (distance < enemy.r + hero.r) {
          var $this = this;
          if ($this.can.attack) {
            $this.can.attack = false;
            mob.options.health = mob.options.health - this.options.damage >= 0 ? mob.options.health - this.options.damage : 0;
            if (mob.options.health <= 0) {
              //Убили Моба.
              _Mobs.splice(i, 1);
            }
            //Отнимает чуть-чуть жизней..
            setTimeout(function () {
              $this.can.attack = true; //Разрешаем игроку атаковать снова..
            }, 700);
          }
        }
      }
    }
  }; //Учим персонажа атаковать врагов.

  this.drawStatus = function () {
    var statusMem = this.memory,
      op = this.options,
      st = this.status,
      x: number, y: number, pst: number;
    pst = op.health / op.max.health; //Процент от чиста
    x = statusMem.x + st.pos.x;
    y = statusMem.y + st.pos.y;
    if (pst != 1) {
      // Show health bar via Phaser GameObjects
      if (_statusBgRect && _statusFillRect) {
        _statusBgRect.setPosition(x, y).setSize(st.w, st.h).setVisible(true);
        _statusFillRect.setPosition(x + 1, y + 1).setSize((st.w - 2) * pst, st.h - 2).setVisible(true);
      }
    } else {
      // Hide when full health
      if (_statusBgRect) _statusBgRect.setVisible(false);
      if (_statusFillRect) _statusFillRect.setVisible(false);
    }
    if (pst == 0) gameOver();
  };

  this.isCollision = function (x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2;
  };

  this.collision = function (nx: number, ny: number, callback: (x: number, y: number) => void) {
    var collArr = (_lvl as any)[(storage as any)._lvl].map,
      tile = _tile as any,
      sp = this.options.speed,
      hero = {
        x: nx,
        y: ny,
        w: (_spt as any).hero.frame.w,
        h: (_spt as any).hero.frame.h
      },
      bool = false;
    for (var cx in collArr) {
      for (var cy in collArr[cx]) {
        for (var cl in collArr[cx][cy]) {
          var ci = collArr[cx][cy][cl];
          if (ci.tile == tile.defMap || ci.id == tile.default) continue;
          var citm = tile[ci.tile].map[ci.id];
          if (citm.wall == 0) continue;
          var titm = tile.param;
          if (!this.isCollision((cx as any) * titm.w, (cy as any) * titm.h, titm.w, titm.h, (hero.x + sp), (hero.y + ((hero.h / 4) * 3)), (hero.w - (sp * 2)), hero.h / 4))
            continue;
          else bool = true; //Столкновение !!!!
        }
      }
    }
    //Столкновение с мобоми
    for (var id in _Mobs) {
      var mi: any = _Mobs[id];
      if (mi.type === this.type) continue;
      //Получаем габариты и координаты для проверки столкновения.
      var en = {x: mi.x, y: mi.y, w: mi.width, h: mi.height};

      if (this.isCollision(en.x, en.y, en.w, en.h, hero.x, hero.y, hero.w, hero.h) && mi.options.code != null) {
        if (mi.type !== "enemy") {
          bool = true; //Столкновение с мобом.
        } else this.can.walk = true;

        this.nps = id; //Записываем ID nps.

        mi.actFlag = true;//Вызываем сценарий в случае такого столкновения.
      }
    }
    //Вызываем callback есть он есть
    if (typeof callback == 'function' && !bool) callback(nx, ny);
  };

  this.event = function () {
    var evtMem = this.memory,
      opt = this.options;
    if (this.can.walk) {
      if (isKeyDown('LEFT') || isKeyDown('A')) {
        this.collision(evtMem.x - opt.speed, evtMem.y, function (x: number, y: number) {
          evtMem.x = x;
          evtMem.y = y;
        });
      }
      if (isKeyDown('RIGHT') || isKeyDown('D')) {
        this.collision(evtMem.x + opt.speed, evtMem.y, function (x: number, y: number) {
          evtMem.x = x;
          evtMem.y = y;
        });
      }
      if (isKeyDown('TOP') || isKeyDown('W')) {
        this.collision(evtMem.x, evtMem.y - opt.speed, function (x: number, y: number) {
          evtMem.x = x;
          evtMem.y = y;
        });
      }
      if (isKeyDown('DOWN') || isKeyDown('S')) {
        this.collision(evtMem.x, evtMem.y + opt.speed, function (x: number, y: number) {
          evtMem.x = x;
          evtMem.y = y;
        });
      }
      if (isKeyDown('SPACE')) {
        //Выполняем действие..
        this.canTakeIt();
        this.drawTool();
        this.attack();
      } else {
        this.memory.digger = 0;
        if (_digBgRect) _digBgRect.setVisible(false);
        if (_digFillRect) _digFillRect.setVisible(false);
        if (_toolText) _toolText.setVisible(false);
        if (_toolBgRect) _toolBgRect.setVisible(false);
        if (_toolSprite) _toolSprite.setVisible(false);
      }
    }
  };

  this.life = function () {
    this.event(); //События перемещения персонажа на карте.
    this.drawStatus();
    this.questComplete();

  };

  this.init = function (ix: number, iy: number) {
    var initMem = this.memory;

    initMem.x = ix * (_tile as any).param.w;
    initMem.y = iy * (_tile as any).param.h;

  }; //Инициализируем персонажа.

  this.drawTool = function () {
    var pos = this.options.tool != null ? this.tool.s[this.options.tool].pos : null, text = "",
      f = this.tool.frame,
      tool = (_spt as any).hero.map[this.tool.x][this.tool.y];

    f.msp = f.msp <= f.speed ? f.msp += 1 : f.msp = 0;
    if (f.msp === 0) {
      f.im = f.im >= map.length - 1 ? 0 : f.im += 1;
    }
    if (this.options.tool != null) {
      if (_toolSprite && _scene && img) {
        var srcX = tool.x + c.w * map[f.im];
        var srcY = tool.y + c.h * _com[pos!];
        _toolSprite.setTexture(`hero_${this.face}`);
        _toolSprite.setCrop(srcX, srcY, c.w, c.h);
        _toolSprite.setPosition(mem.x + f.x - srcX, mem.y + f.y - srcY);
        _toolSprite.setVisible(true);
      }
      if (_toolText) _toolText.setVisible(false);
      if (_toolBgRect) _toolBgRect.setVisible(false);
    } else {
      if (_toolSprite) _toolSprite.setVisible(false);
      if (f.im > 0) text = "";
      if (f.im > 1) text = "..";
      if (f.im > 2) text = "...";
      var tdx: number, tdy: number;
      tdx = mem.x + f.x - 0.5;
      tdy = mem.y + f.y / 2 + 1;
      if (_toolBgRect) {
        _toolBgRect.setPosition(tdx + 1, tdy + 2).setSize(22, 6).setVisible(true);
      }
      if (_toolText && _scene) {
        _toolText.setText(text).setPosition(tdx + 2, tdy - 12).setOrigin(0, 0).setVisible(true);
      }
    }
  };

  this.draw = function () {
    mem = this.memory; //Память персонажа
    sell = (_spt as any).hero; //Спрайт персонажа
    arr = (_spt as any).hero.map[this.sprite.x][this.sprite.y];//Массив спрайт карты.
    c = (_spt as any).hero.frame; //параметры кадра
    map = c.frameMap;
    img = sell.dom[this.face]; //Изображение персонажа в объекте спрайта

    // Ensure Phaser GameObjects are created
    ensureHeroSprite(this);

    if (mem.x !== mem.dump.x || mem.y !== mem.dump.y) {
      c.msp = c.msp <= c.speed ? c.msp += 1 : c.msp = 0;
      if (c.msp === 0) {
        c.im = c.im >= map.length - 1 ? 0 : c.im += 1;
      }
    } else c.im = 1;
    if (mem.x || mem.y) {
      if (mem.dump.x !== mem.x) {
        if (mem.dump.x < mem.x) mem.pos = 'right';
        if (mem.dump.x > mem.x) mem.pos = 'left';
      }
      if (mem.dump.y !== mem.y) {
        if (mem.dump.y < mem.y) mem.pos = 'bottom';
        if (mem.dump.y > mem.y) mem.pos = 'top';
      }
    }

    // Update Phaser Sprite position and texture frame via setCrop
    if (_heroSprite && img && c.w && c.h) {
      const srcX = arr.x + c.w * map[c.im];
      const srcY = arr.y + c.h * _com[mem.pos];
      _heroSprite.setTexture(`hero_${this.face}`);
      _heroSprite.setCrop(srcX, srcY, c.w, c.h);
      // With origin(0,0), Phaser offsets the draw position by (crop.x, crop.y).
      // Compensate so the visible frame appears at mem.x, mem.y.
      _heroSprite.setPosition(mem.x - srcX, mem.y - srcY);

    }

    mem.dump.x = mem.x;
    mem.dump.y = mem.y;
    this.life();
  }; //рисуем персонажа в координатах.

  //Вызываем конструктор если заданы значения.
  if (arguments.length > 0) this.init(x!, y!);
} as unknown as PersonConstructor;

export function getToolObjects() {
  return { toolBgRect: _toolBgRect, toolText: _toolText };
}

export { _Person };
