// @ts-check
/**
 * Visual regression tests: UI components — HP bar, inventory, quest, dialog, controls.
 *
 * Captures canvas screenshots at deterministic game states and compares
 * them against baseline images using Playwright's toHaveScreenshot().
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

const pressSpace = async (page, times = 1, delayMs = 550) => {
  for (let i = 0; i < times; i++) {
    await page.keyboard.down('Space');
    await page.waitForTimeout(50);
    await page.keyboard.up('Space');
    await page.waitForTimeout(delayMs);
  }
};

const closeDialog = async (page) => {
  await page.locator('#myCanvas').click({ force: true });
  await page.waitForTimeout(100);
  for (let i = 0; i < 50; i++) {
    const isOpen = await page.evaluate(() => window.May._test.isDialogOpen());
    if (!isOpen) break;
    await pressSpace(page, 1);
  }
  await page.waitForTimeout(600);
};

// ─── TESTS ────────────────────────────────────────────────────────────────────

test.describe('Visual: UI Components', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await resetGame(page);
  });

  // ── 1. HP Bar: Full health ──────────────────────────────────────────────────
  test('HP bar at full health', async ({ page }) => {
    await page.evaluate(() => window.May._test.setHeroHealth(5));
    await page.waitForTimeout(300);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('hp-bar-full.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 2. HP Bar: Half health ──────────────────────────────────────────────────
  test('HP bar at half health', async ({ page }) => {
    await page.evaluate(() => window.May._test.setHeroHealth(3));
    await page.waitForTimeout(300);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('hp-bar-half.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 3. HP Bar: Low health (1 HP) ───────────────────────────────────────────
  test('HP bar at low health', async ({ page }) => {
    await page.evaluate(() => window.May._test.setHeroHealth(1));
    await page.waitForTimeout(300);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('hp-bar-low.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 4. Inventory: Empty (visible but no items) ─────────────────────────────
  test('Inventory visible but empty', async ({ page }) => {
    // Enable inventory via the normal NPC flow
    // Talk to Астоф first, then Ванесса to open inventory
    await page.evaluate(() => window.May._test.teleport(4, 5));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.May._test.talkTo('Астоф'));
    await page.waitForTimeout(300);
    await closeDialog(page);

    await page.evaluate(() => window.May._test.teleport(20, 15));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.May._test.talkTo('Ванесса'));
    await page.waitForTimeout(300);
    await closeDialog(page);

    // Inventory should be visible now (empty)
    const isVisible = await page.evaluate(() => window.May._test.isInventoryVisible());
    expect(isVisible).toBe(true);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('inventory-empty.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 5. Inventory: With items ───────────────────────────────────────────────
  test('Inventory with items', async ({ page }) => {
    // Enable inventory via NPC flow
    await page.evaluate(() => window.May._test.teleport(4, 5));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.May._test.talkTo('Астоф'));
    await page.waitForTimeout(300);
    await closeDialog(page);

    await page.evaluate(() => window.May._test.teleport(20, 15));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.May._test.talkTo('Ванесса'));
    await page.waitForTimeout(300);
    await closeDialog(page);

    // Add items to inventory
    await page.evaluate(() => {
      window.May._test.addItem(0, 5); // 5 carrots
      window.May._test.addItem(1, 3); // 3 sunflowers
    });
    await page.waitForTimeout(300);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('inventory-with-items.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 6. Quest text: No quest vs active quest ────────────────────────────────
  test('Quest text absent at start', async ({ page }) => {
    // At game start, no quest is set
    const quest = await page.evaluate(() => window.May._test.getQuestText());
    expect(quest).toBeNull();

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('quest-none.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 7. Quest text: Active quest visible ────────────────────────────────────
  test('Quest text visible after NPC interaction', async ({ page }) => {
    // Talk to Астоф → quest appears
    await page.evaluate(() => window.May._test.teleport(4, 5));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.May._test.talkTo('Астоф'));
    await page.waitForTimeout(300);
    await closeDialog(page);

    const quest = await page.evaluate(() => window.May._test.getQuestText());
    expect(quest).not.toBeNull();

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('quest-active.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });

  // ── 8. Dialog box with NPC face portrait ───────────────────────────────────
  test('Dialog box open with face portrait', async ({ page }) => {
    await page.evaluate(() => window.May._test.teleport(4, 5));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.May._test.talkTo('Астоф'));
    await page.waitForTimeout(500);

    const isOpen = await page.evaluate(() => window.May._test.isDialogOpen());
    expect(isOpen).toBe(true);

    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('dialog-open.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());

    // Cleanup
    await closeDialog(page);
  });

  // ── 9. Controls overlay visible (initial state) ───────────────────────────
  test('Controls overlay visible at game start', async ({ page }) => {
    // The controls overlay is shown at game start
    await page.evaluate(() => window.May._test.pauseGameLoop());
    await expect(page).toHaveScreenshot('controls-overlay.png', { maxDiffPixelRatio: 0.01 });
    await page.evaluate(() => window.May._test.resumeGameLoop());
  });
});
