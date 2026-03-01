/**
 * E2E тесты callback-цепочек квестовой системы.
 *
 * Покрываем:
 *   1. NPC quest chain starters — triggerNpcDialog, getNpcCode
 *   2. Quest state structure — getQuestState, getMobCount
 *   3. Level loading hook chain — getRegisteredHooks, addTestHookAfterLoadMob
 *   4. getNpcCode for all main NPCs
 *
 * НЕ дублирует тесты из quest.spec.ts (collect-item, kill-all, NPC flow chains).
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, goToLevel } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';
import type { Page } from '@playwright/test';

// ─── helpers ──────────────────────────────────────────────────────────────────

const freshGameStart = async (page: Page): Promise<TestAdapter> => {
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

// ─── Suite 1: NPC quest chain starters ───────────────────────────────────────

test.describe('NPC quest chain starters', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    adapter = await freshGameStart(page);
  });

  test('getQuestState initial state — active is false before any dialog', async () => {
    const state = await adapter.getQuestState();
    expect(state.active).toBe(false);
    console.log('✅ Quest not active at game start');
  });

  test('triggerNpcDialog("Астоф") updates quest state', async ({ page }) => {
    const result = await adapter.triggerNpcDialog('Астоф');
    expect(result).toBe(true);

    // Close the triggered dialog
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(200);
    for (let i = 0; i < 50; i++) {
      const isOpen = await adapter.isDialogOpen();
      if (!isOpen) break;
      await page.keyboard.down('Space');
      await page.waitForTimeout(50);
      await page.keyboard.up('Space');
      await page.waitForTimeout(550);
    }
    await page.waitForTimeout(600);

    const questText = await adapter.getQuestText();
    expect(questText).toContain('Найти');
    console.log('✅ triggerNpcDialog("Астоф") sets quest containing "Найти"');
  });

  test('getNpcCode("Астоф") changes after dialog', async ({ page }) => {
    const codeBefore = await adapter.getNpcCode('Астоф');
    expect(codeBefore).not.toBeNull();
    expect(typeof codeBefore).toBe('string');

    await adapter.triggerNpcDialog('Астоф');
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(200);
    for (let i = 0; i < 50; i++) {
      const isOpen = await adapter.isDialogOpen();
      if (!isOpen) break;
      await page.keyboard.down('Space');
      await page.waitForTimeout(50);
      await page.keyboard.up('Space');
      await page.waitForTimeout(550);
    }
    await page.waitForTimeout(600);

    const codeAfter = await adapter.getNpcCode('Астоф');
    expect(codeAfter).not.toBeNull();
    expect(codeAfter).toContain('busy');
    console.log('✅ getNpcCode("Астоф") contains "busy" after dialog');
  });

  test('getNpcCode returns non-null for known NPCs', async () => {
    const astofCode = await adapter.getNpcCode('Астоф');
    expect(astofCode).not.toBeNull();
    expect(typeof astofCode).toBe('string');

    const vanessaCode = await adapter.getNpcCode('Ванесса');
    expect(vanessaCode).not.toBeNull();
    expect(typeof vanessaCode).toBe('string');
    console.log('✅ Known NPCs return non-null code strings');
  });

  test('triggerNpcDialog for nonexistent NPC returns false', async () => {
    const result = await adapter.triggerNpcDialog('НесуществующийНПС');
    expect(result).toBe(false);
    console.log('✅ triggerNpcDialog for nonexistent NPC returns false');
  });
});

// ─── Suite 2: Quest state structure ──────────────────────────────────────────

test.describe('Quest state structure', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    adapter = await freshGameStart(page);
  });

  test('getQuestState returns object with all expected fields', async () => {
    const state = await adapter.getQuestState();
    expect(state).toHaveProperty('active');
    expect(state).toHaveProperty('itm');
    expect(state).toHaveProperty('count');
    expect(state).toHaveProperty('callback');
    expect(state).toHaveProperty('lvl');
    expect(state).toHaveProperty('text');
    expect(typeof state.active).toBe('boolean');
    expect(typeof state.text).toBe('string');
    console.log('✅ QuestState has all expected fields with correct types');
  });

  test('getQuestState itm/count/callback/lvl are null initially', async () => {
    const state = await adapter.getQuestState();
    expect(state.itm).toBeNull();
    expect(state.count).toBeNull();
    expect(state.callback).toBeNull();
    expect(state.lvl).toBeNull();
    console.log('✅ Quest optional fields are null at start');
  });

  test('getMobCount total includes all mobs (hero also counted)', async () => {
    const counts = await adapter.getMobCount();
    // total = enemies + nps + animals + 1 (hero is in _Mobs array)
    expect(counts.total).toBeGreaterThanOrEqual(counts.enemies + counts.nps + counts.animals);
    expect(counts.total).toBeLessThanOrEqual(counts.enemies + counts.nps + counts.animals + 1);
    expect(counts.total).toBeGreaterThan(0);
    console.log(`✅ MobCount total=${counts.total} ≥ enemies(${counts.enemies}) + nps(${counts.nps}) + animals(${counts.animals})`);
  });

  test('getMobCount returns different values on level 0 vs level 1', async ({ page }) => {
    const countsLvl0 = await adapter.getMobCount();

    await goToLevel(page, adapter, 1);
    const countsLvl1 = await adapter.getMobCount();

    const lvl0Key = `${countsLvl0.enemies}-${countsLvl0.nps}-${countsLvl0.animals}`;
    const lvl1Key = `${countsLvl1.enemies}-${countsLvl1.nps}-${countsLvl1.animals}`;
    expect(lvl0Key).not.toBe(lvl1Key);
    console.log(`✅ Level 0 mobs: ${lvl0Key}, Level 1 mobs: ${lvl1Key} — different compositions`);
  });

  test('getMobCount enemies is 0 on level 0 (village)', async () => {
    const counts = await adapter.getMobCount();
    expect(counts.enemies).toBe(0);
    expect(counts.nps).toBeGreaterThan(0);
    console.log(`✅ Level 0 has 0 enemies and ${counts.nps} NPCs (village)`);
  });
});

// ─── Suite 3: Level loading hook chain ───────────────────────────────────────

test.describe('Level loading hook chain', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    adapter = await freshGameStart(page);
  });

  test('getRegisteredHooks returns empty array initially', async () => {
    const hooks = await adapter.getRegisteredHooks();
    expect(Array.isArray(hooks)).toBe(true);
    expect(hooks.length).toBe(0);
    console.log('✅ No hooks registered at game start');
  });

  test('addTestHookAfterLoadMob registers a hook', async () => {
    await adapter.addTestHookAfterLoadMob('_code.nps.setLvlHook()');
    const hooks = await adapter.getRegisteredHooks();
    expect(hooks.length).toBe(1);
    expect(hooks[0]).toBe('_code.nps.setLvlHook()');
    console.log('✅ Hook registered successfully');
  });

  test('multiple hooks can be registered', async () => {
    await adapter.addTestHookAfterLoadMob('_code.nps.setLvlHook()');
    await adapter.addTestHookAfterLoadMob('_code.nps.vanessaComplete()');
    const hooks = await adapter.getRegisteredHooks();
    expect(hooks.length).toBe(2);
    expect(hooks).toContain('_code.nps.setLvlHook()');
    expect(hooks).toContain('_code.nps.vanessaComplete()');
    console.log('✅ Multiple hooks registered');
  });

  test('after goToLevel(1) registered hooks are cleared', async ({ page }) => {
    await adapter.addTestHookAfterLoadMob('_code.nps.setLvlHook()');
    const hooksBefore = await adapter.getRegisteredHooks();
    expect(hooksBefore.length).toBe(1);

    await goToLevel(page, adapter, 1);

    const hooksAfter = await adapter.getRegisteredHooks();
    expect(hooksAfter.length).toBe(0);
    console.log('✅ Hooks cleared after level transition');
  });
});

// ─── Suite 4: getNpcCode for all main NPCs ──────────────────────────────────

test.describe('getNpcCode for all main NPCs', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    adapter = await freshGameStart(page);
  });

  test('getNpcCode("Астоф") returns non-null string containing code', async () => {
    const code = await adapter.getNpcCode('Астоф');
    expect(code).not.toBeNull();
    expect(typeof code).toBe('string');
    expect(code!.length).toBeGreaterThan(0);
    console.log(`✅ Астоф code: "${code}"`);
  });

  test('getNpcCode("Ванесса") returns non-null string containing code', async () => {
    const code = await adapter.getNpcCode('Ванесса');
    expect(code).not.toBeNull();
    expect(typeof code).toBe('string');
    expect(code!.length).toBeGreaterThan(0);
    console.log(`✅ Ванесса code: "${code}"`);
  });

  test('getNpcCode("Даздраперма") returns non-null string', async () => {
    const code = await adapter.getNpcCode('Даздраперма');
    expect(code).not.toBeNull();
    expect(typeof code).toBe('string');
    console.log(`✅ Даздраперма code: "${code}"`);
  });

  test('getNpcCode("НесуществующийНПС") returns null', async () => {
    const code = await adapter.getNpcCode('НесуществующийНПС');
    expect(code).toBeNull();
    console.log('✅ Nonexistent NPC returns null');
  });
});
