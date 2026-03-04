/**
 * Performance sanity tests — «Майские острова»
 *
 * Проверяем:
 *   - FPS ≥ 30 на уровне 0 (без врагов) за 5 секунд
 *   - Время загрузки уровня < 5 секунд
 *   - Уровень 3 (14 врагов + NPC) работает ≥ 3 секунды без краша, FPS ≥ 20
 *   - Pathfinding под нагрузкой: враги ищут путь 3 секунды, FPS ≥ 15
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Measure average FPS over a given duration by counting requestAnimationFrame calls.
 * MUST stay as page.evaluate — requestAnimationFrame counting is browser-only.
 */
const measureFps = async (page: import('@playwright/test').Page, durationMs: number): Promise<number> => {
  return page.evaluate(async (ms) => {
    let frameCount = 0;
    const start = performance.now();
    return new Promise<number>((resolve) => {
      function count() {
        frameCount++;
        if (performance.now() - start < ms) {
          requestAnimationFrame(count);
        } else {
          resolve(frameCount / ((performance.now() - start) / 1000));
        }
      }
      requestAnimationFrame(count);
    });
  }, durationMs);
};

/** Navigate to a specific level via localStorage trick, returns adapter */
const goToLevel = async (page: import('@playwright/test').Page, level: number): Promise<TestAdapter> => {
  await page.goto('/');
  await page.evaluate((lvl) => {
    localStorage.clear();
    localStorage.setItem('_lvl', JSON.stringify(lvl));
  }, level);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const adapter = createPlaywrightAdapter(page);
  await waitForGameReady(page, adapter);
  return adapter;
};

// ─── ТЕСТЫ ───────────────────────────────────────────────────────────────────

test.describe('Performance sanity checks', () => {
  // (a) FPS Check: Level 0 (no enemies), 5 seconds, expect ≥30 FPS average
  test('FPS ≥ 30 на уровне 0 (без врагов) за 5 секунд', async ({ page }) => {
    const adapter = await goToLevel(page, 0);

    const lvl = await adapter.getLevel();
    expect(lvl).toBe(0);

    const fps = await measureFps(page, 5000);
    console.log(`📊 FPS на уровне 0: ${fps.toFixed(1)}`);
    expect(fps).toBeGreaterThanOrEqual(30);
  });

  // (b) Level Load Time: transition from level 0 → level 1, assert < 5 seconds
  test('Загрузка уровня 0→1 занимает < 5 секунд', async ({ page }) => {
    const adapter = await goToLevel(page, 0);

    const lvl0 = await adapter.getLevel();
    expect(lvl0).toBe(0);

    // LEGACY: window.May.levelSet() — engine method, not _test API
    // LEGACY: Performance timing must run inside browser context for accuracy
    const loadTimeMs = await page.evaluate(async () => {
      const start = performance.now();
      window.May.levelSet(1);
      // Poll until level changes
      await new Promise<void>((resolve) => {
        const check = () => {
          if (window.May._test.getLevel() === 1) {
            resolve(undefined);
          } else {
            requestAnimationFrame(check);
          }
        };
        requestAnimationFrame(check);
      });
      return performance.now() - start;
    });

    console.log(`📊 Время загрузки уровня 0→1: ${loadTimeMs.toFixed(0)} ms`);
    expect(loadTimeMs).toBeLessThan(5000);

    // Confirm we're on level 1
    const lvl1 = await adapter.getLevel();
    expect(lvl1).toBe(1);
  });

  // (c) Many Enemies: Level 3 (14 enemies + NPCs), run 3 seconds, no crash, FPS ≥ 20
  test('Уровень 3 (14 врагов) работает 3 секунды без краша, FPS ≥ 20', async ({ page }) => {
    const adapter = await goToLevel(page, 3);

    const lvl = await adapter.getLevel();
    expect(lvl).toBe(3);

    // Verify 14 enemies are present
    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBe(14);

    // Let the game run for 3 seconds and measure FPS
    const fps = await measureFps(page, 3000);
    console.log(`📊 FPS на уровне 3 (14 врагов, frozen NPCs): ${fps.toFixed(1)}`);
    expect(fps).toBeGreaterThanOrEqual(20);

    // Verify game is still running (no crash)
    const running = await adapter.isGameRunning();
    expect(running).toBe(true);
  });

  // (d) Pathfinding Under Load: unfreeze enemies on level 3, let them pathfind 3 seconds, FPS ≥ 15
  test('Pathfinding под нагрузкой: враги на уровне 3 ищут путь 3 секунды, FPS ≥ 15', async ({ page }) => {
    const adapter = await goToLevel(page, 3);

    const lvl = await adapter.getLevel();
    expect(lvl).toBe(3);

    // Unfreeze NPCs so enemies actively pathfind
    await adapter.unfreezeNpcs();
    await page.waitForTimeout(500);

    // Measure FPS while enemies are pathfinding
    const fps = await measureFps(page, 3000);
    console.log(`📊 FPS с активным pathfinding (14 врагов, unfrozen): ${fps.toFixed(1)}`);
    expect(fps).toBeGreaterThanOrEqual(15);

    // Verify game is still running
    const running = await adapter.isGameRunning();
    expect(running).toBe(true);
  });
});
