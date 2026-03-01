// @ts-check
/**
 * Visual regression tests: Rendering Layer Order.
 *
 * Verifies the order of rendering layers (Map, Mobs, Overlay, Interface)
 * and captures screenshots to ensure overlays render on top of entities.
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

test.describe('Visual: Rendering Order', () => {

  test('getRenderingLayerOrder() returns correct array', async ({ page }) => {
    await page.goto('/');
    await waitForGameReady(page);

    const order = await page.evaluate(() => window.May._test.getRenderingLayerOrder());
    expect(order).toEqual(['_Map.draw', 'drawMobs', '_Map.overlay', '_Interface.draw']);
  });

  test('Overlay renders on top of hero', async ({ page }) => {
    await goToLevel1(page);

    // Teleport hero to tile (5, 5) where overlay tiles/trees are expected
    await page.evaluate(() => window.May._test.teleport(5, 5));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('rendering-order-overlay.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  test('Mobs render under overlay', async ({ page }) => {
    await goToLevel1(page);

    // Verify enemies are present via getMobCount()
    const mobCounts = await page.evaluate(() => window.May._test.getMobCount());
    expect(mobCounts.enemies).toBeGreaterThan(0);

    // Teleport near an enemy
    const enemies = await page.evaluate(() => window.May._test.listEnemiesPositions());
    const firstEnemy = enemies[0];
    // Teleport near the enemy (offset by -2 x like in sprites.spec.js to avoid overlapping)
    await page.evaluate(([x, y]) => window.May._test.teleport(x, y), [firstEnemy.x - 2, firstEnemy.y]);
    await page.waitForTimeout(500);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('rendering-order-mobs-under-overlay.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

});
