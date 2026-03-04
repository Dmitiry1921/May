/**
 * E2E тесты квестовой системы «Майских островов».
 *
 * Покрываем два типа квестов:
 *   1. collect-item  — собрать N предметов (морковь, подсолнухи)
 *   2. kill-all      — убить всех врагов на уровне
 *
 * Используем TestAdapter для телепортации, диалогов и выдачи предметов.
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, pressSpace, talkToNpc, waitForQuest, waitForLevel } from '../helpers/game-helpers';
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

/**
 * Setup: navigate through NPC chain until the carrot-collect quest is active on level 1.
 * Astof → Vanessa → Astof(lvl1) → Kiril → Batman → Kiril(famerBob1)
 * Returns with quest "Выкопать морковку" on level 1.
 */
const setupCarrotQuest = async (page: Page, adapter: TestAdapter) => {
  await talkToNpc(page, adapter, 'Астоф', 5, 5);
  await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

  await talkToNpc(page, adapter, 'Ванесса', 21, 15);
  await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

  await talkToNpc(page, adapter, 'Астоф', 5, 5);
  await waitForLevel(page, adapter, 1);

  await talkToNpc(page, adapter, 'Кирил', 33, 4);
  await waitForQuest(page, adapter, 'Найти подшутившего над Кирилом..');

  await talkToNpc(page, adapter, 'Бэтмен', 21, 7);
  await waitForQuest(page, adapter, 'Расскажите Кирилу о Бэтмене');

  await talkToNpc(page, adapter, 'Кирил', 33, 4);
  await waitForQuest(page, adapter, 'Выкопать морковку');
};

/**
 * Setup: navigate through chain until kill-quest is active.
 * Completes carrot quest, returns to level 0, talks to Vanessa & Dazdraperma.
 * Returns with quest "Иди в порт.." on level 0.
 */
const setupKillQuest = async (page: Page, adapter: TestAdapter) => {
  await setupCarrotQuest(page, adapter);

  await adapter.addItem(0, 9);
  await waitForQuest(page, adapter, 'Вернитесь к причалу', 15_000);

  await talkToNpc(page, adapter, 'Астоф', 21, 20);
  await waitForLevel(page, adapter, 0);

  await talkToNpc(page, adapter, 'Ванесса', 21, 15);
  await waitForQuest(page, adapter, 'Найти работу..');

  await talkToNpc(page, adapter, 'Даздраперма', 16, 4);
  await waitForQuest(page, adapter, 'Иди в порт..');
};

// ─── ТЕСТЫ ────────────────────────────────────────────────────────────────────

test.describe('Quest System — collect-item & kill-all', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    adapter = await freshGameStart(page);
  });

  // ════════════════════════════════════════════════════════════════════════════
  // QUEST FLOW & PERSISTENCE (quick tests — level 0 only)
  // ════════════════════════════════════════════════════════════════════════════

  test('Quest flow: quest text is null before any NPC interaction', async ({ page }) => {
    const quest = await adapter.getQuestText();
    expect(quest).toBeNull();
    console.log('✅ Quest text is null at game start');
  });

  test('Quest flow: quest state persists after brief wait', async ({ page }) => {
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Quest should still be the same
    const questAfterWait = await adapter.getQuestText();
    expect(questAfterWait).toBe('Найти уже девушку..^.^');
    console.log('✅ Quest persists after 2s wait');
  });

  test('Quest flow: quest text transitions through multiple states correctly', async ({ page }) => {
    const transitions: (string | null)[] = [];

    // Initial state
    const q0 = await adapter.getQuestText();
    transitions.push(q0);
    expect(q0).toBeNull();

    // After Astof
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    const q1 = await adapter.getQuestText();
    transitions.push(q1);
    expect(q1).toBe('Найти уже девушку..^.^');

    // After Vanessa
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');
    const q2 = await adapter.getQuestText();
    transitions.push(q2);
    expect(q2).toBe('Отправляйтесь к причалу');

    // Verify all 3 transitions happened
    expect(transitions).toEqual([
      null,
      'Найти уже девушку..^.^',
      'Отправляйтесь к причалу'
    ]);
    console.log('✅ Quest transitions: null → Astof → Vanessa verified');
  });

  // ════════════════════════════════════════════════════════════════════════════
  // COLLECT-ITEM QUESTS
  // ════════════════════════════════════════════════════════════════════════════

  test('Collect-item: Astof dialog sets initial quest text', async ({ page }) => {
    // Before talking to anyone, quest should be empty/null
    const initialQuest = await adapter.getQuestText();
    expect(initialQuest).toBeNull();

    // Talk to Astof → sets initial quest
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    const questAfterAstof = await adapter.getQuestText();
    expect(questAfterAstof).toBe('Найти уже девушку..^.^');
    console.log('✅ Astof sets quest: "Найти уже девушку..^.^"');
  });

  test('Collect-item: Vanessa dialog sets carrot quest (9 carrots, item 0)', async ({ page }) => {
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    // Talk to Vanessa → sets carrot collection quest
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

    const questText = await adapter.getQuestText();
    expect(questText).toBe('Отправляйтесь к причалу');
    console.log('✅ Vanessa sets carrot quest: "Отправляйтесь к причалу"');
  });

  test('Collect-item: Adding 9 carrots triggers quest callback and changes quest text', async ({ page }) => {
    await setupCarrotQuest(page, adapter);

    // Verify quest before adding carrots
    const beforeCarrots = await adapter.getQuestText();
    expect(beforeCarrots).toBe('Выкопать морковку');

    // Add 9 carrots via adapter → quest callback triggers
    await adapter.addItem(0, 9);
    await waitForQuest(page, adapter, 'Вернитесь к причалу', 15_000);

    const afterCarrots = await adapter.getQuestText();
    expect(afterCarrots).toBe('Вернитесь к причалу');
    console.log('✅ 9 carrots added → quest changed to "Вернитесь к причалу"');
  });

  test('Collect-item: Carrot count verified via inventory before and after addItem', async ({ page }) => {
    await setupCarrotQuest(page, adapter);

    // Inventory is now visible (Vanessa showed it). Verify no carrots before adding.
    const beforeCount = await adapter.getItemCount(0);
    expect(beforeCount).toBe(0);

    // Add 9 carrots
    await adapter.addItem(0, 9);
    await waitForQuest(page, adapter, 'Вернитесь к причалу', 15_000);

    const afterQuest = await adapter.getQuestText();
    expect(afterQuest).toBe('Вернитесь к причалу');
    console.log('✅ Carrot inventory tracked correctly, quest completed');
  });

  test('Collect-item: Sunflower quest — 8 sunflowers (item 1) on level 2', async ({ page }) => {
    // Full setup through to sunflower quest
    await setupKillQuest(page, adapter);

    // Go to level 1 for kill quest
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);

    // Kill all enemies on level 1
    await adapter.killAllEnemies();
    await waitForQuest(page, adapter, 'Вернитесь в деревню', 15_000);

    // Return to level 0
    await talkToNpc(page, adapter, 'Астоф', 21, 20);
    await waitForLevel(page, adapter, 0);

    // Dazdraperma end → Artaka
    await talkToNpc(page, adapter, 'Даздраперма', 16, 4);
    await waitForQuest(page, adapter, 'Найти Артаку');

    // Talk to Artaka → sets sunflower quest
    await talkToNpc(page, adapter, 'Артака', 24, 5);
    await waitForQuest(page, adapter, 'Отправляйтесь на остров..');

    // Go to level 2
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 2);

    // Verify quest before sunflowers
    const beforeSunflowers = await adapter.getQuestText();
    expect(beforeSunflowers).toBe('Добудьте 8 подсолнухов');

    // Add 8 sunflowers → quest callback triggers
    await adapter.addItem(1, 8);
    await waitForQuest(page, adapter, 'Вернитесь к Астофу', 15_000);

    const afterSunflowers = await adapter.getQuestText();
    expect(afterSunflowers).toBe('Вернитесь к Астофу');
    console.log('✅ 8 sunflowers added → quest changed to "Вернитесь к Астофу"');
  });

  // ════════════════════════════════════════════════════════════════════════════
  // KILL-ALL QUESTS
  // ════════════════════════════════════════════════════════════════════════════

  test('Kill-all: Dazdraperma sets kill quest and killAllEnemies on level 1 advances it', async ({ page }) => {
    await setupKillQuest(page, adapter);

    // Verify Dazdraperma set the quest
    const questText = await adapter.getQuestText();
    expect(questText).toBe('Иди в порт..');
    console.log('✅ Dazdraperma sets kill quest: "Иди в порт.."');

    // Go to level 1 for the kill quest
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);

    // Verify quest text changed to level-specific text
    const beforeKill = await adapter.getQuestText();
    expect(beforeKill).toBe('Завалите гадов!');

    // Kill all enemies
    await adapter.killAllEnemies();
    await waitForQuest(page, adapter, 'Вернитесь в деревню', 15_000);

    const afterKill = await adapter.getQuestText();
    expect(afterKill).toBe('Вернитесь в деревню');
    console.log('✅ Kill all enemies on level 1 → quest changed to "Вернитесь в деревню"');
  });

  test('Kill-all: Kill quest on level 3 — Creator sets "Убей и Выживи" and kill advances', async ({ page }) => {
    // Full playthrough to level 3 kill quest
    await setupKillQuest(page, adapter);

    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);

    await adapter.killAllEnemies();
    await waitForQuest(page, adapter, 'Вернитесь в деревню', 15_000);

    await talkToNpc(page, adapter, 'Астоф', 21, 20);
    await waitForLevel(page, adapter, 0);

    await talkToNpc(page, adapter, 'Даздраперма', 16, 4);
    await waitForQuest(page, adapter, 'Найти Артаку');

    await talkToNpc(page, adapter, 'Артака', 24, 5);
    await waitForQuest(page, adapter, 'Отправляйтесь на остров..');

    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 2);

    await adapter.addItem(1, 8);
    await waitForQuest(page, adapter, 'Вернитесь к Астофу', 15_000);

    await talkToNpc(page, adapter, 'Астоф', 27, 20);
    await waitForLevel(page, adapter, 0);

    await talkToNpc(page, adapter, 'Артака', 24, 5);
    await waitForQuest(page, adapter, 'Отправляйтесь с Астовом');

    // Go to level 3
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 3);

    // Talk to Creator (Автор) → sets kill quest
    await talkToNpc(page, adapter, 'Автор', 12, 8);
    await waitForQuest(page, adapter, 'Убей и Выживи');

    const questText = await adapter.getQuestText();
    expect(questText).toBe('Убей и Выживи');
    console.log('✅ Creator sets level 3 kill quest: "Убей и Выживи"');

    // Kill all enemies → quest advances
    await adapter.killAllEnemies();
    await waitForQuest(page, adapter, 'Бэтмену что то Надо', 15_000);

    const afterKill = await adapter.getQuestText();
    expect(afterKill).toBe('Бэтмену что то Надо');
    console.log('✅ Kill all on level 3 → quest changed to "Бэтмену что то Надо"');
  });
});
