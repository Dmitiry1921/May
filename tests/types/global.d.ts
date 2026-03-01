/**
 * Global type declarations for the game's browser-side _test API.
 *
 * This file makes TypeScript aware of window.May._test without
 * importing any engine modules. Used exclusively by the adapter.
 */

import type {
  HeroPos,
  HeroState,
  EnemyInfo,
  NpcInfo,
  MobInfo,
  DialogText,
  HudState,
  ItemTile,
  TileSize,
  CollisionResult,
  HeroCollisionBox,
  EnemyPathState,
  EnemyAIState,
  MobLifecycleState,
  QuestState,
  MobCount,
} from './test-adapter';

interface MayTestApi {
  getHeroPos(): HeroPos | null;
  getHeroState(): HeroState | null;
  getHeroDirection(): string | null;
  getHeroHealth(): number | null;
  getHeroPixelPos(): HeroPos | null;
  getEnemies(): EnemyInfo[];
  listEnemies(): number;
  getAllNpcs(): NpcInfo[];
  getNpcPosition(name: string): HeroPos | null;
  getMobInfo(name: string): MobInfo | null;
  isDialogOpen(): boolean;
  getDialogText(): DialogText | null;
  getQuestText(): string | null;
  getQuest(): string | null;
  isInventoryVisible(): boolean;
  getInventory(): unknown | null;
  getItemCount(itemId: number): number;
  getLevel(): number;
  isGameOver(): boolean;
  isGameRunning(): boolean;
  getHudState(): HudState;
  findItemTiles(itemId: number): ItemTile[];
  getHeroAnimFrame(): number | null;
  getHeroAttackRadius(): number | null;
  getTileSize(): TileSize;
  getKeyDownState(): Record<string, boolean>;
  checkCollisionAt(px: number, py: number): CollisionResult;

  teleport(tx: number, ty: number): void;
  talkTo(name: string): boolean;
  killAllEnemies(): void;
  addItem(itemId: number, count: number): void;
  setHeroHealth(hp: number): void;
  damageHero(amount: number): void;
  enableAttack(): void;
  enableWalk(): void;
  freezeNpcs(): void;
  unfreezeNpcs(): void;
  pauseGameLoop(): void;
  resumeGameLoop(): void;
  saveStat(): void;
  pressKey(keyCode: number): void;
  releaseKey(keyCode: number): void;

  listNpcs(): Array<{ name: string; x: number; y: number; life: boolean; visibility: boolean; code: string }>;
  listEnemiesPositions(): Array<{ x: number; y: number; health: number }>;
  getNpcDirection(name: string): string | null;
  getRenderingLayerOrder(): string[];
  getHeroCollisionBox(): HeroCollisionBox | null;
  checkCollisionAtPixel(px: number, py: number, w: number, h: number): boolean;
  getEnemyPath(name: string): EnemyPathState | null;
  getEnemyAIState(name: string): EnemyAIState | null;
  triggerNpcDialog(name: string): boolean;
  getMobLifecycleState(name: string): MobLifecycleState;
  getRegisteredHooks(): string[];
  addTestHookAfterLoadMob(hookCode: string): void;
  getQuestState(): QuestState;
  getMobCount(): MobCount;
  getNpcCode(name: string): string | null;
}

interface MayGlobal {
  _test: MayTestApi;
  pauseGame(): void;
  resumeGame(): void;
  levelSet(level: number): void;
}

declare global {
  interface Window {
    May: MayGlobal;
    _originalReload?: () => void;
    _reloadCalled?: boolean;
    _Hero?: any;
    _Interface?: any;
  }
}

export {};
