/**
 * WorldScene — main game scene that replaces BootScene.
 * Central wiring file connecting all TypeScript modules and implementing
 * remaining game logic from js/index.js.
 */

import Phaser from 'phaser';
import storage from '../../js/class/Storage.js';
import MobMicroTask from '../../js/class/MobMicroTask.js';
import code from '../../js/code.js';
import { _Map, setSharedState, setScene as setTileMapScene } from '../systems/TileMap';
import { SpriteLoader } from '../systems/SpriteLoader';
import { initKeyboard, isKeyDown } from '../systems/InputManager';
import { Interface, setInterfaceSharedState } from '../systems/Interface';
import { Enemy, setEnemySharedState } from '../entities/Enemy';
import { _Person, setHeroSharedState } from '../entities/Hero';
import { createMapFacade, createInterfaceFacade } from '../compat';
import {
  createMobs,
  heroInit,
  mobInit,
  mapInit,
  drawMobs,
  setMobManagerState,
  getMobsRef,
  getHeroRef as getMobManagerHeroRef,
} from '../entities/MobManager';

// ---------------------------------------------------------------------------
// Module-level state variables (ported from index.js lines 14-30)
// ---------------------------------------------------------------------------
const _com: Record<string, number> = { top: 3, left: 1, right: 2, bottom: 0 };
let _Hero: any = null;
let _Interface: any = null;
const _Mobs: any[] = [];
let _scene: Phaser.Scene = null as unknown as Phaser.Scene;
let _mapFacade: any = null;
let _interfaceFacade: any = null;

// Boot completion flag — set to true AFTER sprites and tiles finish loading
export let _bootComplete = false;

// ---------------------------------------------------------------------------
// Game loop control (replaces manual RAF; Phaser Scene.update() drives the loop)
// ---------------------------------------------------------------------------
let _running = false;

function _gameSet(callback: () => void): void {
  const str = callback ? callback.toString().replace(/\s/g, '') : '';
  const isEmpty = !callback || str === '()=>{}' || str === 'function(){}';
  _running = !isEmpty;
}

// ---------------------------------------------------------------------------
// Hook system (lines 143-158)
// ---------------------------------------------------------------------------
function addHookAfterLoadMob(hook: string): void {
  if (typeof hook !== 'string') throw new Error('Hook must be a string');
  (storage as any).afterLoadMobHooks = (storage as any).afterLoadMobHooks || [];
  (storage as any).afterLoadMobHooks.push(hook);
}

function runHookAfterLoadMob(): void {
  ((storage as any).afterLoadMobHooks || []).forEach((hook: string) => {
    const microTask = new MobMicroTask(hook);
    microTask.run(code, getContextForMicrotask());
  });
  (storage as any).afterLoadMobHooks = [];
}

// ---------------------------------------------------------------------------
// getContextForMicrotask (lines 710-721)
// ---------------------------------------------------------------------------
function getContextForMicrotask(): any {
  const mob = _Mobs[_Hero.nps];
  // Use Object.create(mob) so prototype methods (movePath etc.) are accessible
  // via the prototype chain when code.js callbacks call `this.movePath(...)`.
  // Plain spread {...mob} only copies own enumerable properties and misses class methods.
  const ctx = mob ? Object.create(mob) : {};
  ctx._Map = _mapFacade;
  ctx._Mobs = _Mobs;
  ctx._Hero = _Hero;
  ctx.Enemy = Enemy;
  ctx._gameSet = _gameSet;
  ctx.Interface = _interfaceFacade;
  ctx.addHookAfterLoadMob = addHookAfterLoadMob;
  return ctx;
}

// ---------------------------------------------------------------------------
// loop function (lines 1512-1517)
// ---------------------------------------------------------------------------
function loop(): void {
  // Kept for backward-compat with getLoop(); actual game loop runs in WorldScene.update()
}

// ---------------------------------------------------------------------------
// gameOver function (lines 1518-1533)
// ---------------------------------------------------------------------------
function gameOver(): void {
  _Hero.can.walk = false;
  _Hero.can.attack = false;
  _gameSet(() => {});
  (storage as any).clearAll();
  _Interface.dialog.set([
    ["3..", 'right', 4, 3, 0],
    ["2.."],
    ["1.."],
    [" - Игра окончена.."],
    ["Ты кто вообще ? "],
    ["ППпппрррррРРРРрррруУУУУУууФФФффффф...."]
  ], function () {
    location.reload();
  });
}

// ---------------------------------------------------------------------------
// Shared state wiring — CRITICAL
// ---------------------------------------------------------------------------
function wireSharedState(): void {
  // Get current hero reference from MobManager (createMobs/heroInit sets it correctly)
  _Hero = getMobManagerHeroRef() || _Hero;

  // Wire TileMap
  setSharedState(_Mobs, _Hero, _gameSet, _LevelLoader, runHookAfterLoadMob);

  // Wire Enemy instances
  setEnemySharedState(_Hero, _Map, _Mobs, _Interface, getContextForMicrotask, _scene);

  // Wire Hero
  setHeroSharedState({
    _Hero, _Map, _Mobs, _Interface, _com,
    isKeyDown, gameOver, getContextForMicrotask,
    scene: _scene,
  });

  // Wire Interface
  setInterfaceSharedState(_Hero, _Map, _Mobs, _Interface, isKeyDown, _scene);

  // Wire MobManager
  setMobManagerState(_Mobs, _Hero, _Person, Enemy, _scene);

  // Create façade adapters AFTER all modules are wired
  _mapFacade = createMapFacade(_Map, () => _Mobs);
  _interfaceFacade = createInterfaceFacade(_Interface);
}

// ---------------------------------------------------------------------------
// _LevelLoader (lines 797-815)
// ---------------------------------------------------------------------------
function _LevelLoader(lvl: number, callback?: () => void): void {
  _Interface = !_Interface ? new (Interface as any)() : _Interface;
  SpriteLoader.load(_scene, function () {
    if ((storage as any)[lvl] === null) {
      createMobs(lvl);
    } else {
      mapInit(lvl);
      mobInit(lvl);
      heroInit(lvl);
    }

    // Wire shared state AFTER mobs are created but BEFORE tileLoader
    wireSharedState();

    _Map.canvasSetting();
    _Map.tileLoader(function() { _gameSet(loop); _bootComplete = true; });

    if (typeof callback === 'function') callback();
  });
}

// ---------------------------------------------------------------------------
// Getters for test-api access
// ---------------------------------------------------------------------------
export function getHeroRef(): any { return _Hero; }
export function getMobsArray(): any[] { return _Mobs; }
export function getInterfaceRef(): any { return _Interface; }
export function getGameSet(): (cb: () => void) => void { return _gameSet; }
export function getLoop(): () => void { return loop; }
export function getComDirections(): Record<string, number> { return _com; }

// ---------------------------------------------------------------------------
// WorldScene
// ---------------------------------------------------------------------------
export class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldScene' });
  }

  preload(): void {
    // Load tilemap JSON for all levels
    for (let i = 0; i <= 3; i++) {
      this.load.tilemapTiledJSON(`level-${i}`, `assets/maps/level-${i}.json`);
    }
    // Load tileset images used by the Tiled maps
    this.load.image('tiles_main',     'img/tiles/main.png');
    this.load.image('tiles_tiled',    'img/tiles/tiled.png');
    this.load.image('tiles_building', 'img/tiles/building.png');
    this.load.image('tiles_plane',    'img/tiles/plane.png');
    // Register all sprite images so textures are ready before create()
    SpriteLoader.register(this);
  }

  create(): void {
    // Install keyboard handlers (DOMContentLoaded equivalent)
    initKeyboard(this);
    _scene = this;

    // Set scene reference for TileMap (Phaser Tilemaps API)
    _Map.setScene(this);

    // First-time setup
    (storage as any).setOnce('_lvl', 0);
    (storage as any).setOnce('_inventory', {
      tool: null,
      itms: { 0: null, 1: null, 2: null, 3: null, 4: null },
    });

    // Wire initial shared state so modules have needed references BEFORE levelSet
    // MobManager needs constructor refs for createMobs/heroInit/mobInit
    setMobManagerState(_Mobs, _Hero, _Person, Enemy, this);
    // TileMap needs _LevelLoader reference for levelSet → _LevelLoader call chain
    setSharedState(_Mobs, _Hero, _gameSet, _LevelLoader, runHookAfterLoadMob);
    // Enemy and Hero need scene BEFORE createMobs()/heroInit() are called
    setEnemySharedState(_Hero, _Map, _Mobs, _Interface, getContextForMicrotask, _scene);
    setHeroSharedState({ scene: _scene });
    setInterfaceSharedState(_Hero, _Map, _Mobs, _Interface, isKeyDown, _scene);
    // Interface needs scene BEFORE constructor is called in _LevelLoader

    // Start the level
    _Map.levelSet((storage as any)._lvl);

    // window.May API (lines 1542-1555)
    // Preserve _test API set by setupTestApi before overwriting
    const savedTest = (window as any).May?._test;
    (window as any).May = () => {};
    if (savedTest) (window as any).May._test = savedTest;
    (window as any).May.stopGame = function () {
      _Hero.can.walk = false;
      _Hero.can.attack = false;
      _gameSet(() => {});
      (storage as any).clearAll();
    };
    (window as any).May.pauseGame = function () {
      _gameSet(() => {});
    };
    (window as any).May.resumeGame = function () {
      _gameSet(loop);
    };
    (window as any).May.levelSet = _Map.levelSet.bind(_Map);

    // Note: __bootReady is NOT set here — _bootComplete is set asynchronously

  }
  update(): void {
    if (!_running) return;
    _Map.draw();
    drawMobs();
    _Map.overlay();
    _Interface.draw();
  }
}
