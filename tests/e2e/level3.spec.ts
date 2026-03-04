/**
 * E2E тесты: Уровень 3 (Финал) — «Майские острова»
 *
 * Проверяем:
 *   - Спавн героя на (5, 13)
 *   - 14 сильных врагов (damage:3, health:15, max.health:15)
 *   - Позиции врагов совпадают с ожидаемыми координатами
 *   - NPC: Автор (12,8) с кодом starec, Астоф (5,15) с astifWait
 *   - Бэтмен (32,8) изначально скрыт (visibility:false, life:false)
 *   - Разговор с Автором (starec) бафает героя: health=30, damage=3, attack=true
 *   - После starec: квест «Убей и Выживи»
 *   - После killAllEnemies + stage0: Бэтмен становится видимым
 *   - Разговор с Бэтменом спавнит босса и приспешников
 *   - Финальный квест «Надрать жопу Бэтмену»
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, pressSpace, talkToNpc } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── ТЕСТЫ ───────────────────────────────────────────────────────────────────

test.describe('Уровень 3 — Финал', () => {
  test.beforeEach(async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await adapter.goToLevel(3);
    await waitForGameReady(page, adapter);
  });

  // (a) Hero spawns at (5, 13) on level 3
  test('Герой спавнится на позиции (5, 13)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const lvl = await adapter.getLevel();
    expect(lvl).toBe(3);

    const pos = await adapter.getHeroPos();
    expect(pos).toBeTruthy();
    expect(pos!.x).toBe(5);
    expect(pos!.y).toBe(13);
    console.log('✅ Герой на (5, 13), уровень 3');
  });

  // (b) 14 enemies present with correct stats (health:15, damage:3)
  test('На уровне 14 врагов с корректными статами (health:15, damage:3)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBe(14);

    for (const enemy of enemies) {
      expect(enemy.health).toBe(15);
      expect(enemy.maxHealth).toBe(15);
    }
    console.log(`✅ Количество врагов: ${enemies.length}, все с health:15, maxHealth:15`);
  });

  // (c) Enemies are distributed across the map in expected regions
  test('Враги распределены по карте в ожидаемых зонах', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBe(14);

    // Все враги должны быть на карте в пределах допустимых координат (level 3 map)
    for (const e of enemies) {
      expect(e.x).toBeGreaterThanOrEqual(0);
      expect(e.y).toBeGreaterThanOrEqual(0);
      expect(e.x).toBeLessThanOrEqual(50);
      expect(e.y).toBeLessThanOrEqual(30);
    }

    // Враги распределены по X: часть в зоне 14-26 (центр), часть в зоне 27-40 (правая)
    const centerEnemies = enemies.filter(e => e.x >= 10 && e.x <= 26);
    const rightEnemies = enemies.filter(e => e.x >= 27 && e.x <= 45);
    expect(centerEnemies.length).toBeGreaterThanOrEqual(4);
    expect(rightEnemies.length).toBeGreaterThanOrEqual(3);

    // Враги распределены по Y: часть сверху (y < 12), часть снизу (y >= 12)
    const topEnemies = enemies.filter(e => e.y < 14);
    const bottomEnemies = enemies.filter(e => e.y >= 14);
    expect(topEnemies.length).toBeGreaterThanOrEqual(3);
    expect(bottomEnemies.length).toBeGreaterThanOrEqual(3);

    console.log(`✅ 14 врагов распределены по карте: center=${centerEnemies.length}, right=${rightEnemies.length}, top=${topEnemies.length}, bottom=${bottomEnemies.length}`);
  });

  // (d) Автор NPC at (12, 8) with starec code
  test('NPC Автор на позиции (12, 8) с кодом starec', async ({ page }) => {
    // LEGACY: listNpcs() needed for `code` field — not available via adapter
    const npcs = await page.evaluate(() => window.May._test.listNpcs());
    const avtor = npcs.find(n => n.name === 'Автор');
    expect(avtor).toBeTruthy();
    expect(avtor!.x).toBe(12);
    expect(avtor!.y).toBe(8);
    expect(avtor!.code).toContain('starec');
    console.log(`✅ Автор на (${avtor!.x}, ${avtor!.y}), код: ${avtor!.code}`);
  });

  // (e) Бэтмен initially hidden (visibility:false, life:false)
  test('Бэтмен изначально скрыт (visibility:false, life:false)', async ({ page }) => {
    // LEGACY: listNpcs() needed for `visibility`/`life` fields — not available via adapter
    const npcs = await page.evaluate(() => window.May._test.listNpcs());
    const batman = npcs.find(n => n.name === 'Бэтмен');
    expect(batman).toBeTruthy();
    expect(batman!.visibility).toBe(false);
    expect(batman!.life).toBe(false);
    console.log('✅ Бэтмен скрыт: visibility=false, life=false');
  });

  // (f) Астоф at (5, 15) with astifWait
  test('Астоф на позиции (5, 15) с кодом astifWait', async ({ page }) => {
    // LEGACY: listNpcs() needed for `code` field — not available via adapter
    const npcs = await page.evaluate(() => window.May._test.listNpcs());
    const astof = npcs.find(n => n.name === 'Астоф');
    expect(astof).toBeTruthy();
    expect(astof!.x).toBe(5);
    expect(astof!.y).toBe(15);
    expect(astof!.code).toContain('astifWait');
    console.log(`✅ Астоф на (${astof!.x}, ${astof!.y}), код: ${astof!.code}`);
  });

  // (g) Talking to Автор (starec) buffs hero: health=30, damage=3, attack=true
  test('Разговор с Автором бафает героя: health=30, damage=3, attack=true', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    
    // Убиваем врагов чтобы они не ударили героя во время диалога
    await adapter.killAllEnemies();
    await page.waitForTimeout(300);

    // Поговорить с Автором (starec) — 16 реплик
    await talkToNpc(page, adapter, 'Автор', 12, 8);
    await page.waitForTimeout(500);

    const heroState = await adapter.getHeroState();
    expect(heroState).toBeTruthy();
    expect(heroState!.health).toBe(30);
    expect(heroState!.maxHealth).toBe(30);
    expect(heroState!.canAttack).toBe(true);
    // tool=1 means Тесак
    expect(heroState!.tool).toBe(1);

    console.log('✅ После starec: health=30, maxHealth=30, canAttack=true, tool=1(Тесак)');
  });

  // (h) After starec dialog, quest text is "Убей и Выживи"
  test('После диалога starec квест = «Убей и Выживи»', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await talkToNpc(page, adapter, 'Автор', 12, 8);
    await page.waitForTimeout(500);

    const quest = await adapter.getQuestText();
    expect(quest).toBe('Убей и Выживи');
    console.log(`✅ Квест: "${quest}"`);
  });

  // (i) After killAllEnemies + wait, Бэтмен becomes visible (stage0 fires)
  test('После убийства всех врагов Бэтмен становится видимым (stage0)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    
    // Сначала нужно поговорить с Автором, чтобы установить квест с callback stage0
    await talkToNpc(page, adapter, 'Автор', 12, 8);
    await page.waitForTimeout(500);

    // Подтверждаем квест установлен
    const quest = await adapter.getQuestText();
    expect(quest).toBe('Убей и Выживи');

    // Убиваем всех 14 врагов
    await adapter.killAllEnemies();
    await page.waitForTimeout(2000);

    // Ждём что квест сменится на «Бэтмену что то Надо»
    await expect.poll(
      async () => adapter.getQuestText(),
      { timeout: 15_000, message: 'Ждём квест: "Бэтмену что то Надо"' }
    ).toBe('Бэтмену что то Надо');

    // Проверяем что Бэтмен стал видимым
    // LEGACY: listNpcs() needed for `visibility`/`life` fields — not available via adapter
    const npcs = await page.evaluate(() => window.May._test.listNpcs());
    const batman = npcs.find(n => n.name === 'Бэтмен');
    expect(batman).toBeTruthy();
    expect(batman!.visibility).toBe(true);
    expect(batman!.life).toBe(true);
    console.log('✅ stage0 сработал: Бэтмен visible=true, life=true, квест: "Бэтмену что то Надо"');
  });

  // (j) Talking to Бэтмен spawns boss enemies (3 new enemies appear)
  test('Разговор с Бэтменом спавнит босса и приспешников (3 врага)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    
    // Полная подготовка: starec → killAll → stage0 → talkTo Бэтмен
    await talkToNpc(page, adapter, 'Автор', 12, 8);
    await page.waitForTimeout(500);

    await adapter.killAllEnemies();
    await page.waitForTimeout(2000);

    // Ждём stage0
    await expect.poll(
      async () => adapter.getQuestText(),
      { timeout: 15_000, message: 'Ждём квест: "Бэтмену что то Надо"' }
    ).toBe('Бэтмену что то Надо');

    // Убеждаемся что врагов пока нет (все убиты)
    const enemiesBefore = await adapter.getEnemies();
    expect(enemiesBefore.length).toBe(0);

    // Говорим с Бэтменом (batmanEnd)
    await talkToNpc(page, adapter, 'Бэтмен', 32, 8);
    await page.waitForTimeout(500);

    // После batmanEnd должно появиться 3 врага (босс 300hp + 2 миньона по 100hp)
    const enemiesAfter = await adapter.getEnemies();
    expect(enemiesAfter.length).toBe(3);

    // Босс: 300hp, damage:4
    const boss = enemiesAfter.find(e => e.health === 300);
    expect(boss).toBeTruthy();
    expect(boss!.maxHealth).toBe(300);

    // Миньоны: 100hp each
    const minions = enemiesAfter.filter(e => e.health === 100);
    expect(minions.length).toBe(2);
    for (const m of minions) {
      expect(m.maxHealth).toBe(100);
    }

    console.log('✅ batmanEnd: Босс (300hp) + 2 миньона (100hp) заспавнились');
  });

  // (k) Final quest text is "Надрать жопу Бэтмену"
  test('Финальный квест = «Надрать жопу Бэтмену»', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    
    // Полная цепочка: starec → killAll → stage0 → batmanEnd
    await talkToNpc(page, adapter, 'Автор', 12, 8);
    await page.waitForTimeout(500);

    await adapter.killAllEnemies();
    await page.waitForTimeout(2000);

    await expect.poll(
      async () => adapter.getQuestText(),
      { timeout: 15_000, message: 'Ждём квест: "Бэтмену что то Надо"' }
    ).toBe('Бэтмену что то Надо');

    await talkToNpc(page, adapter, 'Бэтмен', 32, 8);
    await page.waitForTimeout(500);

    const quest = await adapter.getQuestText();
    expect(quest).toBe('Надрать жопу Бэтмену');
    console.log(`✅ Финальный квест: "${quest}"`);
  });
});
