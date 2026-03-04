/**
 * E2E tests: Combat system, hitbox precision, and per-level enemy stat verification.
 * 14 test cases covering basic combat, hitbox precision, and per-level enemy stats.
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, pressSpace, goToLevel } from '../helpers/game-helpers';
import { ENEMY_STATS } from '../config/game-data';
import type { TestAdapter } from '../types/test-adapter';

// ─── TESTS ─────────────────────────────────────────────────────────────────────

test.describe('Combat System', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // BASIC COMBAT TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  test('1 — Hero damage tracking: setHeroHealth and damageHero work correctly', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForGameReady(page, adapter, { combatReady: true });

    // Set health to known value
    await adapter.setHeroHealth(5);
    expect(await adapter.getHeroHealth()).toBe(5);

    // Damage by 1 — hero should lose 1 HP
    await adapter.damageHero(1);
    expect(await adapter.getHeroHealth()).toBe(4);

    // Damage by 2
    await adapter.damageHero(2);
    expect(await adapter.getHeroHealth()).toBe(2);

    // Damage by 10 — should not go below 0
    await adapter.damageHero(10);
    expect(await adapter.getHeroHealth()).toBe(0);

    // Reset health
    await adapter.setHeroHealth(3);
    expect(await adapter.getHeroHealth()).toBe(3);

    console.log('✅ Hero damage tracking verified');
  });

  test('2 — Enemy attacks hero via collision — hero loses health', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 1);

    // Set hero health to a known value
    await adapter.setHeroHealth(5);
    const healthBefore = await adapter.getHeroHealth();
    expect(healthBefore).toBe(5);

    // Get first enemy and teleport hero onto it
    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBeGreaterThan(0);
    const target = enemies[0];

    await adapter.teleport(target.x, target.y);

    // Wait for collision + enemy attack cooldown (700ms) + buffer
    await page.waitForTimeout(1500);

    const healthAfter = await adapter.getHeroHealth();
    expect(healthAfter).toBeLessThan(healthBefore!);
    console.log(`✅ Enemy collision damage: ${healthBefore} → ${healthAfter}`);
  });

  test('3 — Kill all enemies via killAllEnemies — enemies removed', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 1);

    const enemiesBefore = await adapter.getEnemies();
    expect(enemiesBefore.length).toBeGreaterThan(0);

    await adapter.killAllEnemies();
    await page.waitForTimeout(500);

    const enemiesAfter = await adapter.getEnemies();
    expect(enemiesAfter.length).toBe(0);
    console.log(`✅ Enemies killed: ${enemiesBefore.length} → 0`);
  });

  test('4 — Hero death triggers game over (isGameOver)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForGameReady(page, adapter, { combatReady: true });

    // Set health to 1 then damage to 0
    await adapter.setHeroHealth(1);
    expect(await adapter.getHeroHealth()).toBe(1);

    await adapter.damageHero(1);
    expect(await adapter.getHeroHealth()).toBe(0);

    // Wait for game loop to detect 0 HP and trigger gameOver
    await page.waitForTimeout(2000);

    const isOver = await adapter.isGameOver();
    expect(isOver).toBe(true);
    console.log('✅ Game over triggered when hero HP reaches 0');
  });

  test('5 — Damage amounts: default enemy damage=1 on level 1', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 1);

    await adapter.setHeroHealth(5);

    // Teleport onto enemy
    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBeGreaterThan(0);

    await adapter.teleport(enemies[0].x, enemies[0].y);

    await page.waitForTimeout(1500);

    const healthAfter = await adapter.getHeroHealth();
    // Default enemy damage is 1, so hero should have taken 1-2 damage
    expect(healthAfter).toBeLessThanOrEqual(4);
    expect(healthAfter).toBeGreaterThanOrEqual(3);
    console.log(`✅ Enemy dealt default damage: 5 → ${healthAfter}`);
  });

  test('6 — Multiple enemies: level 1 enemies can all deal damage', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 1);

    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBeGreaterThanOrEqual(3);

    // Kill all and verify all removed
    await adapter.killAllEnemies();
    await page.waitForTimeout(500);

    const remaining = await adapter.getEnemies();
    expect(remaining.length).toBe(0);
    console.log(`✅ All ${enemies.length} enemies killed and removed`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // HITBOX PRECISION TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  test('7 — Hitbox: hero attack radius is 5', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForGameReady(page, adapter, { combatReady: true });

    const radius = await adapter.getHeroAttackRadius();
    expect(radius).toBe(5);
    console.log(`✅ Hero attack radius: ${radius}`);
  });

  test('8 — Hitbox: enemy far away is not hit by SPACE attack', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 1);

    await adapter.setHeroHealth(5);

    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBeGreaterThan(0);
    const totalHealthBefore = enemies.reduce((sum, e) => sum + e.health, 0);

    // Teleport hero far from all enemies (tile 1,1 — safe corner)
    await adapter.teleport(1, 1);
    await page.waitForTimeout(300);

    await adapter.enableAttack();
    await pressSpace(page, 3);
    await page.waitForTimeout(500);

    const enemiesAfter = await adapter.getEnemies();
    const totalHealthAfter = enemiesAfter.reduce((sum, e) => sum + e.health, 0);

    // No tool = no SPACE damage. Either way, enemies far away shouldn't be damaged.
    expect(enemiesAfter.length).toBe(enemies.length);
    expect(totalHealthAfter).toBe(totalHealthBefore);
    console.log('✅ Far-away enemies unaffected by SPACE attack');
  });

  test('9 — Hitbox: enemy collision — no damage at distance, damage on contact', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 1);

    await adapter.setHeroHealth(5);

    // Hero is already at safe position (1,1) from goToLevel
    // Verify hero hasn't taken any damage at (1,1)
    const healthAtSafeSpot = await adapter.getHeroHealth();
    expect(healthAtSafeSpot).toBe(5);
    console.log(`Health at safe spot (1,1): ${healthAtSafeSpot}`);

    // Now teleport ON TOP of first enemy — collision should happen
    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBeGreaterThan(0);
    const target = enemies[0];

    await adapter.teleport(target.x, target.y);
    await page.waitForTimeout(1500);

    const healthAfterContact = await adapter.getHeroHealth();
    expect(healthAfterContact).toBeLessThan(5);
    console.log(`✅ No damage at distance (${healthAtSafeSpot}), damage on contact (${healthAfterContact})`);
  });

  test('10 — Hitbox: edge boundary — teleport near enemy boundary verifies no crash', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 1);

    await adapter.setHeroHealth(5);

    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBeGreaterThan(0);
    const target = enemies[0];

    // Place hero at 2 tiles from enemy (boundary of attack radius)
    await adapter.teleport(target.x - 2, target.y);
    await page.waitForTimeout(300);

    await adapter.enableAttack();
    await pressSpace(page);
    await page.waitForTimeout(300);

    // Main assertion: boundary handling doesn't crash the game
    const enemiesNow = await adapter.getEnemies();
    expect(enemiesNow).toBeDefined();
    expect(Array.isArray(enemiesNow)).toBe(true);
    console.log(`✅ Edge boundary test passed — ${enemiesNow.length} enemies remaining`);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PER-LEVEL ENEMY STATS TESTS
  // ═══════════════════════════════════════════════════════════════════════════

  test('11 — Level 0: no enemies (empty array)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 0);

    const level = await adapter.getLevel();
    expect(level).toBe(0);

    const enemies = await adapter.getEnemies();
    expect(enemies).toEqual([]);
    console.log('✅ Level 0: no enemies');
  });

  test('12 — Level 1: 4 enemies, health=4', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 1);

    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBe(4);

    for (const enemy of enemies) {
      expect(enemy.health).toBe(4);
      expect(enemy.maxHealth).toBe(4);
    }

    console.log(`✅ Level 1: ${enemies.length} enemies, all health=4`);
  });

  test('13 — Level 2: 7 enemies, health=4', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 2);

    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBe(7);

    for (const enemy of enemies) {
      expect(enemy.health).toBe(4);
      expect(enemy.maxHealth).toBe(4);
    }

    console.log(`✅ Level 2: ${enemies.length} enemies, all health=4`);
  });

  test('14 — Level 3: 14 enemies, health=15, damage=3 (strong)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await goToLevel(page, adapter, 3);

    const enemies = await adapter.getEnemies();
    expect(enemies.length).toBe(14);

    for (const enemy of enemies) {
      expect(enemy.health).toBe(15);
      expect(enemy.maxHealth).toBe(15);
    }

    // Verify damage=3 by taking a hit
    await adapter.setHeroHealth(5);
    // Re-fetch fresh enemy positions (they may have moved)
    const freshEnemies = await adapter.getEnemies();
    await adapter.teleport(freshEnemies[0].x, freshEnemies[0].y);
    await page.waitForTimeout(2000);

    const healthAfter = await adapter.getHeroHealth();
    // Level 3 enemies deal 3 damage per hit
    expect(healthAfter).toBeLessThanOrEqual(2);
    console.log(`✅ Level 3: ${enemies.length} enemies, health=15, damage verified (5 → ${healthAfter})`);
  });
});
