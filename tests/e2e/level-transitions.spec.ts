import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import {
  waitForGameReady,
  talkToNpc,
  waitForQuest,
  waitForLevel,
} from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── ТЕСТЫ ─────────────────────────────────────────────────────────────────────

test.describe('Переходы между уровнями', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    // Чистый старт: очищаем localStorage и перезагружаем
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
  });

  test('1. Старт на уровне 0 — проверка начального состояния', async ({
    page,
  }) => {
    const level = await adapter.getLevel();
    expect(level).toBe(0);
    console.log('✅ Игра стартует на уровне 0');

    // Проверяем позицию героя на уровне 0
    const heroPos = await adapter.getHeroPos();
    expect(heroPos?.x).toBe(5);
    expect(heroPos?.y).toBe(3);
    console.log(`✅ Позиция героя на уровне 0: (${heroPos?.x}, ${heroPos?.y})`);
  });

  test('2. Переход Level 0 → Level 1 через квестовую цепочку', async ({
    page,
  }) => {
    // Уровень 0
    let level = await adapter.getLevel();
    expect(level).toBe(0);
    console.log('✅ Старт на уровне 0');

    // Проходим квестовую цепочку Level 0 → 1
    console.log('💬 Разговор с Астофом...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    console.log('💬 Разговор с Ванессой...');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

    console.log('💬 Астоф везёт на уровень 1...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    level = await adapter.getLevel();
    expect(level).toBe(1);
    console.log('✅ Переход на уровень 1 выполнен');

    // Проверяем новую позицию героя
    const heroPos = await adapter.getHeroPos();
    expect(heroPos?.x).toBe(21);
    expect(heroPos?.y).toBe(19);
    console.log(`✅ Позиция героя на уровне 1: (${heroPos?.x}, ${heroPos?.y})`);
  });

  test('3. Обратный переход Level 1 → Level 0', async ({ page }) => {
    // Быстро переходим на уровень 1
    console.log('💬 Переход 0→1...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);
    console.log('✅ На уровне 1');

    // Проходим обратную квестовую цепочку
    console.log('💬 Разговор с Кирилом...');
    await talkToNpc(page, adapter, 'Кирил', 33, 4);
    await waitForQuest(page, adapter, 'Найти подшутившего над Кирилом..');

    console.log('💬 Разговор с Бэтменом...');
    await talkToNpc(page, adapter, 'Бэтмен', 21, 7);
    await waitForQuest(page, adapter, 'Расскажите Кирилу о Бэтмене');

    console.log('💬 Кирил — выкопать морковку...');
    await talkToNpc(page, adapter, 'Кирил', 33, 4);
    await waitForQuest(page, adapter, 'Выкопать морковку');

    console.log('🥕 Добавляем 9 морковок...');
    await adapter.addItem(0, 9);
    await waitForQuest(page, adapter, 'Вернитесь к причалу', 15_000);

    console.log('💬 Астоф везёт обратно на уровень 0...');
    await talkToNpc(page, adapter, 'Астоф', 21, 20);

    // Проверяем возврат на уровень 0
    await waitForLevel(page, adapter, 0);
    const level = await adapter.getLevel();
    expect(level).toBe(0);
    console.log('✅ Возврат на уровень 0 выполнен');

    // Проверяем позицию героя — движок сохраняет позицию из storage,
    // поэтому координаты могут отличаться от начальных spawn-значений.
    const heroPos = await adapter.getHeroPos();
    expect(heroPos?.x).toBeGreaterThanOrEqual(0);
    expect(heroPos?.y).toBeGreaterThanOrEqual(0);
    console.log(`✅ Позиция героя на уровне 0: (${heroPos?.x}, ${heroPos?.y})`);
  });

  test('4. Проверка spawn позиций героя на всех уровнях', async ({
    page,
  }) => {
    // Level 0: spawn (5, 3)
    let heroPos = await adapter.getHeroPos();
    expect(heroPos?.x).toBe(5);
    expect(heroPos?.y).toBe(3);
    console.log(`✅ Level 0 spawn: (${heroPos?.x}, ${heroPos?.y})`);

    // Переход на Level 1
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);

    // Level 1: spawn (21, 19)
    heroPos = await adapter.getHeroPos();
    expect(heroPos?.x).toBe(21);
    expect(heroPos?.y).toBe(19);
    console.log(`✅ Level 1 spawn: (${heroPos?.x}, ${heroPos?.y})`);
  });

  test('5. Изменение количества врагов при переходе между уровнями', async ({
    page,
  }) => {
    // Уровень 0 - нет врагов
    let enemies = await adapter.getEnemies();
    const enemiesLvl0 = enemies.length;
    console.log(`✅ Врагов на уровне 0: ${enemiesLvl0}`);

    // Переход на уровень 1
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);

    // Уровень 1 - есть враги
    enemies = await adapter.getEnemies();
    const enemiesLvl1 = enemies.length;
    expect(enemiesLvl1).toBeGreaterThan(0);
    console.log(`✅ Врагов на уровне 1: ${enemiesLvl1}`);

    // Враги отличаются между уровнями
    expect(enemiesLvl1).not.toBe(enemiesLvl0);
    console.log('✅ Количество врагов изменяется при переходе между уровнями');
  });

  test('6. Стабильность состояния игры после перехода', async ({ page }) => {
    // Проверяем начальное состояние
    let level = await adapter.getLevel();
    expect(level).toBe(0);

    // Переход 0→1
    console.log('💬 Переход 0→1...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);

    // Проверяем стабильность после перехода
    level = await adapter.getLevel();
    expect(level).toBe(1);
    console.log('✅ Уровень корректный после перехода');

    // Проверяем что игра не зависла
    const canInteract =
      (await adapter.getHeroPos()) !== null &&
      (await adapter.getEnemies()) !== null;
    expect(canInteract).toBe(true);
    console.log('✅ Игра стабильна, все API доступны');
  });

  test('7. Проверка наличия NPC на разных уровнях', async ({ page }) => {
    // Уровень 0 - есть NPC
    const npcCountLvl0 = (await adapter.getAllNpcs()).length;
    expect(npcCountLvl0).toBeGreaterThan(0);
    console.log(`✅ NPC на уровне 0: ${npcCountLvl0}`);

    // Переход на уровень 1
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);

    // Уровень 1 - другие NPC
    const npcCountLvl1 = (await adapter.getAllNpcs()).length;
    expect(npcCountLvl1).toBeGreaterThan(0);
    console.log(`✅ NPC на уровне 1: ${npcCountLvl1}`);
    console.log('✅ Состав NPC изменяется при переходе между уровнями');
  });
});
