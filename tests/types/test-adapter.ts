/**
 * TestAdapter — портативный контракт для golden tests.
 *
 * Все методы возвращают Promise, т.к. адаптер может использовать
 * page.evaluate() или другие async-механизмы внутри.
 *
 * Две секции:
 *  - ReadState: чтение состояния игры (без побочных эффектов)
 *  - Actions: мутации для настройки тестовых сценариев
 */

// ---------------------------------------------------------------------------
// Supporting types
// ---------------------------------------------------------------------------

export interface HeroPos {
  x: number;
  y: number;
}

export interface HeroState {
  health: number;
  maxHealth: number;
  canAttack: boolean;
  canWalk: boolean;
  tool: string;
}

export interface EnemyInfo {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  type: string;
}

export interface NpcInfo {
  name: string;
  x: number;
  y: number;
  direction: string | null;
}

export interface MobInfo {
  type: string;
  x: number;
  y: number;
  direction: string | null;
  health: number;
  maxHealth: number | undefined;
  isWalking: boolean;
  hasPath: boolean;
}

export interface DialogText {
  text: string;
  line: number;
  total: number;
}

export interface HudState {
  hp: { current: number; max: number } | null;
  questText: string | null;
  inventoryVisible: boolean;
  dialogOpen: boolean;
  dialogText: string | null;
}

export interface ItemTile {
  x: number;
  y: number;
}

export interface TileSize {
  w: number;
  h: number;
}

export interface CollisionResult {
  hasCollision: boolean;
  reason?: string;
}

export interface HeroCollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EnemyPathState {
  path: Array<{ x: number; y: number }>;
  state: string;
  target: { x: number; y: number } | null;
}

export interface EnemyAIState {
  type: string;
  behavior: string;
  actFlag: boolean;
  doit: boolean;
  health: number;
  maxHealth: number;
  damage: number;
  position: { x: number; y: number };
}

export interface MobLifecycleState {
  exists: boolean;
  type: string | null;
  initialized: boolean;
  position: { x: number; y: number } | null;
  health: number | null;
  visible: boolean;
}

export interface QuestState {
  active: boolean;
  itm: number | null;
  count: number | null;
  callback: string | null;
  lvl: number | null;
  text: string;
}

export interface MobCount {
  total: number;
  enemies: number;
  nps: number;
  animals: number;
}

// ---------------------------------------------------------------------------
// Game config (replaces hardcoded values)
// ---------------------------------------------------------------------------

export interface GameConfig {
  /** Canvas CSS selector (replaces hardcoded '#myCanvas') */
  canvasSelector: string;
  /** Base URL for the game server (replaces hardcoded 'http://localhost:8080') */
  baseUrl: string;
}

// ---------------------------------------------------------------------------
// TestAdapter interface
// ---------------------------------------------------------------------------

export interface TestAdapter {
  // =========================================================================
  // ReadState — query game state, no side effects
  // =========================================================================

  /** Hero tile position {x, y} or null if hero not loaded */
  getHeroPos(): Promise<HeroPos | null>;

  /** Hero state: health, maxHealth, canAttack, canWalk, tool */
  getHeroState(): Promise<HeroState | null>;

  /** Hero direction: 'top' | 'bottom' | 'left' | 'right' */
  getHeroDirection(): Promise<string | null>;

  /** Hero current health value */
  getHeroHealth(): Promise<number | null>;

  /** Hero pixel position (for precise collision checks) */
  getHeroPixelPos(): Promise<HeroPos | null>;

  /** List of all alive enemies with positions and health */
  getEnemies(): Promise<EnemyInfo[]>;

  /** Count of alive enemies (wraps listEnemies) */
  getEnemyCount(): Promise<number>;

  /** All NPCs on current level with positions */
  getAllNpcs(): Promise<NpcInfo[]>;

  /** NPC tile position by name */
  getNpcPosition(name: string): Promise<HeroPos | null>;

  /** Full mob info by name (NPC, enemy, or animal) */
  getMobInfo(name: string): Promise<MobInfo | null>;

  /** Whether a dialog is currently open */
  isDialogOpen(): Promise<boolean>;

  /** Current dialog text, line index, and total lines */
  getDialogText(): Promise<DialogText | null>;

  /** Current quest text */
  getQuestText(): Promise<string | null>;

  /** Whether inventory panel is visible */
  isInventoryVisible(): Promise<boolean>;

  /** Raw inventory data */
  getInventory(): Promise<unknown | null>;

  /** Count of a specific item in inventory */
  getItemCount(itemId: number): Promise<number>;

  /** Current level number */
  getLevel(): Promise<number>;

  /** Whether game over state is active */
  isGameOver(): Promise<boolean>;

  /** Whether the game loop is currently running */
  isGameRunning(): Promise<boolean>;

  /** Full HUD state: HP, quest, inventory visibility, dialog */
  getHudState(): Promise<HudState>;

  /** Find all tile positions containing a specific item */
  findItemTiles(itemId: number): Promise<ItemTile[]>;

  /** Current hero animation frame index */
  getHeroAnimFrame(): Promise<number | null>;

  /** Hero attack radius */
  getHeroAttackRadius(): Promise<number | null>;

  /** Tile dimensions in pixels */
  getTileSize(): Promise<TileSize>;

  /** Current keyboard state (which keys are pressed) */
  getKeyDownState(): Promise<Record<string, boolean>>;

  /** Check collision at specific pixel coordinates */
  checkCollisionAt(px: number, py: number): Promise<CollisionResult>;

  // =========================================================================
  // Actions — mutations for test setup and manipulation
  // =========================================================================

  /** Teleport hero to tile coordinates (tx, ty) */
  teleport(tx: number, ty: number): Promise<void>;

  /** Initiate dialog with NPC by name */
  talkTo(name: string): Promise<boolean>;

  /** Kill all enemies on current level */
  killAllEnemies(): Promise<void>;

  /** Add item to inventory */
  addItem(itemId: number, count: number): Promise<void>;

  /** Set hero health to specific value */
  setHeroHealth(hp: number): Promise<void>;

  /** Damage hero by amount */
  damageHero(amount: number): Promise<void>;

  /** Enable hero attack capability */
  enableAttack(): Promise<void>;

  /** Enable hero walking capability */
  enableWalk(): Promise<void>;

  /** Freeze NPC movement (NPCs stay in place, dialogs still work) */
  freezeNpcs(): Promise<void>;

  /** Restore NPC movement after freezeNpcs() */
  unfreezeNpcs(): Promise<void>;

  /** Pause the game loop */
  pauseGameLoop(): Promise<void>;

  /** Resume the game loop */
  resumeGameLoop(): Promise<void>;

  /** Save current game state to storage */
  saveStat(): Promise<void>;

  /** Navigate to a specific level (composed: teleport + trigger transition) */
  goToLevel(level: number): Promise<void>;

  /** Clear all saved game data from storage */
  clearStorage(): Promise<void>;

  /** Simulate key press by keyCode */
  pressKey(keyCode: number): Promise<void>;

  /** Simulate key release by keyCode */
  releaseKey(keyCode: number): Promise<void>;

  // =========================================================================
  // New ReadState methods — blind spot coverage
  // =========================================================================

  getRenderingLayerOrder(): Promise<string[]>;
  getHeroCollisionBox(): Promise<HeroCollisionBox | null>;
  checkCollisionAtPixel(px: number, py: number, w: number, h: number): Promise<boolean>;
  getEnemyPath(name: string): Promise<EnemyPathState | null>;
  getEnemyAIState(name: string): Promise<EnemyAIState | null>;
  getMobLifecycleState(name: string): Promise<MobLifecycleState>;
  getRegisteredHooks(): Promise<string[]>;
  getQuestState(): Promise<QuestState>;
  getMobCount(): Promise<MobCount>;
  getNpcCode(name: string): Promise<string | null>;

  // New Actions — blind spot coverage
  triggerNpcDialog(name: string): Promise<boolean>;
  addTestHookAfterLoadMob(hookCode: string): Promise<void>;
}
