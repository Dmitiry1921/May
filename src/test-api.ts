/**
 * window.May._test API — bridge between golden tests and the Phaser 3 engine.
 *
 * All methods are SYNCHRONOUS. Tests call them via page.evaluate().
 * Module-scoped refs are updated by game scenes on create/transition.
 */

import { getHeroRef, getMobsArray, getInterfaceRef, getGameSet, getLoop, getComDirections, _bootComplete } from './scenes/WorldScene';
import { _Map } from './systems/TileMap';
import { pressKey as inputPressKey, releaseKey as inputReleaseKey, getKeyDownState as inputGetKeyDownState } from './systems/InputManager';
import { _tile } from './data/tiles';
import { _lvl } from './data/levels';
import { _itms } from './data/items';
import { _spt } from './data/sprites';
import storage from '../js/class/Storage.js';

// Module-scoped state refs — updated by game scenes
let _gamePaused = false;
let _phaserGame: Phaser.Game | null = null;

export function setupTestApi(game: Phaser.Game): void {
  _phaserGame = game;

  // No polling needed — _bootComplete is a live ES module binding
  // set by WorldScene after sprites and tiles finish loading

  // Ensure window.May exists
  if (!(window as any).May) {
    (window as any).May = {};
  }

  (window as any).May._test = {
    // =========================================================================
    // ReadState — query game state, no side effects
    // =========================================================================

    getHeroPos(): { x: number; y: number } | null {
      const _Hero = getHeroRef();
      if (!_Hero) return null;
      const tileW = (_tile as any).param.w;
      const tileH = (_tile as any).param.h;
      const x = Math.floor((_Hero.memory.x + tileW / 2) / tileW);
      const y = Math.floor((_Hero.memory.y + tileH / 2) / tileH);
      return { x, y };
    },

    getHeroState(): { health: number; maxHealth: number; canAttack: boolean; canWalk: boolean; tool: number | null } | null {
      const _Hero = getHeroRef();
      if (!_Hero) return null;
      const toolId: number | null = _Hero.options.tool !== null ? _Hero.options.tool : null;
      return {
        health: _Hero.options.health,
        maxHealth: _Hero.options.max.health,
        canAttack: _Hero.can.attack,
        canWalk: _Hero.can.walk,
        tool: toolId,
      };
    },

    getHeroDirection(): string | null {
      const _Hero = getHeroRef();
      if (!_Hero) return null;
      return _Hero.memory.pos;
    },

    getHeroHealth(): number | null {
      const _Hero = getHeroRef();
      if (!_Hero) return null;
      return _Hero.options.health;
    },

    getHeroPixelPos(): { x: number; y: number } | null {
      const _Hero = getHeroRef();
      if (!_Hero) return null;
      return { x: _Hero.memory.x, y: _Hero.memory.y };
    },

    getEnemies(): Array<{ x: number; y: number; health: number; maxHealth: number; type: string }> {
      const _Mobs = getMobsArray();
      const tileW = (_tile as any).param.w;
      const tileH = (_tile as any).param.h;
      return _Mobs
        .filter((mob: any) => mob.type === 'enemy')
        .map((mob: any) => ({
          x: Math.round(mob.x / tileW),
          y: Math.round(mob.y / tileH),
          health: mob.options.health,
          maxHealth: mob.options.max.health,
          type: mob.type,
        }));
    },

    listEnemies(): number {
      const _Mobs = getMobsArray();
      return _Mobs.filter((mob: any) => mob.type === 'enemy').length;
    },

    getAllNpcs(): Array<{ name: string; x: number; y: number; direction: string | null }> {
      const _Mobs = getMobsArray();
      return _Mobs
        .filter((mob: any) => mob.type === 'nps')
        .map((mob: any) => ({
          name: mob.options.name,
          x: mob.cell.x,
          y: mob.cell.y,
          direction: mob.memory.pos || null,
        }));
    },

    getNpcPosition(name: string): { x: number; y: number } | null {
      const _Mobs = getMobsArray();
      const npc = _Mobs.find((mob: any) => mob.type === 'nps' && mob.options.name === name);
      if (!npc) return null;
      return { x: npc.cell.x, y: npc.cell.y };
    },

    getMobInfo(name: string): { type: string; x: number; y: number; direction: string | null; health: number; maxHealth: number | undefined; isWalking: boolean; hasPath: boolean } | null {
      const _Hero = getHeroRef();
      const _Mobs = getMobsArray();
      const mob = _Mobs.find((m: any) => m.options.name === name);
      if (!mob) return null;
      const isHero = _Hero && mob === _Hero;
      return {
        type: mob.type,
        x: isHero ? _Hero.memory.x : mob.cell.x,
        y: isHero ? _Hero.memory.y : mob.cell.y,
        direction: mob.memory.pos || null,
        health: mob.options.health,
        maxHealth: mob.options.max?.health,
        isWalking: mob.path?.wait === false,
        hasPath: mob.path?.arr?.length > 0,
      };
    },

    isDialogOpen(): boolean {
      const _Interface = getInterfaceRef();
      return _Interface?.dialog?.flag === true;
    },

    getDialogText(): { text: string; line: number; total: number } | null {
      const _Interface = getInterfaceRef();
      if (!_Interface?.dialog?.flag) return null;
      return {
        text: _Interface.dialog.text[_Interface.dialog.textid]?.[0] || '',
        line: _Interface.dialog.textid,
        total: _Interface.dialog.text.length,
      };
    },


    getQuestText(): string | null {
      return (storage as any)._quest || null;
    },

    getQuest(): string | null {
      return (storage as any)._quest || null;
    },

    isInventoryVisible(): boolean {
      return (storage as any)._invShow === true;
    },

    getInventory(): unknown | null {
      const inv = (storage as any)._inventory;
      if (!inv || !inv.itms) return null;
      return inv.itms;
    },

    getItemCount(itemId: number): number {
      const inv = (storage as any)._inventory;
      if (!inv || !inv.itms) return 0;
      for (let slot = 0; slot <= 4; slot++) {
        const s = inv.itms[slot];
        if (s !== null && s !== undefined && s.itm === itemId) {
          return s.count;
        }
      }
      return 0;
    },

    getLevel(): number {
      const lvl = (storage as any)._lvl;
      if (lvl !== null && lvl !== undefined) return lvl;
      // localStorage fallback
      const stored = localStorage.getItem('_lvl');
      if (stored !== null) {
        try {
          return JSON.parse(stored);
        } catch {
          return 0;
        }
      }
      return 0;
    },

    isGameOver(): boolean {
      const _Hero = getHeroRef();
      return _Hero && _Hero.options.health <= 0 && !_Hero.can.walk;
    },

    isGameRunning(): boolean {
      return _bootComplete && !_gamePaused;
    },

    getHudState(): { hp: { current: number; max: number } | null; questText: string | null; inventoryVisible: boolean; dialogOpen: boolean; dialogText: string | null } {
      const _Hero = getHeroRef();
      const _Interface = getInterfaceRef();
      const dialogOpen = _Interface?.dialog?.flag === true;
      let dialogText: string | null = null;
      if (dialogOpen) {
        dialogText = _Interface.dialog.text[_Interface.dialog.textid]?.[0] || '';
      }
      return {
        hp: _Hero ? { current: _Hero.options.health, max: _Hero.options.max.health } : null,
        questText: (storage as any)._quest || null,
        inventoryVisible: (storage as any)._invShow === true,
        dialogOpen,
        dialogText,
      };
    },

    findItemTiles(itemId: number): Array<{ x: number; y: number }> {
      const results: Array<{ x: number; y: number }> = [];
      const currentLvl = (storage as any)._lvl;
      const mapData = (_lvl as any)[currentLvl]?.map;
      const itemDef = (_itms as any)[itemId];
      if (!mapData || !itemDef || !itemDef.map) return results;
      const targetTile = itemDef.map.tile;
      const targetId = itemDef.map.id;
      for (const x in mapData) {
        for (const y in mapData[x]) {
          for (const l in mapData[x][y]) {
            const cell = mapData[x][y][l];
            if (cell && cell.tile === targetTile && cell.id === targetId) {
              results.push({ x: parseInt(x, 10), y: parseInt(y, 10) });
            }
          }
        }
      }
      return results;
    },

    getHeroAnimFrame(): number | null {
      return (_spt as any)?.hero?.frame?.im ?? null;
    },

    getHeroAttackRadius(): number | null {
      const _Hero = getHeroRef();
      return _Hero?.options?.radios ?? null;
    },

    getTileSize(): { w: number; h: number } {
      return { w: (_tile as any).param.w, h: (_tile as any).param.h };
    },

    getKeyDownState(): Record<string, boolean> {
      return inputGetKeyDownState();
    },

    checkCollisionAt(px: number, py: number): { hasCollision: boolean; reason?: string } {
      const currentLvl = (storage as any)._lvl;
      const mapData = (_lvl as any)[currentLvl]?.map;
      if (!mapData) return { hasCollision: false };
      const tileW = (_tile as any).param.w;
      const tileH = (_tile as any).param.h;
      const tx = Math.floor(px / tileW);
      const ty = Math.floor(py / tileH);
      if (mapData[tx] && mapData[tx][ty]) {
        for (const l in mapData[tx][ty]) {
          const cell = mapData[tx][ty][l];
          if (cell && cell.tile !== undefined && cell.id !== undefined) {
            const tileData = (_tile as any)[cell.tile];
            if (tileData?.map?.[cell.id]?.wall === 1) {
              return { hasCollision: true, reason: 'wall' };
            }
          }
        }
      }
      return { hasCollision: false };
    },

    // =========================================================================
    // Actions — mutations for test setup and manipulation
    // =========================================================================

    teleport(tx: number, ty: number): void {
      const _Hero = getHeroRef();
      if (!_Hero) return;
      const tileW = (_tile as any).param.w;
      const tileH = (_tile as any).param.h;
      _Hero.memory.x = tx * tileW;
      _Hero.memory.y = ty * tileH;
      _Hero.memory.dump.x = _Hero.memory.x;
      _Hero.memory.dump.y = _Hero.memory.y;
      _Hero.memory.cell = { x: tx, y: ty };
    },

    talkTo(name: string): boolean {
      const _Hero = getHeroRef();
      const _Mobs = getMobsArray();
      if (!_Hero) return false;
      const idx = _Mobs.findIndex((mob: any) => mob.type === 'nps' && mob.options.name === name);
      if (idx === -1) return false;
      _Hero.nps = idx;
      _Mobs[idx].actFlag = true;
      // If NPC is frozen (options.life=false), actions() won't fire from game loop.
      // Call it directly so dialog opens immediately.
      _Mobs[idx].actions();
      return true;
    },

    killAllEnemies(): void {
      const _Mobs = getMobsArray();
      for (let i = _Mobs.length - 1; i >= 0; i--) {
        if (_Mobs[i].type === 'enemy') {
          _Mobs.splice(i, 1);
        }
      }
    },

    addItem(itemId: number, count: number): void {
      const _Interface = getInterfaceRef();
      if (!_Interface) return;
      _Interface.inventory.add(itemId, count);
    },

    setHeroHealth(hp: number): void {
      const _Hero = getHeroRef();
      if (!_Hero) return;
      _Hero.options.health = hp;
    },

    damageHero(amount: number): void {
      const _Hero = getHeroRef();
      if (!_Hero) return;
      _Hero.options.health = Math.max(0, _Hero.options.health - amount);
    },

    enableAttack(): void {
      const _Hero = getHeroRef();
      if (!_Hero) return;
      _Hero.can.attack = true;
    },

    enableWalk(): void {
      const _Hero = getHeroRef();
      if (!_Hero) return;
      _Hero.can.walk = true;
    },

    freezeNpcs(): void {
      const _Mobs = getMobsArray();
      for (const mob of _Mobs) {
        if (mob.type !== 'enemy' && mob !== getHeroRef()) {
          mob.path.wait = true;
          mob.path.arr = [];
          mob.path.cell = 0;
          mob.path.step = 0;
          mob._frozen = true;
        }
      }
    },

    unfreezeNpcs(): void {
      const _Mobs = getMobsArray();
      for (const mob of _Mobs) {
        if (mob.type !== 'enemy' && mob !== getHeroRef()) {
          mob.path.wait = false;
          mob.path.timer = true;
          mob._frozen = false;
        }
      }
    },

    pauseGameLoop(): void {
      const _gameSet = getGameSet();
      _gameSet(() => {});
      _gamePaused = true;
    },

    resumeGameLoop(): void {
      const _gameSet = getGameSet();
      const loop = getLoop();
      _gameSet(loop);
      _gamePaused = false;
    },

    saveStat(): void {
      _Map.saveStat();
    },

    pressKey(keyCode: number): void {
      inputPressKey(keyCode);
    },

    releaseKey(keyCode: number): void {
      inputReleaseKey(keyCode);
    },

    // =========================================================================
    // Legacy methods (used directly by some tests bypassing adapter)
    // =========================================================================

    listNpcs(): Array<{ name: string; x: number; y: number; life: boolean; visibility: boolean; code: string }> {
      const _Mobs = getMobsArray();
      return _Mobs
        .filter((mob: any) => mob.type === 'nps')
        .map((mob: any) => ({
          name: mob.options.name,
          x: mob.cell.x,
          y: mob.cell.y,
          life: mob.options.life,
          visibility: mob.options.visibility,
          code: mob.options.code,
        }));
    },

    listEnemiesPositions(): Array<{ x: number; y: number; health: number }> {
      const _Mobs = getMobsArray();
      const tileW = (_tile as any).param.w;
      const tileH = (_tile as any).param.h;
      return _Mobs
        .filter((mob: any) => mob.type === 'enemy')
        .map((mob: any) => ({
          x: Math.round(mob.x / tileW),
          y: Math.round(mob.y / tileH),
          health: mob.options.health,
        }));
    },

    getNpcDirection(name: string): string | null {
      const _Mobs = getMobsArray();
      const npc = _Mobs.find((mob: any) => mob.type === 'nps' && mob.options.name === name);
      if (!npc) return null;
      return npc.memory.pos || null;
    },
    getRenderingLayerOrder(): string[] {
      return ['_Map.draw', 'drawMobs', '_Map.overlay', '_Interface.draw'];
    },

    getHeroCollisionBox(): { x: number; y: number; width: number; height: number } | null {
      const _Hero = getHeroRef();
      if (!_Hero) return null;
      const sp = _Hero.options.speed;
      const w = (_spt as any).hero.frame.w;
      const h = (_spt as any).hero.frame.h;
      return {
        x: _Hero.memory.x + sp,
        y: _Hero.memory.y + (h / 4) * 3,
        width: w - sp * 2,
        height: h / 4,
      };
    },

    checkCollisionAtPixel(px: number, py: number, w: number, h: number): boolean {
      const currentLvl = (storage as any)._lvl;
      const mapData = (_lvl as any)[currentLvl]?.map;
      if (!mapData) return false;
      const tileW = (_tile as any).param.w;
      const tileH = (_tile as any).param.h;
      for (const cx in mapData) {
        for (const cy in mapData[cx]) {
          for (const cl in mapData[cx][cy]) {
            const ci = mapData[cx][cy][cl];
            if (!ci || ci.tile === undefined || ci.id === undefined) continue;
            const tileData = (_tile as any)[ci.tile];
            if (!tileData?.map?.[ci.id]?.wall) continue;
            const tx = parseInt(cx, 10) * tileW;
            const ty = parseInt(cy, 10) * tileH;
            if (tx < px + w && tx + tileW > px && ty < py + h && ty + tileH > py) return true;
          }
        }
      }
      return false;
    },

    getEnemyPath(name: string): { path: Array<{ x: number; y: number }>; state: string; target: { x: number; y: number } | null } | null {
      const _Mobs = getMobsArray();
      const mob = _Mobs.find((m: any) => m.options?.name === name);
      if (!mob || mob.type !== 'enemy') return null;
      const path = mob.path;
      if (!path) return null;
      const state = path.wait ? 'wait' : path.timer ? 'timer' : 'moving';
      const target = (path.mem?.x !== null && path.mem?.x !== undefined)
        ? { x: path.mem.x, y: path.mem.y }
        : null;
      return { path: path.arr || [], state, target };
    },

    getEnemyAIState(name: string): { type: string; behavior: string; actFlag: boolean; doit: boolean; health: number; maxHealth: number; damage: number; position: { x: number; y: number } } | null {
      const _Mobs = getMobsArray();
      const mob = _Mobs.find((m: any) => m.options?.name === name);
      if (!mob) return null;
      const path = mob.path;
      const behavior = mob.actFlag ? 'combat' : (path?.arr?.length > 0 ? 'patrolling' : 'idle');
      return {
        type: mob.type,
        behavior,
        actFlag: !!mob.actFlag,
        doit: !!mob.doit,
        health: mob.options?.health ?? 0,
        maxHealth: mob.options?.max?.health ?? 0,
        damage: mob.options?.damage ?? 0,
        position: { x: mob.x ?? mob.cell?.x ?? 0, y: mob.y ?? mob.cell?.y ?? 0 },
      };
    },

    triggerNpcDialog(name: string): boolean {
      const _Hero = getHeroRef();
      const _Mobs = getMobsArray();
      if (!_Hero) return false;
      const idx = _Mobs.findIndex((mob: any) => mob.options?.name === name);
      if (idx === -1) return false;
      _Hero.nps = idx;
      _Mobs[idx].actFlag = true;
      _Mobs[idx].actions();
      return true;
    },

    getMobLifecycleState(name: string): { exists: boolean; type: string | null; initialized: boolean; position: { x: number; y: number } | null; health: number | null; visible: boolean } {
      const _Mobs = getMobsArray();
      const mob = _Mobs.find((m: any) => m.options?.name === name);
      if (!mob) return { exists: false, type: null, initialized: false, position: null, health: null, visible: false };
      return {
        exists: true,
        type: mob.type,
        initialized: !!mob.options,
        position: mob.cell ? { x: mob.cell.x, y: mob.cell.y } : null,
        health: mob.options?.health ?? null,
        visible: mob.options?.visibility !== false,
      };
    },

    getRegisteredHooks(): string[] {
      return [...((storage as any).afterLoadMobHooks || [])];
    },

    addTestHookAfterLoadMob(hookCode: string): void {
      (storage as any).afterLoadMobHooks = (storage as any).afterLoadMobHooks || [];
      (storage as any).afterLoadMobHooks.push(hookCode);
    },

    getQuestState(): { active: boolean; itm: number | null; count: number | null; callback: string | null; lvl: number | null; text: string } {
      const _Hero = getHeroRef();
      const text = (storage as any)._quest || '';
      const q = _Hero?.options?.quest ?? null;
      return {
        active: !!text || !!q,
        itm: q?.itm ?? null,
        count: q?.count ?? null,
        callback: q?.callback ?? null,
        lvl: q?.lvl ?? null,
        text,
      };
    },

    getMobCount(): { total: number; enemies: number; nps: number; animals: number } {
      const _Mobs = getMobsArray();
      const enemies = _Mobs.filter((m: any) => m.type === 'enemy').length;
      const nps = _Mobs.filter((m: any) => m.type === 'nps').length;
      const animals = _Mobs.filter((m: any) => m.type === 'animal').length;
      return { total: _Mobs.length, enemies, nps, animals };
    },

    getNpcCode(name: string): string | null {
      const _Mobs = getMobsArray();
      const mob = _Mobs.find((m: any) => m.options?.name === name);
      return mob?.options?.code ?? null;
    },
  };
}
