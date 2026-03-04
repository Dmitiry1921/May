/**
 * E2E тесты: Уровень 1 (Остров Труд) — «Майские острова»
 *
 * Проверяем:
 *   - Спавн героя на (21,19)
 *   - 4 врага на правильных позициях
 *   - Все NPC на правильных позициях
 *   - Бэтмен изначально скрыт (visibility:false, life:false)
 *   - Квестовая цепочка: farmerBob → BatmenBoo → famerBob1
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, talkToNpc, waitForQuest } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── ТЕСТЫ ───────────────────────────────────────────────────────────────────

test.describe('Уровень 1 — Остров Труд', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    // Retry navigation in case server is slow to respond
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await page.goto('/', { timeout: 15_000 });
        break;
      } catch (e) {
        if (attempt === 2) throw e;
        await page.waitForTimeout(2000);
      }
    }
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('_lvl', JSON.stringify(1));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
  });

  // (a) Hero spawns at (21,19) on level 1
  test('Герой спавнится на позиции (21, 19)', async ({ page }) => {
    const lvl = await adapter.getLevel();
    expect(lvl).toBe(1);

    const pos = await adapter.getHeroPos();
    expect(pos).toBeTruthy();
    expect(pos!.x).toBe(21);
    expect(pos!.y).toBe(19);
    console.log('✅ Герой на (21, 19)');
  });

  // (b) 4 enemies present with correct default health
  test('Враги присутствуют и их 4 штуки с правильным здоровьем', async ({ page }) => {
    const enemies = await adapter.getEnemies();
    const count = enemies.length;
    expect(count).toBe(4);

    expect(enemies.length).toBe(4);

    // Все враги на уровне 1 имеют дефолтное здоровье (4)
    for (const enemy of enemies) {
      expect(enemy.health).toBe(4);
    }
    console.log('✅ 4 врага с правильным здоровьем (4/4)');
  });

  // (c) Enemy count is 4
  test('Количество врагов равно 4', async ({ page }) => {
    const count = await adapter.getEnemyCount();
    expect(count).toBe(4);
    console.log(`✅ Количество врагов: ${count}`);
  });

  // (d) All NPCs present at correct positions
  test('Все NPC присутствуют на правильных позициях', async ({ page }) => {
    const npcs = await adapter.getAllNpcs();
    const expectedNpcs = [
      { name: 'Бэтмен', x: 21, y: 7 },
      { name: 'Астоф', x: 21, y: 20 },
      { name: 'Кирил', x: 33, y: 4 },
    ];

    for (const expected of expectedNpcs) {
      const found = npcs.find(n => n.name === expected.name);
      expect(found, `NPC "${expected.name}" не найден`).toBeTruthy();
      expect(found!.x, `${expected.name} X`).toBe(expected.x);
      expect(found!.y, `${expected.name} Y`).toBe(expected.y);
    }
    console.log('✅ Все ключевые NPC на правильных позициях');
  });

  // (e) Бэтмен is initially hidden (visibility:false, life:false)
  test('Бэтмен изначально скрыт (visibility:false, life:false)', async ({ page }) => {
    // LEGACY: listNpcs() needed for .visibility/.life fields — not available via TestAdapter
    const npcs = await page.evaluate(() => window.May._test.listNpcs());
    const batman = npcs.find(n => n.name === 'Бэтмен');
    expect(batman).toBeTruthy();
    expect(batman!.visibility).toBe(false);
    expect(batman!.life).toBe(false);
    console.log('✅ Бэтмен скрыт: visibility=false, life=false');
  });

  // (f) Talking to Кирил activates Бэтмен (life becomes true)
  test('Разговор с Кирилом активирует Бэтмена (life=true)', async ({ page }) => {
    // LEGACY: listNpcs() needed for .life field — not available via TestAdapter
    // Проверяем что до разговора Batman life=false
    const beforeNpcs = await page.evaluate(() => window.May._test.listNpcs());
    const batmanBefore = beforeNpcs.find(n => n.name === 'Бэтмен');
    expect(batmanBefore!.life).toBe(false);

    // Разговариваем с Кирилом (farmerBob)
    await talkToNpc(page, adapter, 'Кирил', 33, 4);

    // LEGACY: listNpcs() needed for .life field — not available via TestAdapter
    // Проверяем что после разговора Batman life=true
    const afterNpcs = await page.evaluate(() => window.May._test.listNpcs());
    const batmanAfter = afterNpcs.find(n => n.name === 'Бэтмен');
    expect(batmanAfter!.life).toBe(true);
    console.log('✅ После farmerBob() Бэтмен активирован: life=true');
  });

  // (g) After farmerBob dialog, quest is "Найти подшутившего над Кирилом.."
  test('После farmerBob квест: "Найти подшутившего над Кирилом.."', async ({ page }) => {
    await talkToNpc(page, adapter, 'Кирил', 33, 4);
    await waitForQuest(page, adapter, 'Найти подшутившего над Кирилом..');
    console.log('✅ Квест: "Найти подшутившего над Кирилом.."');
  });

  // (h) Talking to Бэтмен triggers BatmenBoo dialog (long dialog, 27+ lines)
  test('Разговор с Бэтменом: BatmenBoo диалог (27+ реплик)', async ({ page }) => {
    // Сначала активируем Бэтмена через Кирила
    await talkToNpc(page, adapter, 'Кирил', 33, 4);
    await page.waitForTimeout(500);

    // LEGACY: listNpcs() needed for .life field — not available via TestAdapter
    // Убеждаемся что Бэтмен активирован
    const npcs = await page.evaluate(() => window.May._test.listNpcs());
    const batman = npcs.find(n => n.name === 'Бэтмен');
    expect(batman!.life).toBe(true);

    // Телепортируем к Бэтмену и запускаем диалог
    await adapter.teleport(20, 7);
    await page.waitForTimeout(500);
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(200);

    const started = await adapter.talkTo('Бэтмен');
    expect(started).toBe(true);
    await page.waitForTimeout(300);

    // Проверяем что диалог открылся
    const isOpen = await adapter.isDialogOpen();
    expect(isOpen).toBe(true);

    // Проверяем что диалог длинный (27+ реплик)
    const dialogInfo = await adapter.getDialogText();
    expect(dialogInfo).toBeTruthy();
    expect(dialogInfo!.total).toBeGreaterThanOrEqual(27);
    console.log(`✅ BatmenBoo диалог: ${dialogInfo!.total} реплик (≥27)`);

    // Прокликиваем до конца
    for (let i = 0; i < 50; i++) {
      const open = await adapter.isDialogOpen();
      if (!open) break;
      await page.keyboard.down('Space');
      await page.waitForTimeout(50);
      await page.keyboard.up('Space');
      await page.waitForTimeout(550);
    }
  });

  // (i) After BatmenBoo, Кирил code changes to famerBob1
  test('После BatmenBoo код Кирила меняется на famerBob1', async ({ page }) => {
    // Активируем Бэтмена через Кирила
    await talkToNpc(page, adapter, 'Кирил', 33, 4);
    await page.waitForTimeout(500);

    // Говорим с Бэтменом
    await talkToNpc(page, adapter, 'Бэтмен', 21, 7);
    await page.waitForTimeout(500);

    // LEGACY: listNpcs() needed for .code field — not available via TestAdapter
    // Проверяем что код Кирила изменился
    const npcs = await page.evaluate(() => window.May._test.listNpcs());
    const kiril = npcs.find(n => n.name === 'Кирил');
    expect(kiril).toBeTruthy();
    expect(kiril!.code).toContain('famerBob1');
    console.log(`✅ Код Кирила: ${kiril!.code}`);
  });

  // (j) Talking to Кирил (famerBob1) sets quest "Выкопать морковку"
  test('Разговор с Кирилом (famerBob1): квест "Выкопать морковку"', async ({ page }) => {
    // Полная цепочка: Кирил → Бэтмен → Кирил
    await talkToNpc(page, adapter, 'Кирил', 33, 4);
    await page.waitForTimeout(500);
    await talkToNpc(page, adapter, 'Бэтмен', 21, 7);
    await page.waitForTimeout(500);
    await talkToNpc(page, adapter, 'Кирил', 33, 4);

    await waitForQuest(page, adapter, 'Выкопать морковку');
    console.log('✅ Квест: "Выкопать морковку"');
  });

  // (k) All 6 NPCs are present on level 1 (includes non-quest NPCs)
  test('Все 6 NPC присутствуют на уровне 1', async ({ page }) => {
    const npcs = await adapter.getAllNpcs();
    expect(npcs.length).toBe(6);

    // Check all named NPCs exist
    const expectedNames = ['Бэтмен', 'Астоф', 'Кирил'];
    for (const name of expectedNames) {
      const found = npcs.find(n => n.name === name);
      expect(found, `NPC "${name}" не найден`).toBeTruthy();
    }

    // Verify there are also NPCs with face:13 (Ярик, Автор, "Я похож на настоящего..")
    const npcNames = npcs.map(n => n.name);
    const hasYarik = npcNames.some(n => n.includes('Ярик'));
    const hasAvtor = npcNames.some(n => n.includes('Автор'));
    expect(hasYarik, 'NPC Ярик не найден').toBe(true);
    expect(hasAvtor, 'NPC Автор не найден').toBe(true);
    console.log(`✅ Все ${npcs.length} NPC присутствуют на уровне 1`);
  });
});
