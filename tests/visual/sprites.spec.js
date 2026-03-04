// @ts-check
/**
 * Visual regression tests: Sprite animation & direction screenshots.
 *
 * Captures canvas screenshots of the hero facing each direction,
 * hero on different levels, enemy sprites, and NPC sprites.
 */

import { test, expect } from '@playwright/test';

// ─── helpers ──────────────────────────────────────────────────────────────────

const waitForGameReady = async (page) => {
  await page.waitForSelector('#myCanvas', { timeout: 15_000 });
  await expect.poll(() => page.evaluate(() => typeof window.May?._test !== 'undefined'), { timeout: 20_000 }).toBe(true);
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.May._test.freezeNpcs());
  await page.locator('#myCanvas').click({ force: true });
  await page.waitForTimeout(200);
};

const resetGame = async (page) => {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForGameReady(page);
};

/** Navigate to level 1 via localStorage. */
const goToLevel1 = async (page) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('_lvl', JSON.stringify(1));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForGameReady(page);
};

// ─── TESTS ────────────────────────────────────────────────────────────────────

test.describe('Visual: Sprites & Directions', () => {

  // ── 1. Hero facing bottom (default spawn direction) ────────────────────────
  test('Hero sprite facing bottom', async ({ page }) => {
    await page.goto('/');
    await resetGame(page);

    // Hero spawns at (5,3) — press down briefly to ensure facing bottom
    await page.keyboard.down('ArrowDown');
    await page.waitForTimeout(150);
    await page.keyboard.up('ArrowDown');
    await page.waitForTimeout(300);

    const dir = await page.evaluate(() => window.May._test.getHeroDirection());
    expect(dir).toBe('bottom');

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('hero-facing-bottom.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 2. Hero facing top ────────────────────────────────────────────────────
  test('Hero sprite facing top', async ({ page }) => {
    await page.goto('/');
    await resetGame(page);

    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(150);
    await page.keyboard.up('ArrowUp');
    await page.waitForTimeout(300);

    const dir = await page.evaluate(() => window.May._test.getHeroDirection());
    expect(dir).toBe('top');

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('hero-facing-top.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 3. Hero facing left ───────────────────────────────────────────────────
  test('Hero sprite facing left', async ({ page }) => {
    await page.goto('/');
    await resetGame(page);

    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(150);
    await page.keyboard.up('ArrowLeft');
    await page.waitForTimeout(300);

    const dir = await page.evaluate(() => window.May._test.getHeroDirection());
    expect(dir).toBe('left');

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('hero-facing-left.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 4. Hero facing right ──────────────────────────────────────────────────
  test('Hero sprite facing right', async ({ page }) => {
    await page.goto('/');
    await resetGame(page);

    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(150);
    await page.keyboard.up('ArrowRight');
    await page.waitForTimeout(300);

    const dir = await page.evaluate(() => window.May._test.getHeroDirection());
    expect(dir).toBe('right');

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('hero-facing-right.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 5. Hero on level 1 (different sprites/environment) ────────────────────
  test('Hero on level 1 with different environment', async ({ page }) => {
    await goToLevel1(page);

    // Hero spawns at (21, 19) on level 1
    const pos = await page.evaluate(() => window.May._test.getHeroPos());
    expect(pos.x).toBe(21);
    expect(pos.y).toBe(19);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('hero-level1.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 6. Enemy sprites present on level 1 ───────────────────────────────────
  test('Enemy sprites visible on level 1', async ({ page }) => {
    await goToLevel1(page);

    // Verify enemies exist
    const enemyCount = await page.evaluate(() => window.May._test.listEnemies());
    expect(enemyCount).toBe(4);

    // Teleport hero near first enemy area for a good view
    const enemies = await page.evaluate(() => window.May._test.listEnemiesPositions());
    const firstEnemy = enemies[0];
    await page.evaluate(([x, y]) => window.May._test.teleport(x, y), [firstEnemy.x - 2, firstEnemy.y]);
    await page.waitForTimeout(500);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('enemy-sprites-level1.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 7. NPC sprites visible on level 0 ─────────────────────────────────────
  test('NPC sprites visible on level 0', async ({ page }) => {
    await page.goto('/');
    await resetGame(page);

    // Teleport near Астоф NPC at (5, 5) to capture NPC sprites
    await page.evaluate(() => window.May._test.teleport(5, 5));
    await page.waitForTimeout(500);

    const npcs = await page.evaluate(() => window.May._test.getAllNpcs());
    expect(npcs.length).toBeGreaterThan(0);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('npc-sprites-level0.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });
});
