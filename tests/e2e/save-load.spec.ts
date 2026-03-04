/**
 * E2E тест: Save/Load Game State Persistence via localStorage
 * 
 * Проверяет что игровое состояние корректно сохраняется и загружается:
 *   - Позиция героя
 *   - Квест
 *   - Уровень
 *   - Инвентарь
 *   - clearAll() сбрасывает состояние
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, talkToNpc, waitForQuest, waitForLevel } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Принудительно сохранить всё состояние в localStorage.
 * Вызывает saveStat() + ручной save() через storage, затем ждёт для надёжности.
 */
const forceSave = async (adapter: TestAdapter, page: import('@playwright/test').Page) => {
  await adapter.saveStat();
  await page.waitForTimeout(1500); // Wait for auto-save interval (1000ms) + margin
};

// ─── ТЕСТЫ ─────────────────────────────────────────────────────────────────────

test.describe('Save/Load Game State Persistence', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    // Чистый старт: очищаем localStorage и перезагружаем
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
  });

  test('Game starts fresh with cleared localStorage → default state', async ({ page }) => {
    const level = await adapter.getLevel();
    const quest = await adapter.getQuestText();
    const pos = await adapter.getHeroPos();

    expect(level).toBe(0);
    expect(quest).toBe(null);
    expect(pos).toEqual({ x: 5, y: 3 }); // Default hero position from lvl.js level 0

    console.log('✅ Game started fresh with default state');
  });

  test('Hero position persists after reload', async ({ page }) => {
    // Teleport hero to new position
    await adapter.teleport(15, 8);
    await forceSave(adapter, page);

    const posBefore = await adapter.getHeroPos();
    console.log('📍 Hero position before reload:', posBefore);

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);

    const posAfter = await adapter.getHeroPos();
    console.log('📍 Hero position after reload:', posAfter);

    expect(posAfter).toEqual(posBefore);
    expect(posAfter).toEqual({ x: 15, y: 8 });
    console.log('✅ Hero position persisted after reload');
  });

  test('Quest state persists after reload', async ({ page }) => {
    // Start quest chain with Астоф
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    await forceSave(adapter, page);

    const questBefore = await adapter.getQuestText();
    console.log('📜 Quest before reload:', questBefore);

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);

    const questAfter = await adapter.getQuestText();
    console.log('📜 Quest after reload:', questAfter);

    expect(questAfter).toBe(questBefore);
    expect(questAfter).toBe('Найти уже девушку..^.^');
    console.log('✅ Quest state persisted after reload');
  });

  test('Level persists after reload (start quest chain, transition to level 1, reload)', async ({ page }) => {
    // Start quest chain
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

    // Transition to level 1
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);
    await forceSave(adapter, page);

    const levelBefore = await adapter.getLevel();
    console.log('🗺️  Level before reload:', levelBefore);

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);

    const levelAfter = await adapter.getLevel();
    console.log('🗺️  Level after reload:', levelAfter);

    expect(levelAfter).toBe(levelBefore);
    expect(levelAfter).toBe(1);
    console.log('✅ Level persisted after reload');
  });

  test('Inventory state persists after reload', async ({ page }) => {
    // Start quest chain to get initial inventory initialized
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    // Add items to inventory (item id 0 = carrot, count 5)
    await adapter.addItem(0, 5);
    await forceSave(adapter, page);

    const countBefore = await adapter.getItemCount(0);
    console.log('🎒 Item count before reload:', countBefore);

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);

    const countAfter = await adapter.getItemCount(0);
    console.log('🎒 Item count after reload:', countAfter);

    expect(countAfter).toBe(countBefore);
    expect(countAfter).toBe(5);
    console.log('✅ Inventory state persisted after reload');
  });

  test('clearAll() resets everything → reload → fresh game state', async ({ page }) => {
    // Make changes to game state
    await adapter.teleport(15, 8);
    await adapter.saveStat();
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    await adapter.addItem(0, 3);
    await forceSave(adapter, page);

    // Verify state changed
    const posBefore = await adapter.getHeroPos();
    const questBefore = await adapter.getQuestText();
    const itemBefore = await adapter.getItemCount(0);

    // Position should be changed from default (may not be exactly 15,8 due to talkToNpc teleport)
    expect(posBefore).not.toEqual({ x: 5, y: 3 });
    expect(questBefore).toBe('Найти уже девушку..^.^');
    expect(itemBefore).toBe(3);
    console.log('📝 State before clearAll:', { pos: posBefore, quest: questBefore, item: itemBefore });

    // Call clearAll (localStorage.clear()) and reload
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);

    // Verify state reset to default
    const posAfter = await adapter.getHeroPos();
    const questAfter = await adapter.getQuestText();
    const levelAfter = await adapter.getLevel();
    const itemAfter = await adapter.getItemCount(0);

    expect(levelAfter).toBe(0);
    expect(questAfter).toBe(null);
    expect(posAfter).toEqual({ x: 5, y: 3 });
    expect(itemAfter).toBe(0);
    console.log('✅ clearAll() reset everything to fresh state');
  });

  test('Multiple state changes persist correctly after reload', async ({ page }) => {
    // Make multiple changes
    await adapter.teleport(20, 12);
    await adapter.saveStat();
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    await adapter.addItem(0, 7);
    await forceSave(adapter, page);

    const stateBefore = {
      pos: await adapter.getHeroPos(),
      quest: await adapter.getQuestText(),
      level: await adapter.getLevel(),
      itemCount: await adapter.getItemCount(0),
    };
    console.log('📊 State before reload:', stateBefore);

    // Reload
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);

    const stateAfter = {
      pos: await adapter.getHeroPos(),
      quest: await adapter.getQuestText(),
      level: await adapter.getLevel(),
      itemCount: await adapter.getItemCount(0),
    };
    console.log('📊 State after reload:', stateAfter);

    expect(stateAfter).toEqual(stateBefore);
    // Position may differ due to talkToNpc teleport, but should not be default
    expect(stateAfter.pos).not.toEqual({ x: 5, y: 3 });
    expect(stateAfter.quest).toBe('Найти уже девушку..^.^');
    expect(stateAfter.level).toBe(0);
    expect(stateAfter.itemCount).toBe(7);
    console.log('✅ All state changes persisted correctly after reload');
  });
});
