import { _tile } from '../data/tiles';
import { _lvl } from '../data/levels';
import { _spt } from '../data/sprites';
import storage from '../../js/class/Storage.js';
import MobMicroTask from '../../js/class/MobMicroTask.js';
import code from '../../js/code.js';
import Phaser from 'phaser';

// Module-level shared state — set by game initialization
let _Hero: any = null;
let _Map: any = null;
let _Mobs: any[] = [];
let _com: Record<string, number> = { top: 3, left: 1, right: 2, bottom: 0 };
let _Interface: any = null;
let getContextForMicrotask: () => any = () => ({});
let _scene: Phaser.Scene | null = null;

export function setEnemySharedState(
  hero: any,
  map: any,
  mobs: any[],
  iface: any,
  contextFn: () => any,
  scene?: Phaser.Scene
): void {
  _Hero = hero;
  _Map = map;
  _Mobs = mobs;
  _Interface = iface;
  getContextForMicrotask = contextFn;
  if (scene) _scene = scene;
}

/**
 * Enemy — mob entity with Phaser sprite rendering.
 *
 * Uses composition: contains a Phaser.GameObjects.Sprite instead of extending it.
 */
class EnemySprite {
  // === Internal state (preserved from legacy constructor) ===
  type: string;
  doit: boolean;
  actFlag: boolean;
  sid: any;
  sx: any;
  sy: any;
  cell: { x: any; y: any };
  width: any;
  height: any;
  memory: { x: any; y: any; pos: string };
  frame_data: {
    map: number[];
    msp: number;
    speed: number;
    im: number;
    status: {
      pos: { x: number; y: number };
      w: number;
      h: number;
    };
  };
  path: {
    mem: { x: any; y: any };
    wait: boolean;
    timer: boolean;
    delay: number;
    cell: number;
    step: number;
    arr: any[];
    callback: any;
    count?: number;
  };
  options: {
    life: boolean;
    visibility: boolean;
    name: any;
    code: any;
    type: string;
    face: any;
    max: { health: number };
    speed: number;
    health: number;
    radius: number;
    damage: number;
    [key: string]: any;
  };

  // Logical position — source of truth (decoupled from sprite screen position)
  private _x: number = 0;
  private _y: number = 0;

  // Phaser sprite and health bar GameObjects
  private _sprite: Phaser.GameObjects.Sprite | null = null;
  private _healthBg: Phaser.GameObjects.Rectangle | null = null;
  private _healthFill: Phaser.GameObjects.Rectangle | null = null;

  // Logical x/y — these are the canonical world-space coordinates.
  // draw() reads them and positions the Phaser sprite accordingly.
  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value;
  }

  constructor(type?: any, sid?: any, sx?: any, sy?: any, x?: any, y?: any, option?: any) {
    const scene = _scene!;
    
    if (!scene) {
      throw new Error('Enemy: Scene not initialized');
    }

    // Create sprite using factory method
    this._sprite = scene.add.sprite(0, 0, '__WHITE').setDepth(5).setOrigin(0, 0).setVisible(false);

    this.type = 'enemy';
    this.doit = true;
    this.actFlag = false;
    this.sid = null;
    this.sx = null;
    this.sy = null;
    this.cell = { x: null, y: null };
    this.width = 0;
    this.height = 0;
    this.memory = { x: null, y: null, pos: 'bottom' };
    this.frame_data = {
      map: [0, 1, 2, 1],
      msp: 0,
      speed: 3,
      im: 0,
      status: {
        pos: { x: 3, y: -6 },
        w: 26,
        h: 4,
      },
    };
    this.path = {
      mem: { x: null, y: null },
      wait: false,
      timer: true,
      delay: 10000,
      cell: 0,
      step: 0,
      arr: [],
      callback: null,
    };
    this.options = {
      life: true,
      visibility: true,
      name: null,
      code: null,
      type: 'enemy',
      face: null,
      max: { health: 4 },
      speed: 1,
      health: 4,
      radius: 1,
      damage: 1,
    };

    // Create health bar GameObjects
    this._healthBg = scene.add.rectangle(0, 0, 26, 4, 0x610101).setDepth(15).setOrigin(0, 0).setVisible(false);
    this._healthFill = scene.add.rectangle(0, 0, 24, 2, 0xe11e26).setDepth(16).setOrigin(0, 0).setVisible(false);

    if (arguments.length > 0) this.init(type, sid, sx, sy, x, y, option);
  }

  // Helper methods to proxy Phaser sprite methods
  setTexture(key: string): void {
    this._sprite?.setTexture(key);
  }

  setVisible(visible: boolean): void {
    this._sprite?.setVisible(visible);
  }

  setCrop(x?: number, y?: number, width?: number, height?: number): void {
    this._sprite?.setCrop(x, y, width, height);
  }

  setDisplaySize(width: number, height: number): void {
    this._sprite?.setDisplaySize(width, height);
  }

  setPosition(x: number, y: number): void {
    this._sprite?.setPosition(x, y);
  }

  get texture(): any {
    return this._sprite?.texture ?? { key: '' };
  }

  destroy(): void {
    this._sprite?.destroy();
    this._healthBg?.destroy();
    this._healthFill?.destroy();
    this._sprite = null;
    this._healthBg = null;
    this._healthFill = null;
  }

  getSprite(): Phaser.GameObjects.Sprite | null {
    return this._sprite;
  }

  // Provide `frame` getter/setter that aliases `frame_data` to preserve
  // the exact same external API (`enemy.frame.map`, `enemy.frame.im`, etc.)
  // Phaser.GameObjects.Sprite has a readonly `frame` property (Phaser.Textures.Frame),
  // so we use `frame_data` internally and expose it via the `frame` key using
  // defineProperty in init/constructor.

  actions(): void {
    if (this.actFlag && this.options.code != null) {
      this.actFlag = false;
      _Hero.can.walk = false;
      const microTask = new MobMicroTask(this.options.code);
      microTask.run(code, getContextForMicrotask());
    }
  }

  init(type: any, sid: any, sx: any, sy: any, x: any, y: any, option: any): void {
    this.sid = sid;
    this.type = type;
    this.sx = sx;
    this.sy = sy;
    this.cell.x = x;
    this.cell.y = y;
    this.x = x * (_tile as any).param.w;
    this.y = y * (_tile as any).param.h;
    this.width = (_spt as any)[type].frame.w;
    this.height = (_spt as any)[type].frame.h;
    for (var id in option) {
      this.options[id] = option[id];
    }

    // Update Phaser sprite texture to match this enemy's actual sprite
    const textureKey = `${type}_${sid}`;
    if (_scene && _scene.textures.exists(textureKey)) {
      this.setTexture(textureKey);
    }
  }

  life(): void {
    this.movePath();
    this.actions();
    this.attack();
  }

  attack(): void {
    if (this.type == 'enemy' && _Hero.nps === null) {
      var e = {w: this.width, h: this.height, x: this.x, y: this.y},
        h = {w: (_spt as any).hero.frame.w, h: (_spt as any).hero.frame.h, x: _Hero.memory.x, y: _Hero.memory.y};
      if (_Hero.isCollision(e.x, e.y, e.w, e.h, h.x, h.y, h.w, h.h)) {
        var $this = this;
        if ($this.doit) {
          $this.doit = false;
          _Hero.nps = null;
          _Hero.options.health = _Hero.options.health > 0 ? _Hero.options.health - this.options.damage : 0;

          setTimeout(function () {
            $this.doit = true;
          }, 700);
        }
      }
    }
  }

  findPath(world: any, pathStart: any, pathEnd: any): any[] {
    var abs = Math.abs;
    var max = Math.max;
    var pow = Math.pow;
    var sqrt = Math.sqrt;
    var maxWalkableTileNum = 0;

    var worldWidth = world.length;
    var worldHeight = world[0].length;
    var worldSize = worldWidth * worldHeight;

    var distanceFunction = ManhattanDistance;
    var findNeighbours = function (..._args: any[]) {
    };

    function ManhattanDistance(Point: any, Goal: any) {
      return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
    }

    function Neighbours(x: any, y: any) {
      var N = y - 1,
        S = y + 1,
        E = x + 1,
        W = x - 1,
        myN = N > -1 && canWalkHere(x, N),
        myS = S < worldHeight && canWalkHere(x, S),
        myE = E < worldWidth && canWalkHere(E, y),
        myW = W > -1 && canWalkHere(W, y),
        result: any[] = [];
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

    function canWalkHere(x: any, y: any) {
      var world = (_lvl as any)[(storage as any)._lvl].map,
        bool = false;
      if (world[x] != null && world[x] !== undefined) {
        if (world[x][y] != null && world[x][y] !== undefined) {
          for (var l in world[x][y]) {
            var itm = world[x][y][l];
            if (itm.id == null) continue;
            if (itm.tile == null) continue;
            var tile = (_tile as any)[itm.tile].map[itm.id];
            if (tile.wall === maxWalkableTileNum) {
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

    function Node(Parent: any, Point: any) {
      var newNode = {
        Parent: Parent,
        value: Point.x + (Point.y * worldWidth),
        x: Point.x,
        y: Point.y,
        f: 0,
        g: 0
      };

      return newNode;
    }

    function calculatePath() {
      var mypathStart = Node(null, {x: pathStart[0], y: pathStart[1]});
      var mypathEnd = Node(null, {x: pathEnd[0], y: pathEnd[1]});
      var AStar = new Array(worldSize);
      var Open = [mypathStart];
      var Closed: any[] = [];
      var result: any[] = [];
      var myNeighbours: any;
      var myNode: any;
      var myPath: any;
      var length: any, max: any, min: any, i: any, j: any;
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
  }

  movePath(x?: any, y?: any, callback?: any): void {
    var $this = this,
      path = this.path,
      c = this.cell,
      t = this.type,
      tile = (_tile as any).param;
    if (t !== 'nps') this.getPath();
    if (x !== undefined && y !== undefined) this.getPath(x, y);
    if (this.path.arr.length) {

      if (typeof callback === "function") path.callback = callback;
      if (path.arr.length !== path.cell) {
        var itm = path.arr[path.cell];
        if (path.arr[path.cell + 1] !== undefined) {
          var next = path.arr[path.cell + 1];
          this.x = tile.w * itm[0];
          this.y = tile.h * itm[1];
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
          if (itm[1] != path.mem.y) {
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
        if (tile.w == path.step) {
          path.step = 0;

          path.mem.x = c.x = itm[0];
          path.mem.y = c.y = itm[1];

          path.cell++
        }
      } else {
        path.mem.x = null;
        path.mem.y = null;
        (path as any).count += 1;
        path.arr = [];
        path.cell = 0;
        path.step = 0;

        if (path.callback != null) path.callback();


        if (this.path.timer) {
          var random = _Map.randomInteger(1000, this.path.delay);
          this.path.timer = false;
          setTimeout(function () {
            $this.path.timer = true;
            $this.path.wait = false;
          }, random);
        }
      }
    }
  }

  getPath(b1?: any, b2?: any): void {
    var m = _Map,
      c = this.cell,
      x1: any, y1: any, path: any;

    if ((_lvl as any)[(storage as any)._lvl]['accessibly'] == undefined) {
      var arr = (_lvl as any)[(storage as any)._lvl].map;
      (_lvl as any)[(storage as any)._lvl]['accessibly'] = [];
      for (var x in arr) {
        for (var y in arr[x]) {
          for (var l in arr[x][y]) {
            var i = arr[x][y][l];

            if (i.tile === (_tile as any).defMap || i.id === (_tile as any).default) continue;
            var itm = (_tile as any)[i.tile].map[i.id];

            if (itm.wall === 0) {
              (_lvl as any)[(storage as any)._lvl]['accessibly'].push({x: parseInt(x), y: parseInt(y)});
            }
          }
        }
      }
    }
    if (!this.path.arr.length && !this.path.wait) {
      if (b1 != undefined && b2 != undefined) {
        x1 = b1;
        y1 = b2;
      } else {
        var random = m.randomInteger(0, (_lvl as any)[(storage as any)._lvl]['accessibly'].length - 1),
          point = (_lvl as any)[(storage as any)._lvl]['accessibly'][random];

        x1 = point.x;
        y1 = point.y;
      }
      path = this.findPath((_lvl as any)[(storage as any)._lvl].map, [c.x, c.y], [x1, y1]);
      if (path.length > 0) {

        this.path.wait = true;
        this.path.arr = path;
      }
    }

  }

  draw(): void {
    if (this.options.visibility) {
      const mem = this.memory;
      const sell = (_spt as any)[this.type];
      const c = this.frame_data;
      const map = c.map;
      const arr = sell.map[this.sx][this.sy];

      if (this.x !== mem.x || this.y !== mem.y) {
        c.msp = c.msp <= c.speed ? c.msp += 1 : c.msp = 0;
        if (c.msp === 0) {
          c.im = c.im >= map.length - 1 ? 0 : c.im += 1;
        }
      } else c.im = 1;
      if (this.x || this.y) {
        if (mem.x != this.x) {
          if (mem.x < this.x) mem.pos = 'right';
          if (mem.x > this.x) mem.pos = 'left';
        }
        if (mem.y != this.y) {
          if (mem.y < this.y) mem.pos = 'bottom';
          if (mem.y > this.y) mem.pos = 'top';
        }
      }

      // Calculate the frame region from the spritesheet and render via Phaser Sprite
      // arr.x + this.width * map[c.im] = sourceX (column offset for animation frame)
      // arr.y + this.height * _com[mem.pos] = sourceY (row offset for direction)
      const sourceX = arr.x + this.width * map[c.im];
      const sourceY = arr.y + this.height * _com[mem.pos];

      // Update Phaser Sprite: set texture, crop to correct frame, position
      const textureKey = `${this.type}_${this.sid}`;
      if (this._sprite && this._sprite.texture?.key !== textureKey && _scene && _scene.textures.exists(textureKey)) {
        this._sprite.setTexture(textureKey);
      }

      // Use setCrop to select the correct sprite frame from the spritesheet
      if (this._sprite) {
        this._sprite.setCrop(sourceX, sourceY, this.width, this.height);
        // Position sprite so the cropped frame renders at logical (this._x, this._y).
        // Phaser with origin(0,0) draws the full texture starting at sprite.x/y,
        // but setCrop shifts the visible region — compensate with offset.
        this._sprite.setPosition(this._x - sourceX, this._y - sourceY);
        this._sprite.setVisible(true);
      }

      // Health bar rendering via Phaser GameObjects
      const pst = this.options.health / this.options.max.health;
      const hx = mem.x + c.status.pos.x;
      const hy = mem.y + c.status.pos.y;
      if (pst !== 1 && this._healthBg && this._healthFill) {
        this._healthBg.setPosition(hx, hy).setSize(c.status.w, c.status.h).setVisible(true);
        this._healthFill.setPosition(hx + 1, hy + 1).setSize((c.status.w - 2) * pst, c.status.h - 2).setVisible(true);
      } else if (this._healthBg && this._healthFill) {
        this._healthBg.setVisible(false);
        this._healthFill.setVisible(false);
      }

      mem.x = this.x;
      mem.y = this.y;
    } else {
      // Hide sprite when not visible
      if (this._sprite) this._sprite.setVisible(false);
      if (this._healthBg) this._healthBg.setVisible(false);
      if (this._healthFill) this._healthFill.setVisible(false);
    }
    if (this.options.life) this.life();
  }
}

// Expose `frame` property alias for backward compatibility.
// Phaser.GameObjects.Sprite owns a readonly `frame` (Phaser.Textures.Frame).
// External code (MobManager, test-api) reads `enemy.frame.map`, `enemy.frame.im`, etc.
// We define a non-enumerable property on the prototype so that `enemy.frame`
// returns `enemy.frame_data` while Phaser's internal frame stays untouched.
Object.defineProperty(EnemySprite.prototype, 'frame', {
  get(this: EnemySprite) { return this.frame_data; },
  set(this: EnemySprite, v: any) {
    // When mobInit copies saved state, it may assign `frame` with the saved frame_data object.
    // Accept it into frame_data so the data is preserved.
    if (v && typeof v === 'object' && 'map' in v) {
      this.frame_data = v;
    }
    // Otherwise ignore (Phaser internal frame assignment)
  },
  configurable: true,
  enumerable: false,
});

// Export as `Enemy` constructor function compatible with `new Enemy()` and `new Enemy(type, sid, ...)`
const Enemy = EnemySprite as any;
export { Enemy };
export default Enemy;
