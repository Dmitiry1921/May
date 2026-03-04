/**
 * TileMap — Phaser Tilemaps API implementation
 * Replaces legacy canvas-based _Map object from js/index.js lines 163-283.
 *
 * Uses Phaser.Tilemaps to create and manage tile layers from Tiled JSON.
 * Rendering is handled automatically by Phaser — draw() and overlay() are no-ops.
 */

import { _lvl } from '../data/levels';
import storage from '../../js/class/Storage.js';
import { _tile } from '../data/tiles';

// Module-level state references — set by game initialization
let _Mobs: any[] = [];
let _Hero: any = null;
let _gameSet: (cb: () => void) => void = () => {};
let _LevelLoader: (lvl: number, cb?: () => void) => void = () => {};
let runHookAfterLoadMob: () => void = () => {};

export function setSharedState(
  mobs: any[],
  hero: any,
  gameSet: typeof _gameSet,
  levelLoader: typeof _LevelLoader,
  hookRunner: typeof runHookAfterLoadMob
): void {
  _Mobs = mobs;
  _Hero = hero;
  _gameSet = gameSet;
  _LevelLoader = levelLoader;
  runHookAfterLoadMob = hookRunner;
}

// Phaser scene reference — set via setScene()
let _scene: Phaser.Scene | null = null;

// Active tilemap layers — destroyed on level change
let _tilemap: Phaser.Tilemaps.Tilemap | null = null;
let _groundLayer: Phaser.Tilemaps.TilemapLayer | null = null;
let _decorationLayer: Phaser.Tilemaps.TilemapLayer | null = null;
let _collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null;
let _overlayLayer: Phaser.Tilemaps.TilemapLayer | null = null;

/**
 * Set the Phaser scene reference. Called from WorldScene.create().
 */
export function setScene(scene: Phaser.Scene): void {
  _scene = scene;
}

/**
 * Destroy existing tilemap layers (called before loading a new level).
 */
function destroyLayers(): void {
  [_groundLayer, _decorationLayer, _collisionLayer, _overlayLayer].forEach(l => l?.destroy());
  _groundLayer = null;
  _decorationLayer = null;
  _collisionLayer = null;
  _overlayLayer = null;
  if (_tilemap) {
    _tilemap.destroy();
    _tilemap = null;
  }
}

/**
 * Create tilemap layers for the given level using Phaser Tilemaps API.
 */
function createTilemap(lvl: number): void {
  if (!_scene) return;

  destroyLayers();

  const mapKey = `level-${lvl}`;

  // Check if the tilemap JSON is loaded in Phaser cache
  if (!_scene.cache.tilemap.has(mapKey)) return;

  _tilemap = _scene.make.tilemap({ key: mapKey });

  // Add all 4 spritesheet tilesets matching Tiled JSON tileset names
  const tilesetMain     = _tilemap.addTilesetImage('tiles_main',     'tiles_main');
  const tilesetTiled    = _tilemap.addTilesetImage('tiles_tiled',    'tiles_tiled');
  const tilesetBuilding = _tilemap.addTilesetImage('tiles_building', 'tiles_building');
  const tilesetPlane    = _tilemap.addTilesetImage('tiles_plane',    'tiles_plane');

  const tilesets = [tilesetMain, tilesetTiled, tilesetBuilding, tilesetPlane].filter(Boolean) as Phaser.Tilemaps.Tileset[];
  if (tilesets.length === 0) return;

  // Create layers from Tiled JSON layer names — wrapped in try/catch as layers may not exist in all levels
  try { _groundLayer     = _tilemap.createLayer('ground',     tilesets, 0, 0); } catch(_e) { _groundLayer = null; }
  try { _decorationLayer = _tilemap.createLayer('decoration', tilesets, 0, 0); } catch(_e) { _decorationLayer = null; }
  try { _collisionLayer  = _tilemap.createLayer('collision',  tilesets, 0, 0); } catch(_e) { _collisionLayer = null; }
  try { _overlayLayer    = _tilemap.createLayer('overlay',    tilesets, 0, 0); } catch(_e) { _overlayLayer = null; }

  // Set collision on collision layer tiles (any non-zero tile collides)
  if (_collisionLayer) {
    _collisionLayer.setCollisionByExclusion([-1, 0]);
  }

  // Move tiles with overlay:1 (from original _tile data) into the overlay layer
  redistributeOverlayTiles();

  // Overlay layer renders above sprites (depth 10 > sprite depth 5)
  if (_overlayLayer) {
    _overlayLayer.setDepth(10);
  }
}

// Map original _tile IDs to Tiled tileset names
const TILE_TO_TILESET: Record<number, string> = {
  1: 'tiles_main',
  2: 'tiles_tiled',
  3: 'tiles_building',
  11: 'tiles_plane'
};

function redistributeOverlayTiles(): void {
  if (!_tilemap || !_overlayLayer) return;

  const overlayGids = new Set<number>();
  for (const [tileIdStr, tilesetName] of Object.entries(TILE_TO_TILESET)) {
    const tileData = (_tile as any)[Number(tileIdStr)];
    if (!tileData?.map) continue;
    const tileset = _tilemap.tilesets.find(ts => ts.name === tilesetName);
    if (!tileset) continue;
    const firstgid = tileset.firstgid;
    tileData.map.forEach((item: any, index: number) => {
      if (item?.overlay === 1) overlayGids.add(firstgid + index);
    });
  }
  if (overlayGids.size === 0) return;

  const sourceLayers = [_groundLayer, _decorationLayer, _collisionLayer].filter(Boolean) as Phaser.Tilemaps.TilemapLayer[];
  const width = _tilemap.width;
  const height = _tilemap.height;
  for (const layer of sourceLayers) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = layer.getTileAt(x, y);
        if (tile && overlayGids.has(tile.index)) {
          _overlayLayer!.putTileAt(tile.index, x, y);
          layer.removeTileAt(x, y);
        }
      }
    }
  }
}

export function removeTileFromLayers(cellX: number, cellY: number, tilesetId?: number, tileId?: number): void {
  const layers = [_groundLayer, _decorationLayer, _collisionLayer, _overlayLayer].filter(Boolean) as Phaser.Tilemaps.TilemapLayer[];
  let targetGid: number | null = null;
  if (tilesetId != null && tileId != null && _tilemap) {
    const tilesetName = TILE_TO_TILESET[tilesetId];
    if (tilesetName) {
      const ts = _tilemap.tilesets.find(t => t.name === tilesetName);
      if (ts) targetGid = ts.firstgid + tileId;
    }
  }
  for (const layer of layers) {
    const tile = layer.getTileAt(cellX, cellY);
    if (!tile) continue;
    if (targetGid != null && tile.index !== targetGid) continue;
    layer.removeTileAt(cellX, cellY);
  }
}

export const _Map = {
  setting: {
    map: {
      count: {
        x: 40,
        y: 22
      } //Размеры карты.
    },
    tile: {
      count: 0, //Количество тайлов в массиве.
      loaded: 0
    } as { count: number; loaded: number }, //Параметры тайлов
    canvas: {
      dom: null as any //Kept for compatibility with Hero.ts, Enemy.ts, Interface.ts
    },
    elem: {
      canvasID: "myCanvas"
    },
    flag: {
      start: true
    },
    overlay: [] as any[] //Legacy overlay array — no longer used for rendering
  },

  /**
   * Set the Phaser scene reference.
   */
  setScene: function (scene: Phaser.Scene): void {
    setScene(scene);
  },

  /**
   * No-op: Phaser renders overlay layer automatically via depth sorting.
   */
  overlay: function (): void {
    // Phaser handles overlay rendering via _overlayLayer.setDepth(10)
  },

  /**
   * Simplified: Phaser.Loader handles tile image loading.
   * Immediately invokes callback since assets are already loaded by WorldScene.preload().
   */
  tileLoader: function (callback: () => void): void {
    if (typeof callback === 'function') {
      callback();
    }
  },

  /**
   * No-op: canvas setup is handled by Phaser's renderer.
   */
  canvasSetting: function (): void {
    // Phaser handles canvas creation and sizing
  },

  randomInteger: function (min: number, max: number): number {
    var rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
  },

  /**
   * No-op for tilemap rendering (Phaser draws automatically).
   * Still calls saveStat() to preserve save behavior.
   */
  draw: function (): void {
    this.saveStat();
  },

  saveStat: function (): void {
    //Сохраняем состояние уровня каждый раз когда вызвана функция.
    (storage as any)[(storage as any)._lvl] = {_mobs: JSON.parse(JSON.stringify(_Mobs)), _map: (_lvl as any)[(storage as any)._lvl].map};
    (storage as any)._hero = _Hero;
  },

  searchNPS: function (name: string): any {
    //выполняем поиск НПС по его имени
    return Object.values(_Mobs).find((mob: any) => mob.type === "nps" && mob.options.name === name);
  },

  // TODO вынести эту функцию в класс Game
  levelSet: function (lvl: number): void {
    (storage as any).stopAutoSave();
    _gameSet(() => {}); //останавливаем игровой процесс
    _Mobs.forEach((mob: any) => mob.destroy?.());
    _Mobs.length = 0;

    // Create Phaser tilemap for new level
    createTilemap(lvl);

    _LevelLoader(lvl, runHookAfterLoadMob);
    (storage as any).startAutoSave();
    (storage as any)._lvl = lvl;
  },

  countEnemy: function (): number {
    var j = 0;
    for (var id in _Mobs) {
      var mob = _Mobs[id];
      if (mob.type !== 'enemy') continue;
      j++
    }
    return j;
  },

  /**
   * Get the collision layer for physics collider setup (Hero/Enemy).
   */
  getCollisionLayer: function (): Phaser.Tilemaps.TilemapLayer | null {
    return _collisionLayer;
  },

  /**
   * Get the active Phaser tilemap instance.
   */
  getTilemap: function (): Phaser.Tilemaps.Tilemap | null {
    return _tilemap;
  }
};
