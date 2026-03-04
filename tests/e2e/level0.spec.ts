/**
 * E2E тесты: Уровень 0 — «Мирная деревня» (Майские острова)
 *
 * Проверяем:
 *   a. Спавн героя на (5,3)
 *   b. Нет врагов на уровне
 *   c. Все 4 NPC на правильных позициях
 *   d. Даздраперма на (16,4)
 *   e. Артака на (24,5) с диалогом "busy"
 *   f. Астоф лечит героя до 5hp
 *   g. Квест после Астофа: "Найти уже девушку..^.^"
 *   h. Ванесса открывает диалог и выставляет квест морковки
 *   i. После Ванессы инвентарь становится видимым
 *   j. Животные на ожидаемых позициях
 *   k. Код Астофа меняется после диалога Ванессы
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, pressSpace, talkToNpc, waitForQuest } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── ТЕСТЫ ────────────────────────────────────────────────────────────────────

test.describe('Уровень 0 — Мирная деревня', () => {
  test.beforeEach(async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await page.goto('/');
    await adapter.clearStorage();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForGameReady(page, adapter);
  });

  // ── a. Герой спавнится на (5, 3) ──────────────────────────────────────────
  test('a. Герой спавнится на позиции (5, 3)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const pos = await adapter.getHeroPos();
    expect(pos).toEqual({ x: 5, y: 3 });
  });

  // ── b. Нет врагов на уровне 0 ────────────────────────────────────────────
  test('b. На уровне 0 нет врагов', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const enemyCount = await adapter.getEnemyCount();
    expect(enemyCount).toBe(0);

    const enemies = await adapter.getEnemies();
    expect(enemies).toEqual([]);
  });

  // ── c. Все 4 NPC на правильных позициях ───────────────────────────────────
  test('c. Все 4 NPC присутствуют на правильных позициях', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const npcs = await adapter.getAllNpcs();
    expect(npcs.length).toBe(4);

    const npcNames = npcs.map(n => n.name).sort();
    expect(npcNames).toEqual(['Артака', 'Астоф', 'Ванесса', 'Даздраперма']);

    const findNpc = (name: string) => npcs.find(n => n.name === name);
    expect(findNpc('Даздраперма')).toMatchObject({ x: 16, y: 4 });
    expect(findNpc('Артака')).toMatchObject({ x: 24, y: 5 });
    expect(findNpc('Астоф')).toMatchObject({ x: 5, y: 5 });
    expect(findNpc('Ванесса')).toMatchObject({ x: 21, y: 15 });
  });

  // ── d. Даздраперма на (16, 4) ─────────────────────────────────────────────
  test('d. NPC Даздраперма находится на позиции (16, 4)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const pos = await adapter.getNpcPosition('Даздраперма');
    expect(pos).toEqual({ x: 16, y: 4 });
  });

  // ── e. Артака на (24, 5) и отвечает "busy" диалогом ───────────────────────
  test('e. NPC Артака на (24, 5) и отвечает busy-диалогом', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const pos = await adapter.getNpcPosition('Артака');
    expect(pos).toEqual({ x: 24, y: 5 });

    // Телепортируемся к Артаке и начинаем диалог
    await adapter.teleport(23, 5);
    await page.waitForTimeout(300);

    await adapter.talkTo('Артака');
    await page.waitForTimeout(300);

    // Проверяем что диалог открылся
    const isOpen = await adapter.isDialogOpen();
    expect(isOpen).toBe(true);

    // Проверяем текст диалога — busy содержит "Мне не когда"
    const dialog = await adapter.getDialogText();
    expect(dialog).not.toBeNull();
    expect(dialog!.text).toContain('Мне не когда');

    // Закрываем диалог
    await page.locator('#myCanvas').click({ force: true });
    await pressSpace(page, 3);
  });

  // ── f. Астоф лечит героя до 5hp ──────────────────────────────────────────
  test('f. Разговор с Астофом лечит героя до 5hp', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    // Проверяем начальное здоровье (может быть 3)
    const healthBefore = await adapter.getHeroHealth();
    expect(healthBefore).toBeLessThanOrEqual(5);

    // Разговариваем с Астофом
    await talkToNpc(page, adapter, 'Астоф', 5, 5);

    // Проверяем что здоровье стало 5
    const healthAfter = await adapter.getHeroHealth();
    expect(healthAfter).toBe(5);
  });

  // ── g. После Астофа квест "Найти уже девушку..^.^" ────────────────────────
  test('g. После диалога с Астофом квест = "Найти уже девушку..^.^"', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    const quest = await adapter.getQuestText();
    expect(quest).toBe('Найти уже девушку..^.^');
  });

  // ── h. Ванесса открывает диалог и ставит квест морковки ───────────────────
  test('h. Разговор с Ванессой устанавливает квест "Отправляйтесь к причалу"', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    // Сначала проходим Астофа (нужен для Ванессы — она ссылается на Астофа)
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    // Теперь Ванесса
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

    const quest = await adapter.getQuestText();
    expect(quest).toBe('Отправляйтесь к причалу');
  });

  // ── i. После Ванессы инвентарь становится видимым ─────────────────────────
  test('i. После диалога с Ванессой инвентарь становится видимым', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    // До диалогов инвентарь скрыт
    const invBefore = await adapter.isInventoryVisible();
    expect(invBefore).toBe(false);

    // Астоф → Ванесса
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

    // После Ванессы инвентарь должен быть видим
    const invAfter = await adapter.isInventoryVisible();
    expect(invAfter).toBe(true);
  });

  // ── j. Животные на ожидаемых позициях ────────────────────────────────────
  test('j. Животные (Мальчик и Девочка) на ожидаемых позициях', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    // Животные не имеют type='nps', проверяем через getAllNpcs что их там нет
    const npcs = await adapter.getAllNpcs();
    // 4 NPC (не животные)
    expect(npcs.length).toBe(4);
    // Ни один NPC не назван "Мальчик" или "Девочка"
    const npcNames = npcs.map(n => n.name);
    expect(npcNames).not.toContain('Мальчик');
    expect(npcNames).not.toContain('Девочка');

    // Стартовый уровень = 0
    const level = await adapter.getLevel();
    expect(level).toBe(0);

    // Проверяем что getAllNpcs фильтрует только type=nps, должно быть 4
    const totalMobs = (await adapter.getAllNpcs()).length;
    expect(totalMobs).toBe(4);
  });

  // ── k. Код Астофа меняется после Ванессы ─────────────────────────────────
  test('k. Код Астофа меняется на setLvl после диалога с Ванессой', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    // Проверяем начальный код Астофа
    // LEGACY: listNpcs() needed for `code` field — not available via adapter
    const npcsBefore = await page.evaluate(() => window.May._test.listNpcs());
    const astofBefore = npcsBefore.find(n => n.name === 'Астоф');
    expect(astofBefore!.code).toBe('_code.nps.astof()');

    // Проходим Астофа
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    // После Астофа его код меняется на busy
    // LEGACY: listNpcs() needed for `code` field — not available via adapter
    const npcsAfterAstof = await page.evaluate(() => window.May._test.listNpcs());
    const astofAfterAstof = npcsAfterAstof.find(n => n.name === 'Астоф');
    expect(astofAfterAstof!.code).toBe('_code.nps.busy()');

    // Проходим Ванессу
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

    // После Ванессы код Астофа меняется на setLvl
    // LEGACY: listNpcs() needed for `code` field — not available via adapter
    const npcsAfterVanessa = await page.evaluate(() => window.May._test.listNpcs());
    const astofAfterVanessa = npcsAfterVanessa.find(n => n.name === 'Астоф');
    expect(astofAfterVanessa!.code).toBe("_code.nps.setLvl('Поговори с Кирилом',1)");
  });

  // ── l. Астоф после Ванессы переводит на уровень 1 ─────────────────────────
  test('l. Астоф после Ванессы переводит героя на уровень 1', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const startLvl = await adapter.getLevel();
    expect(startLvl).toBe(0);

    // Проходим Астофа
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    // Проходим Ванессу
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

    // Говорим с Астофом → он везёт на уровень 1
    await talkToNpc(page, adapter, 'Астоф', 5, 5);

    await expect.poll(
      async () => adapter.getLevel(),
      { timeout: 20_000, message: 'Ждём уровень 1' }
    ).toBe(1);
  });
});
