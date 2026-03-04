/**
 * MobManager — mob lifecycle management.
 * _Mobs array is the source of truth; draw() drives rendering each frame.
 */

import { _tile } from '../data/tiles';
import { _lvl } from '../data/levels';
import storage from '../../js/class/Storage.js';

let _Mobs: any[] = [];
let _Hero: any = null;
let _Person: any = null;
let Enemy: any = null;
let _scene: Phaser.Scene | null = null;

export function setMobManagerState(
  mobs: any[],
  heroRef: any,
  personCtor: any,
  enemyCtor: any,
  scene?: Phaser.Scene
): void {
  _Mobs = mobs;
  _Hero = heroRef;
  _Person = personCtor;
  Enemy = enemyCtor;
  if (scene) _scene = scene;
}

export function setHeroRef(hero: any): void {
  _Hero = hero;
}

export function getHeroRef(): any {
  return _Hero;
}

export function getMobsRef(): any[] {
  return _Mobs;
}

export function createMobs(level: number): void {
  let j = 0;
  const mp = (_lvl as any)[level];
  Object.keys(mp).forEach((type) => {
    if (type === "map") return;
    if (type === "hero") {
      _Mobs.push(new _Person(mp[type].x, mp[type].y));
      if ((storage as any)._hero !== null) {
        _Mobs[j].sprite = (storage as any)._hero.sprite;
        _Mobs[j].options = (storage as any)._hero.options;
      }
      _Hero = _Mobs[j];
      j++;
    } else {
      Object.values(mp[type]).forEach((i: any) => {
        _Mobs.push(new Enemy(type, i[0], i[1], i[2], i[3], i[4], i[5]));
        _Mobs[j].type = type;
        _Mobs[j].doit = false;
        const capturedMob = _Mobs[j];
        setTimeout(function() { capturedMob.doit = true; }, 700);
        j++;
      });
    }
  });
}

export function heroInit(level: number): void {
  const mp = (_lvl as any)[level].hero;
  const spawnX = mp.x * (_tile as any).param.w;
  const spawnY = mp.y * (_tile as any).param.h;
  _Hero = new _Person();

  for (var m in (storage as any)._hero) {
    _Hero[m] = (storage as any)._hero[m];
  }
  _Hero.memory.dump = {};
  _Hero.options.tool = (storage as any)._inventory.tool;
  _Hero.memory.dump.x = spawnX;
  _Hero.memory.dump.y = spawnY;
  _Hero.memory.x = spawnX;
  _Hero.memory.y = spawnY;
  _Hero.memory.pos = 'bottom';
  _Hero.can.walk = true;
  _Hero.nps = null;
  _Mobs.push(_Hero);
}

export function mobInit(lvl: number): void {
  (storage as any)[lvl]._mobs.forEach((item: any) => {
    if (["hero", "accessibly"].includes(item.type)) return;
    const mob = new Enemy();

    const SKIP_KEYS = new Set(['_sprite', '_healthBg', '_healthFill', '_x', '_y']);
    Object.keys(item).forEach((key) => {
      if (SKIP_KEYS.has(key)) return;
      mob[key] = item[key];
    });
    // Restore logical position via setters (item._x may be 0/stale from serialisation)
    mob.x = mob.cell.x * (_tile as any).param.w;
    mob.y = mob.cell.y * (_tile as any).param.h;
    mob.memory.x = mob.x;
    mob.memory.y = mob.y;

    mob.path.wait = false;
    mob.path.timer = true;
    mob.actFlag = false;
    mob.doit = false;
    mob.timer = true;
    setTimeout(function() { mob.doit = true; }, 700);
    _Mobs.push(mob);
  });
}

export function mapInit(lvl: number): void {
  (_lvl as any)[lvl].map = (storage as any)[lvl]._map;
}

export function drawMobs(): void {
  for (var id in _Mobs) {
    var im = _Mobs[id];
    im.draw();
  }
}

export function getMobGroup(): null {
  return null;
}
