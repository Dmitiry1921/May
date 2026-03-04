/**
 * Game data constants extracted from test files.
 *
 * Only values that appear in 3+ test files are centralized here.
 * Values used in only 1-2 files stay inline in those files.
 *
 * These constants define the "golden" game specification:
 * any reimplementation must produce the same values.
 */

// ---------------------------------------------------------------------------
// LEVELS — spawn coordinates, enemy counts, NPC names per level
// ---------------------------------------------------------------------------

export const LEVELS = {
  0: {
    spawn: { x: 5, y: 3 },
    enemies: 0,
    npcs: ['Даздраперма', 'Артака', 'Астоф', 'Ванесса'],
  },
  1: {
    spawn: { x: 21, y: 19 },
    enemies: 4,
    npcs: ['Бэтмен', 'Астоф', 'Кирил'],
  },
  2: {
    spawn: { x: 25, y: 20 },
    enemies: 7,
    npcs: ['Астоф'],
  },
  3: {
    spawn: { x: 5, y: 13 },
    enemies: 14,
    npcs: ['Астоф', 'Автор', 'Бэтмен'],
  },
} as const;

// ---------------------------------------------------------------------------
// ITEMS — item IDs used by addItem(), getItemCount(), findItemTiles()
// ---------------------------------------------------------------------------

export const ITEMS = {
  CARROT: 0,
  SUNFLOWER: 1,
} as const;

// ---------------------------------------------------------------------------
// TIMINGS — timing constants used in 3+ files
// ---------------------------------------------------------------------------

/**
 * Standard timing values used across tests.
 * DO NOT change these values — they match engine behavior.
 */
export const TIMINGS = {
  /** Delay for dialog render / teleport settle (ms) */
  DIALOG_RENDER: 300,
  /** Debounce delay between Space presses (ms) */
  DEBOUNCE: 550,
  /** Wait after teleport for position to settle (ms) */
  TELEPORT_SETTLE: 300,
  /** Wait for sprites to fully load (ms) */
  SPRITE_LOAD: 2000,
  /** Pause after dialog closes (ms) */
  DIALOG_CLOSE_PAUSE: 600,
  /** Pause after level load for mobs to spawn (ms) */
  LEVEL_LOAD_PAUSE: 500,
  /** Focus canvas settle time (ms) */
  CANVAS_FOCUS: 200,
} as const;

// ---------------------------------------------------------------------------
// SELECTORS — CSS selectors
// ---------------------------------------------------------------------------

export const SELECTORS = {
  CANVAS: '#myCanvas',
} as const;

// ---------------------------------------------------------------------------
// ENEMY_STATS — per-level enemy stats (health, maxHealth, damage)
// ---------------------------------------------------------------------------

/**
 * Enemy stats per level, verified by combat.spec.js tests 11-14.
 * Level 0 has no enemies.
 */
export const ENEMY_STATS = {
  1: { count: 4, health: 4, maxHealth: 4, damage: 1 },
  2: { count: 7, health: 4, maxHealth: 4, damage: 1 },
  3: { count: 14, health: 15, maxHealth: 15, damage: 3 },
} as const;

// ---------------------------------------------------------------------------
// NPC_POSITIONS — NPC positions per level (used in 3+ files)
// ---------------------------------------------------------------------------

/**
 * NPC positions by level. Extracted from level0, level1, level3 spec files.
 * Level 2 has only 1 NPC (Астоф) — positions stay inline.
 */
export const NPC_POSITIONS = {
  0: {
    'Даздраперма': { x: 16, y: 4 },
    'Артака': { x: 24, y: 5 },
    'Астоф': { x: 5, y: 5 },
    'Ванесса': { x: 21, y: 15 },
  },
  1: {
    'Бэтмен': { x: 21, y: 7 },
    'Астоф': { x: 21, y: 20 },
    'Кирил': { x: 33, y: 4 },
  },
  3: {
    'Автор': { x: 12, y: 8 },
    'Астоф': { x: 5, y: 15 },
    'Бэтмен': { x: 32, y: 8 },
  },
} as const;
