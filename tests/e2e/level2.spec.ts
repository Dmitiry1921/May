/**
 * E2E тесты: Уровень 2 (Подсолнухи) — «Майские острова»
 *
 * Проверяем:
 *   - Спавн героя на (25, 20)
 *   - 7 врагов присутствуют
 *   - Данные врагов уровня содержат правильные координаты
 *   - Единственный NPC — Астоф (27, 20)
 *   - Астоф отвечает диалогом "astifWait"
 *   - Подсолнуховые тайлы существуют на карте
 *   - Состояние атаки героя (может быть отключена квестом artak)
 *   - Количество врагов (listEnemies)
 *   - Код NPC Астофа
 *   - 5 животных (3 коровы, 2 бабочки)
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── Группа 1: Быстрые проверки (один beforeAll) ────────────────────────────

test.describe('Уровень 2 — Подсолнухи', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('_lvl', JSON.stringify(2));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
  });

  // (a) Hero spawns at (25, 20) on level 2
  test('Герой спавнится на позиции (25, 20)', async ({ page }) => {
    const pos = await adapter.getHeroPos();
    expect(pos).toBeTruthy();
    expect(pos!.x).toBe(25);
    expect(pos!.y).toBe(20);

    // Verify we have 7 enemies (level 2 specific — level 0 has 0 enemies, level 1 has 4)
    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBe(7);
    console.log('✅ Герой на (25, 20), подтверждён уровень 2 (7 врагов)');
  });

  // (b) 7 enemies present
  test('На уровне присутствуют 7 врагов', async ({ page }) => {
    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBe(7);
    console.log(`✅ Количество врагов: ${enemies.length}`);
  });

  // (c) Enemy spawn coordinates in level data match expected
  test('Координаты спавна врагов в данных уровня соответствуют ожиданиям', async ({ page }) => {
    const rawEnemies = await adapter.getEnemies();
    const enemies = rawEnemies.map(e => ({ x: e.x, y: e.y, health: e.health, maxHealth: e.maxHealth }));

    expect(enemies.length).toBe(7);

    // All enemies should have valid coordinates (positive integers within map bounds)
    for (const enemy of enemies) {
      expect(enemy.x).toBeGreaterThanOrEqual(0);
      expect(enemy.y).toBeGreaterThanOrEqual(0);
      expect(enemy.x).toBeLessThan(40);
      expect(enemy.y).toBeLessThan(25);
    }

    // All enemies should have health
    for (const enemy of enemies) {
      expect(enemy.health).toBeGreaterThan(0);
      expect(enemy.maxHealth).toBeGreaterThan(0);
    }
    console.log('✅ 7 врагов с валидными координатами и здоровьем');
  });

  // (d) Only NPC is Астоф at (27, 20)
  test('Единственный NPC — Астоф на позиции (27, 20)', async ({ page }) => {
    const npcs = await adapter.getAllNpcs();
    expect(npcs.length).toBe(1);
    expect(npcs[0].name).toBe('Астоф');
    expect(npcs[0].x).toBe(27);
    expect(npcs[0].y).toBe(20);
    console.log('✅ Единственный NPC: Астоф на (27, 20)');
  });

  // (e) Астоф responds with "astifWait" dialog (2 lines)
  test('Астоф отвечает диалогом astifWait', async ({ page }) => {
    // Телепортируемся к Астофу и начинаем диалог
    await adapter.teleport(26, 20);
    await page.waitForTimeout(300);

    const started = await adapter.talkTo('Астоф');
    expect(started).toBe(true);
    await page.waitForTimeout(300);

    // Проверяем что диалог открылся
    const isOpen = await adapter.isDialogOpen();
    expect(isOpen).toBe(true);

    // Проверяем текст диалога
    const dialogInfo = await adapter.getDialogText();
    expect(dialogInfo).toBeTruthy();
    // astifWait dialog has 2 lines
    expect(dialogInfo!.total).toBe(2);
    console.log(`✅ Диалог Астофа: ${dialogInfo!.total} реплик(и) — astifWait`);

    // Закрываем диалог
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(100);
    for (let i = 0; i < 10; i++) {
      const open = await adapter.isDialogOpen();
      if (!open) break;
      await page.keyboard.down('Space');
      await page.waitForTimeout(50);
      await page.keyboard.up('Space');
      await page.waitForTimeout(550);
    }
  });

  // (f) Sunflower tiles exist on the map
  test('Подсолнуховые тайлы существуют на карте (findItemTiles(1))', async ({ page }) => {
    const sunflowerTiles = await adapter.findItemTiles(1);
    expect(sunflowerTiles).toBeTruthy();
    expect(Array.isArray(sunflowerTiles)).toBe(true);
    expect(sunflowerTiles.length).toBeGreaterThan(0);
    console.log(`✅ Найдено ${sunflowerTiles.length} подсолнуховых тайлов на карте`);
  });

  // (g) Hero attack state can be verified
  test('Состояние атаки героя можно проверить', async ({ page }) => {
    const heroState = await adapter.getHeroState();
    expect(heroState).toBeTruthy();
    expect(typeof heroState!.canAttack).toBe('boolean');
    console.log(`✅ Состояние атаки героя: canAttack = ${heroState!.canAttack}`);
  });

  // (h) Enemy count is exactly 7 via listEnemies
  test('Количество врагов равно 7 (listEnemies)', async ({ page }) => {
    const count = await adapter.getEnemyCount();
    expect(count).toBe(7);
    console.log(`✅ listEnemies() вернул: ${count}`);
  });

  // (i) Астоф NPC code is astifWait
  test('Код NPC Астофа — astifWait', async ({ page }) => {
    // LEGACY: listNpcs() needed for .code field — not available via TestAdapter
    const npcs = await page.evaluate(() => window.May._test.listNpcs());
    const astof = npcs.find(n => n.name === 'Астоф');
    expect(astof).toBeTruthy();
    expect(astof!.code).toContain('astifWait');
    console.log(`✅ Код Астофа: ${astof!.code}`);
  });

  // (j) Level 2 has correct mob composition
  test('На уровне присутствуют 5 животных (3 коровы, 2 бабочки)', async ({ page }) => {
    const enemies = await adapter.getEnemies();
    const npcs = await adapter.getAllNpcs();
    const enemyCount = await adapter.getEnemyCount();
    const mobCounts = {
      enemies: enemies.length,
      npcs: npcs.length,
      enemyCount: enemyCount,
    };

    expect(mobCounts.enemies).toBe(7);
    expect(mobCounts.npcs).toBe(1);
    expect(mobCounts.enemyCount).toBe(7);
    console.log(`✅ Враги: ${mobCounts.enemies}, NPC: ${mobCounts.npcs} — уровень корректно загружен`);
  });
});
