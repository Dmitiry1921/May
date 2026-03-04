// @ts-check
/**
 * E2E тесты: HUD (Heads-Up Display) — HP, квест, инвентарь, диалог.
 *
 * 9 тест-кейсов проверяют состояние HUD через TestAdapter.
 * Каждый тест использует свой page.goto → resetGame для изоляции.
 */

import { test, expect, Page } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, pressSpace, talkToNpc } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── helpers ──────────────────────────────────────────────────────────────────

const pressSpaceLocal = async (page: Page, times = 1, delayMs = 550) => {
  for (let i = 0; i < times; i++) {
    await page.keyboard.down('Space');
    await page.waitForTimeout(50);
    await page.keyboard.up('Space');
    await page.waitForTimeout(delayMs);
  }
};

/** Reset game state: clear localStorage and reload, re-create adapter */
const resetGame = async (page: Page, adapterRef: { adapter: TestAdapter }) => {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  adapterRef.adapter = createPlaywrightAdapter(page);
  await waitForGameReady(page, adapterRef.adapter);
};

// ─── ТЕСТЫ HUD ───────────────────────────────────────────────────────────────

test.describe('HUD — Heads-Up Display', () => {

  test('HUD: 9 test cases for HP, quest, inventory, dialog', async ({ page }) => {
    // Initial page load
    await page.goto('/');
    
    // Create adapter and initialize
    let adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
    
    // Use a mutable ref so resetGame can update it
    const adapterRef = { adapter };

    // ── a. Initial HUD state ──────────────────────────────────────────────────
    await test.step('a. Initial HUD state: hp present, no quest, inventory hidden, no dialog', async () => {
      const hud = await adapterRef.adapter.getHudState();

      expect(hud.hp).not.toBeNull();
      if (!hud.hp) return; // Type guard
      expect(hud.hp.current).toBeGreaterThan(0);
      expect(hud.hp.max).toBeGreaterThan(0);
      expect(hud.questText).toBeNull();
      expect(hud.inventoryVisible).toBe(false);
      expect(hud.dialogOpen).toBe(false);
      expect(hud.dialogText).toBeNull();

      console.log('✅ a. Initial HUD state verified:', JSON.stringify(hud));
    });

    // ── b. HP values reflect hero health ──────────────────────────────────────
    await test.step('b. HP values in HUD match getHeroState()', async () => {
      const hud = await adapterRef.adapter.getHudState();
      const heroState = await adapterRef.adapter.getHeroState();

      expect(hud.hp).not.toBeNull();
      expect(heroState).not.toBeNull();
      if (!hud.hp || !heroState) return; // Type guard
      expect(hud.hp.current).toBe(heroState.health);
      expect(hud.hp.max).toBe(heroState.maxHealth);
      // Hero starts with health=1 on level 0 (before Астоф heals)
      expect(heroState.health).toBe(1);

      console.log(`✅ b. HP match: HUD hp=${hud.hp.current}/${hud.hp.max}, hero health=${heroState.health}/${heroState.maxHealth}`);
    });

    // ── c. damageHero(2) decreases HP by 2 ────────────────────────────────────
    await test.step('c. damageHero(2) decreases HP by 2', async () => {
      // Set health to 5 first so we have room to damage
      await adapterRef.adapter.setHeroHealth(5);
      const before = await adapterRef.adapter.getHeroHealth();
      expect(before).not.toBeNull();
      if (before === null) return; // Type guard
      expect(before).toBe(5);

      await adapterRef.adapter.damageHero(2);
      const after = await adapterRef.adapter.getHeroHealth();

      expect(after).not.toBeNull();
      if (after === null) return; // Type guard
      expect(after).toBe(before - 2);
      expect(after).toBe(3);

      // Verify HUD reflects the change
      const hud = await adapterRef.adapter.getHudState();
      expect(hud.hp).not.toBeNull();
      if (!hud.hp) return; // Type guard
      expect(hud.hp.current).toBe(after);

      console.log(`✅ c. damageHero(2): ${before} → ${after}`);
    });

    // ── d. setHeroHealth(1) sets HP to 1 ──────────────────────────────────────
    await test.step('d. setHeroHealth(1) sets HP to 1', async () => {
      await adapterRef.adapter.setHeroHealth(1);
      const hp = await adapterRef.adapter.getHeroHealth();

      expect(hp).not.toBeNull();
      if (hp === null) return; // Type guard
      expect(hp).toBe(1);

      // Verify via HUD state
      const hud = await adapterRef.adapter.getHudState();
      expect(hud.hp).not.toBeNull();
      if (!hud.hp) return; // Type guard
      expect(hud.hp.current).toBe(1);

      console.log(`✅ d. setHeroHealth(1): HP is now ${hp}`);
    });

    // ── e. After talking to Астоф, quest text appears ─────────────────────────
    // Reset game for clean quest state
    await resetGame(page, adapterRef);

    await test.step('e. After talking to Астоф, quest text appears in HUD', async () => {
      // Before: no quest
      const questBefore = await adapterRef.adapter.getQuestText();
      expect(questBefore).toBeNull();

      // Talk to Астоф
      await talkToNpc(page, adapterRef.adapter, 'Астоф', 5, 5);

      // After: quest text should be set
      const questAfter = await adapterRef.adapter.getQuestText();
      expect(questAfter).not.toBeNull();
      if (!questAfter) return; // Type guard
      expect(typeof questAfter).toBe('string');
      expect(questAfter.length).toBeGreaterThan(0);

      // Also verify via HUD state
      const hud = await adapterRef.adapter.getHudState();
      expect(hud.questText).toBe(questAfter);

      console.log(`✅ e. Quest after Астоф: "${questAfter}"`);
    });

    // ── f. Dialog opens when talking to NPC ───────────────────────────────────
    // Reset for clean dialog state
    await resetGame(page, adapterRef);

    await test.step('f. Dialog opens when talking to NPC (isDialogOpen becomes true)', async () => {
      // Before: no dialog
      const dialogBefore = await adapterRef.adapter.isDialogOpen();
      expect(dialogBefore).toBe(false);

      // Teleport near Астоф and start dialog (don't close it)
      await adapterRef.adapter.teleport(4, 5);
      await page.waitForTimeout(300);
      const started = await adapterRef.adapter.talkTo('Астоф');
      expect(started).toBe(true);
      await page.waitForTimeout(300);

      // After: dialog should be open
      const dialogAfter = await adapterRef.adapter.isDialogOpen();
      expect(dialogAfter).toBe(true);

      // HUD should also reflect dialog open
      const hud = await adapterRef.adapter.getHudState();
      expect(hud.dialogOpen).toBe(true);

      console.log('✅ f. Dialog opens when talking to NPC');

      // Cleanup: close dialog
      await page.locator('#myCanvas').click({ force: true });
      await page.waitForTimeout(100);
      for (let i = 0; i < 50; i++) {
        const isOpen = await adapterRef.adapter.isDialogOpen();
        if (!isOpen) break;
        await pressSpaceLocal(page, 1);
      }
      await page.waitForTimeout(600);
    });

    // ── g. Dialog text contains expected NPC text ─────────────────────────────
    // Reset for clean state
    await resetGame(page, adapterRef);

    await test.step('g. Dialog text contains expected NPC dialog text', async () => {
      // Teleport near Астоф and start dialog
      await adapterRef.adapter.teleport(4, 5);
      await page.waitForTimeout(300);
      await adapterRef.adapter.talkTo('Астоф');
      await page.waitForTimeout(300);

      // Get dialog text
      const dialogInfo = await adapterRef.adapter.getDialogText();

      expect(dialogInfo).not.toBeNull();
      if (!dialogInfo) return; // Type guard
      expect(dialogInfo.text).toBeDefined();
      expect(typeof dialogInfo.text).toBe('string');
      expect(dialogInfo.text.length).toBeGreaterThan(0);
      expect(dialogInfo.line).toBeDefined();
      expect(dialogInfo.total).toBeGreaterThan(0);

      // HUD dialogText should match
      const hud = await adapterRef.adapter.getHudState();
      expect(hud.dialogText).toBe(dialogInfo.text);

      console.log(`✅ g. Dialog text: "${dialogInfo.text}" (line ${dialogInfo.line + 1}/${dialogInfo.total})`);

      // Cleanup: close dialog
      await page.locator('#myCanvas').click({ force: true });
      await page.waitForTimeout(100);
      for (let i = 0; i < 50; i++) {
        const isOpen = await adapterRef.adapter.isDialogOpen();
        if (!isOpen) break;
        await pressSpaceLocal(page, 1);
      }
      await page.waitForTimeout(600);
    });

    // ── h. After talking to Ванесса, inventory becomes visible ────────────────
    // Reset for clean inventory state
    await resetGame(page, adapterRef);

    await test.step('h. After talking to Ванесса, inventory becomes visible', async () => {
      // First talk to Астоф (prerequisite for Ванесса quest flow)
      await talkToNpc(page, adapterRef.adapter, 'Астоф', 5, 5);

      // Verify inventory is NOT visible before Ванесса
      const invBefore = await adapterRef.adapter.isInventoryVisible();
      expect(invBefore).toBe(false);

      // Talk to Ванесса
      await talkToNpc(page, adapterRef.adapter, 'Ванесса', 21, 15);

      // After Ванесса: inventory should become visible
      const invAfter = await adapterRef.adapter.isInventoryVisible();
      expect(invAfter).toBe(true);

      // Also verify via HUD state
      const hud = await adapterRef.adapter.getHudState();
      expect(hud.inventoryVisible).toBe(true);

      console.log('✅ h. Inventory visible after talking to Ванесса');
    });

    // ── i. HP cannot go below 0 ──────────────────────────────────────────────
    // No reset needed — HP test doesn't depend on quest/inventory state
    await test.step('i. HP cannot go below 0 (damageHero with large amount)', async () => {
      // Ensure hero has some HP (Астоф healed to 5 in step h)
      await adapterRef.adapter.setHeroHealth(3);
      const before = await adapterRef.adapter.getHeroHealth();
      expect(before).toBeGreaterThan(0);

      // Damage with a huge amount
      await adapterRef.adapter.damageHero(9999);
      const after = await adapterRef.adapter.getHeroHealth();

      expect(after).toBe(0);

      // Verify HUD reflects 0
      const hud = await adapterRef.adapter.getHudState();
      expect(hud.hp).not.toBeNull();
      if (!hud.hp) return; // Type guard
      expect(hud.hp.current).toBe(0);

      console.log(`✅ i. HP clamped: damageHero(9999) → HP=${after}`);
    });
  });
});
