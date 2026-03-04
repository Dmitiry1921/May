/**
 * Shared game helpers for E2E tests.
 *
 * These helpers abstract common test patterns and delegate all engine
 * interaction to TestAdapter — no direct `page.evaluate()` or
 * `window.May._test` references here.
 *
 * Extracted from 19 E2E spec files to eliminate duplication.
 */

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { TestAdapter } from '../types/test-adapter';

// ---------------------------------------------------------------------------
// waitForGameReady — unified from 3 variants across 19 files
// ---------------------------------------------------------------------------

export interface WaitForGameReadyOptions {
  /**
   * Variant B (combat-buffed): After standard init, buff hero health to 5
   * and enable attack. Used by combat.spec.js and other combat-heavy tests.
   */
  combatReady?: boolean;

  /**
   * Variant C (isGameRunning-checked): Instead of just waiting for _test API,
   * also polls isGameRunning() to ensure the game loop has started.
   * Used by movement.spec.js and full-playthrough.spec.js.
   */
  pollReady?: boolean;
}

/**
 * Wait for the game to be fully loaded and interactive.
 *
 * Three variants consolidated:
 *   - **Standard (A)**: waitForSelector + poll _test API + 2s sprite delay + freezeNpcs + focus canvas.
 *     Used by: level0, level1, level2, level3, dialog, save-load, hud, quest, inventory, etc.
 *   - **Combat-buffed (B)**: Standard + setHeroHealth(5) before and after sprite wait + freezeNpcs.
 *     Used by: combat.spec.js
 *   - **isGameRunning-checked (C)**: Standard + additionally checks isGameRunning() returns true.
 *     Used by: movement.spec.js
 *
 * @param page     Playwright Page object (needed for waitForSelector, waitForTimeout, locator, keyboard)
 * @param adapter  TestAdapter for engine interaction
 * @param options  Optional variant selection
 */
export async function waitForGameReady(
  page: Page,
  adapter: TestAdapter,
  options?: WaitForGameReadyOptions,
): Promise<void> {
  const { combatReady = false, pollReady = false } = options ?? {};

  // Step 1: Wait for canvas to appear in DOM (15s timeout — all variants)
  await page.waitForSelector('#myCanvas', { timeout: 15_000 });

  // Step 2: Poll until _test API is available (20s timeout — all variants)
  await expect.poll(
    async () => await adapter.isGameRunning().catch(() => false),
    { timeout: 20_000 },
  ).toBeTruthy();

  // Variant B: Buff hero health before sprite loading to prevent death
  if (combatReady) {
    await adapter.setHeroHealth(5);
  }

  // Step 3: Wait for sprites and game initialization (2000ms — all variants)
  await page.waitForTimeout(2000);

  // Variant B: Buff again in case enemy collision happened during sprite wait
  if (combatReady) {
    await adapter.setHeroHealth(5);
  }

  // Variant C: Verify game loop is actually running
  if (pollReady) {
    const isRunning = await adapter.isGameRunning();
    if (!isRunning) {
      throw new Error('Game loop is not running');
    }
  }

  // Step 4: Freeze NPCs so they don't block test scenarios (all variants)
  await adapter.freezeNpcs();

  // Step 5: Focus canvas for keyboard event capture (all variants)
  await page.locator('#myCanvas').click({ force: true });
  await page.waitForTimeout(200);
}

// ---------------------------------------------------------------------------
// pressSpace — duplicated in 10 files
// ---------------------------------------------------------------------------

/**
 * Press Space key the specified number of times with delay between presses.
 * Used for dialog advancement, NPC interaction, and general input.
 *
 * @param page    Playwright Page object
 * @param times   Number of Space presses (default: 1)
 * @param delayMs Delay between presses in ms (default: 550)
 */
export async function pressSpace(
  page: Page,
  times = 1,
  delayMs = 550,
): Promise<void> {
  for (let i = 0; i < times; i++) {
    await page.keyboard.down('Space');
    await page.waitForTimeout(50);
    await page.keyboard.up('Space');
    await page.waitForTimeout(delayMs);
  }
}

// ---------------------------------------------------------------------------
// goToLevel — localStorage + reload pattern from combat.spec.js
// ---------------------------------------------------------------------------

/**
 * Navigate to a specific level with a clean state.
 * Sets level in localStorage BEFORE reload so game boots directly into it.
 *
 * Pattern: clear storage → set _lvl → reload → waitForGameReady → verify level → buff + teleport safe.
 * Extracted from combat.spec.js:45-67.
 *
 * @param page    Playwright Page object
 * @param adapter TestAdapter for engine interaction
 * @param level   Target level number
 */
export async function goToLevel(
  page: Page,
  adapter: TestAdapter,
  level: number,
): Promise<void> {
  // Use adapter's goToLevel which handles localStorage + reload + canvas wait
  await adapter.goToLevel(level);

  // Run full game readiness check on the new level
  await waitForGameReady(page, adapter);

  // Verify we're on the correct level
  await expect.poll(
    async () => adapter.getLevel(),
    { timeout: 15_000 },
  ).toBe(level);

  // Final safety: buff hero and teleport to safe corner
  await adapter.setHeroHealth(5);
  await adapter.teleport(1, 1);
  await page.waitForTimeout(300);
}

// ---------------------------------------------------------------------------
// pressMovementKey — hold a movement key for duration
// ---------------------------------------------------------------------------

/**
 * Press a movement key and hold it for specified duration.
 * Used by movement tests and any test needing positional movement.
 *
 * @param page    Playwright Page object
 * @param key     Arrow key name: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
 * @param holdMs  How long to hold the key in ms (default: 800)
 */
export async function pressMovementKey(
  page: Page,
  key: string,
  holdMs = 800,
): Promise<void> {
  // Focus canvas to ensure key events are captured
  await page.locator('#myCanvas').click({ force: true });

  // Press and hold key
  await page.keyboard.down(key);
  await page.waitForTimeout(holdMs);
  await page.keyboard.up(key);

  // Small delay for final position to settle
  await page.waitForTimeout(100);
}

// ---------------------------------------------------------------------------
// talkToNpc — teleport near NPC, start dialog, close it
// ---------------------------------------------------------------------------

/**
 * Teleport hero near NPC, start dialog, press Space until dialog closes.
 * Extracted from 11 files: level0, level1, level3, full-playthrough, quest,
 * save-load, hud, inventory, item-digging, npc-movement, level-transitions.
 *
 * @param page         Playwright Page object
 * @param adapter      TestAdapter for engine interaction
 * @param npcName      NPC name as defined in lvl.js options.name
 * @param npcTileX     NPC tile X coordinate (hero teleports to npcTileX - 1)
 * @param npcTileY     NPC tile Y coordinate
 * @param pauseAfterMs Pause after dialog closes in ms (default: 600)
 */
export async function talkToNpc(
  page: Page,
  adapter: TestAdapter,
  npcName: string,
  npcTileX: number,
  npcTileY: number,
  pauseAfterMs = 600,
): Promise<void> {
  // Teleport hero next to NPC
  await adapter.teleport(npcTileX - 1, npcTileY);
  await page.waitForTimeout(300);

  // Start dialog
  const started = await adapter.talkTo(npcName);
  if (!started) console.warn(`⚠️  talkTo("${npcName}") returned false`);
  await page.waitForTimeout(300);

  // Focus canvas for Space key handling
  await page.locator('#myCanvas').click({ force: true });
  await page.waitForTimeout(100);

  // Press Space until dialog closes (max 50 presses)
  for (let i = 0; i < 50; i++) {
    const isOpen = await adapter.isDialogOpen();
    if (!isOpen) break;
    await pressSpace(page, 1);
  }

  await page.waitForTimeout(pauseAfterMs);
}

// ---------------------------------------------------------------------------
// closeDialog — press Space until dialog closes
// ---------------------------------------------------------------------------

/**
 * Close any open dialog by pressing Space repeatedly.
 * Extracted from hud.spec.js and used inline in many other files.
 *
 * @param page    Playwright Page object
 * @param adapter TestAdapter for engine interaction
 */
export async function closeDialog(
  page: Page,
  adapter: TestAdapter,
): Promise<void> {
  await page.locator('#myCanvas').click({ force: true });
  await page.waitForTimeout(100);

  for (let i = 0; i < 50; i++) {
    const isOpen = await adapter.isDialogOpen();
    if (!isOpen) break;
    await pressSpace(page, 1);
  }

  await page.waitForTimeout(600);
}

// ---------------------------------------------------------------------------
// waitForQuest — poll until quest text matches expected
// ---------------------------------------------------------------------------

/**
 * Wait for the quest text in storage to change to the expected value.
 * Extracted from 7 files: full-playthrough, level0, level1, quest,
 * save-load, item-digging, level-transitions.
 *
 * @param page     Playwright Page object
 * @param adapter  TestAdapter for engine interaction
 * @param expected Expected quest text
 * @param timeout  Max wait time in ms (default: 15000)
 */
export async function waitForQuest(
  page: Page,
  adapter: TestAdapter,
  expected: string,
  timeout = 15_000,
): Promise<void> {
  await expect.poll(
    async () => adapter.getQuestText(),
    { timeout, message: `Waiting for quest: "${expected}"` },
  ).toBe(expected);
}

// ---------------------------------------------------------------------------
// waitForLevel — poll until level number matches expected
// ---------------------------------------------------------------------------

/**
 * Wait for the current level to change to the expected value,
 * then freeze NPCs to prevent them from wandering.
 * Extracted from 6 files: full-playthrough, save-load, quest,
 * item-digging, level-transitions, npc-movement.
 *
 * @param page    Playwright Page object
 * @param adapter TestAdapter for engine interaction
 * @param level   Expected level number
 * @param timeout Max wait time in ms (default: 20000)
 */
export async function waitForLevel(
  page: Page,
  adapter: TestAdapter,
  level: number,
  timeout = 20_000,
): Promise<void> {
  await expect.poll(
    async () => adapter.getLevel(),
    { timeout, message: `Waiting for level: ${level}` },
  ).toBe(level);

  // Pause so _LevelLoader finishes creating all mobs before freezing
  await page.waitForTimeout(500);
  await adapter.freezeNpcs();
}
