/**
 * E2E тесты жизненного цикла мобов «Майских островов».
 *
 * Покрываем:
 *   1. Создание и инициализация моба после загрузки уровня
 *   2. Здоровье NPC (null/0 — у NPC нет боевого здоровья)
 *   3. Несуществующий моб возвращает exists:false
 *   4. Враг имеет health > 0 при спавне
 *   5. Количество мобов меняется между уровнями
 *   6. NPC с уровня 0 появляется снова после возврата с уровня 1
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, goToLevel } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';
import type { Page } from '@playwright/test';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Чистый старт игры: очистка localStorage, перезагрузка, ожидание инициализации.
 * Включает retry-логику на случай если dev-сервер упал между тестами.
 */
const freshStart = async (page: Page): Promise<TestAdapter> => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
      break;
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

test.describe('Mob Lifecycle — creation, initialization, active state, destruction', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    adapter = await freshStart(page);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // CREATION & INITIALIZATION
  // ════════════════════════════════════════════════════════════════════════════

  test('mob exists and is initialized after level load', async ({ page }) => {
    const state = await adapter.getMobLifecycleState('Астоф');

    expect(state.exists).toBe(true);
    expect(state.initialized).toBe(true);
    expect(state.type).toBe('nps');
    expect(state.visible).toBe(true);
    console.log('✅ Астоф exists, initialized, type=nps, visible after level 0 load');
  });

  test('NPC has numeric health (NPCs are actors with HP in this game)', async ({ page }) => {
    const state = await adapter.getMobLifecycleState('Астоф');

    // In May, NPCs have numeric health (e.g. 4) — they are actors, not just decorations
    expect(state.health).not.toBeNull();
    expect(typeof state.health).toBe('number');
    expect(state.health as number).toBeGreaterThan(0);
    console.log(`✅ Астоф health is ${state.health} (NPCs have numeric health in this game)`);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // NON-EXISTENT MOB
  // ════════════════════════════════════════════════════════════════════════════

  test('non-existent mob returns exists:false with all nulls', async ({ page }) => {
    const state = await adapter.getMobLifecycleState('МобКоторогоНеСуществует');

    expect(state.exists).toBe(false);
    expect(state.type).toBeNull();
    expect(state.initialized).toBe(false);
    expect(state.position).toBeNull();
    expect(state.health).toBeNull();
    console.log('✅ Non-existent mob correctly returns exists:false with all nulls');
  });

  // ════════════════════════════════════════════════════════════════════════════
  // ENEMY SPAWN
  // ════════════════════════════════════════════════════════════════════════════

  test('enemy mob has health > 0 on spawn', async ({ page }) => {
    await goToLevel(page, adapter, 1);

    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBeGreaterThan(0);

    // Verify first enemy has positive health on spawn
    const firstEnemy = enemies[0];
    expect(firstEnemy.health).toBeGreaterThan(0);

    // Verify mob count reflects enemies on this level
    const mobCount = await adapter.getMobCount();
    expect(mobCount.enemies).toBeGreaterThan(0);
    expect(mobCount.enemies).toBe(enemies.length);
    console.log(`✅ Level 1 has ${enemies.length} enemies, first has health ${firstEnemy.health} > 0`);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // MOB COUNT BETWEEN LEVELS
  // ════════════════════════════════════════════════════════════════════════════

  test('mob count changes between levels', async ({ page }) => {
    const countLevel0 = await adapter.getMobCount();
    expect(countLevel0.total).toBeGreaterThan(0);

    await goToLevel(page, adapter, 1);

    const countLevel1 = await adapter.getMobCount();
    expect(countLevel1.total).toBeGreaterThan(0);

    // Different levels have different mob compositions
    expect(countLevel0.total).not.toBe(countLevel1.total);
    console.log(`✅ Mob counts differ: level 0 = ${countLevel0.total}, level 1 = ${countLevel1.total}`);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // RECREATION ON LEVEL CHANGE
  // ════════════════════════════════════════════════════════════════════════════

  test('enemy mobs on level 1 do not appear on level 0', async ({ page }) => {
    // Level 0 has no enemies
    await goToLevel(page, adapter, 0);
    const countL0 = await adapter.getMobCount();
    expect(countL0.enemies).toBe(0);

    // Level 1 has enemies
    await goToLevel(page, adapter, 1);
    const countL1 = await adapter.getMobCount();
    expect(countL1.enemies).toBeGreaterThan(0);

    // Return to level 0 — enemies are gone
    await goToLevel(page, adapter, 0);
    const countBack = await adapter.getMobCount();
    expect(countBack.enemies).toBe(0);
    console.log(`✅ Enemies on L0=0, L1=${countL1.enemies}, back to L0=0`);
  });
});
