/**
 * E2E тесты системы хуков загрузки уровней (addHookAfterLoadMob / runHookAfterLoadMob).
 *
 * Покрываем жизненный цикл хуков:
 *   1. Изначально массив хуков пуст
 *   2. Регистрация одного хука
 *   3. Регистрация нескольких хуков
 *   4. Хуки очищаются после загрузки уровня
 *   5. Хук с кодом регистрируется и очищается при смене уровня
 *
 * Используем TestAdapter для регистрации хуков и навигации по уровням.
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { goToLevel } from '../helpers/game-helpers';
import { waitForGameReady } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';
import type { Page } from '@playwright/test';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Чистый старт игры: очистка localStorage, перезагрузка, ожидание инициализации.
 * Включает retry-логику на случай если dev-сервер упал между тестами.
 */
const freshGameStart = async (page: Page): Promise<TestAdapter> => {
  // Retry page.goto up to 3 times — the dev server sometimes crashes between tests
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
      break; // success
    } catch (e) {
      if (attempt === 3) throw e;
      console.warn(`⚠️ page.goto failed (attempt ${attempt}/3), retrying in 3s...`);
      await page.waitForTimeout(3000);
    }
  }
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  const adapter = createPlaywrightAdapter(page);
  await waitForGameReady(page, adapter);
  return adapter;
};

// ─── ТЕСТЫ ────────────────────────────────────────────────────────────────────

test.describe('Level Loading Hooks — addHookAfterLoadMob / runHookAfterLoadMob', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    adapter = await freshGameStart(page);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // HOOK REGISTRATION & LIFECYCLE
  // ════════════════════════════════════════════════════════════════════════════

  test('getRegisteredHooks returns empty array initially', async ({ page }) => {
    const hooks = await adapter.getRegisteredHooks();
    expect(Array.isArray(hooks)).toBe(true);
    expect(hooks.length).toBe(0);
    console.log('✅ Registered hooks array is empty at game start');
  });

  test('addTestHookAfterLoadMob registers a hook', async ({ page }) => {
    await adapter.addTestHookAfterLoadMob('test-hook-1');
    const hooks = await adapter.getRegisteredHooks();
    expect(hooks).toContain('test-hook-1');
    console.log('✅ Hook "test-hook-1" registered successfully');
  });

  test('multiple hooks can be registered', async ({ page }) => {
    await adapter.addTestHookAfterLoadMob('hook-a');
    await adapter.addTestHookAfterLoadMob('hook-b');
    await adapter.addTestHookAfterLoadMob('hook-c');

    const hooks = await adapter.getRegisteredHooks();
    expect(hooks.length).toBe(3);
    expect(hooks).toContain('hook-a');
    expect(hooks).toContain('hook-b');
    expect(hooks).toContain('hook-c');
    console.log('✅ Three hooks registered: hook-a, hook-b, hook-c');
  });

  test('hooks are cleared after level load', async ({ page }) => {
    // Register a hook (invalid code, but clearing still happens)
    await adapter.addTestHookAfterLoadMob('test-clear-hook');

    // Verify hook is registered
    const hooksBefore = await adapter.getRegisteredHooks();
    expect(hooksBefore).toContain('test-clear-hook');

    // Navigate to level 1 — triggers level load which runs and clears hooks
    await adapter.goToLevel(1);
    await waitForGameReady(page, adapter);

    // Hooks should be cleared after level load
    const hooksAfter = await adapter.getRegisteredHooks();
    expect(hooksAfter.length).toBe(0);
    console.log('✅ Hooks cleared after level load (test-clear-hook removed)');
  });

  test('hook registered before level change is cleared after navigation', async ({ page }) => {
    // Register a hook with actual code-like string
    await adapter.addTestHookAfterLoadMob('_code.nps.setLvlHook()');

    // Verify hook is present
    const hooksBefore = await adapter.getRegisteredHooks();
    expect(hooksBefore).toContain('_code.nps.setLvlHook()');

    // Navigate to level 1 — hooks execute and get cleared
    await adapter.goToLevel(1);
    await waitForGameReady(page, adapter);

    // Verify hooks are cleared after navigation
    const hooksAfter = await adapter.getRegisteredHooks();
    expect(hooksAfter.length).toBe(0);
    console.log('✅ Hook "_code.nps.setLvlHook()" cleared after level 1 navigation');
  });
});
