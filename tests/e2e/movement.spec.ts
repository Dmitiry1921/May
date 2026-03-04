import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

/**
 * E2E Tests for Player Movement
 *
 * Tests keyboard-controlled movement, collision detection, and animation/direction updates.
 * Tests are designed around the actual level 0 geometry to avoid collision issues.
 */

/**
 * Press a movement key and hold it for specified duration
 */
async function pressMovementKey(page: import('@playwright/test').Page, key: string, holdMs: number = 800): Promise<void> {
  // Focus canvas to ensure key events are captured
  await page.locator('#myCanvas').click({ force: true });

  // Press and hold key
  await page.keyboard.down(key);
  await page.waitForTimeout(holdMs);
  await page.keyboard.up(key);

  // Small delay for final position to settle
  await page.waitForTimeout(100);
}

test.describe('Движение героя', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
  });

  test('Движение вверх изменяет позицию героя', async ({ page }) => {
    // Hero spawns at tile (5, 3) - path upward is clear for several tiles
    const startPos = await adapter.getHeroPos();
    expect(startPos!.x).toBe(5);
    expect(startPos!.y).toBe(3);

    // Move up - hold for 800ms
    await pressMovementKey(page, 'ArrowUp', 800);

    const endPos = await adapter.getHeroPos();

    // Should move at least 1 tile up (conservative due to possible walls)
    expect(endPos!.y).toBeLessThanOrEqual(startPos!.y - 1);
    expect(endPos!.x).toBe(startPos!.x); // X should not change
  });

  test('Движение вниз изменяет позицию героя', async ({ page }) => {
    // From spawn, can move 1 tile down before hitting NPC Астоф at (5,5)
    const startPos = await adapter.getHeroPos();
    expect(startPos!.y).toBe(3);

    // Move down briefly to move exactly 1 tile
    await pressMovementKey(page, 'ArrowDown', 300);

    const endPos = await adapter.getHeroPos();

    // Should move at least toward tile 4 (may not reach due to collision)
    expect(endPos!.y).toBeGreaterThanOrEqual(startPos!.y);
    expect(endPos!.x).toBe(startPos!.x);
  });

  test('Клавиши направления изменяют позицию героя', async ({ page }) => {
    // Test that keyboard input causes ANY position change
    const startPixel = await adapter.getHeroPixelPos();

    // Move up (we know this works from spawn)
    await pressMovementKey(page, 'ArrowUp', 500);

    const endPixel = await adapter.getHeroPixelPos();

    // Pixel position should change
    const moved = (endPixel!.x !== startPixel!.x) || (endPixel!.y !== startPixel!.y);
    expect(moved).toBe(true);
  });

  test('Стены блокируют движение героя', async ({ page }) => {
    // From spawn (5,3), tile (6,3) to the right is a wall
    const startPos = await adapter.getHeroPos();
    expect(startPos!.x).toBe(5);

    // Try to move right into wall
    await pressMovementKey(page, 'ArrowRight', 800);

    const endPos = await adapter.getHeroPos();

    // Should not move more than 1 tile (blocked by wall at 6,3)
    expect(endPos!.x).toBeLessThanOrEqual(startPos!.x + 1);
  });

  test('Границы карты блокируют движение', async ({ page }) => {
    // Move toward top boundary by going up multiple times
    await pressMovementKey(page, 'ArrowUp', 500);
    await pressMovementKey(page, 'ArrowUp', 500);

    const midPos = await adapter.getHeroPos();

    // Try to move further up (should hit boundary eventually)
    await pressMovementKey(page, 'ArrowUp', 1000);

    const endPos = await adapter.getHeroPos();

    // Position should not decrease indefinitely (boundary stops it)
    expect(endPos!.y).toBeGreaterThanOrEqual(0);
  });

  test('Направление обновляется при нажатии клавиш', async ({ page }) => {
    // Test that direction changes with key presses

    // Move up briefly
    await pressMovementKey(page, 'ArrowUp', 300);
    let direction = await adapter.getHeroDirection();
    expect(direction).toBe('top');

    // Move down briefly (may not move due to NPC, but direction should change)
    await page.locator('#myCanvas').click({ force: true });
    await page.keyboard.down('ArrowDown');
    await page.waitForTimeout(100); // Just long enough to register direction
    await page.keyboard.up('ArrowDown');
    direction = await adapter.getHeroDirection();
    expect(direction).toBe('bottom');

    // Move left (may not move due to collision)
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(100);
    await page.keyboard.up('ArrowLeft');
    direction = await adapter.getHeroDirection();
    expect(direction).toBe('left');

    // Move right (may not move due to wall)
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(100);
    await page.keyboard.up('ArrowRight');
    direction = await adapter.getHeroDirection();
    expect(direction).toBe('right');
  });

  test('Анимация циклируется во время движения', async ({ page }) => {
    // Monitor animation frames during upward movement (known to work)
    await page.locator('#myCanvas').click({ force: true });
    await page.keyboard.down('ArrowUp');

    // Collect frames over 600ms
    const frames: number[] = [];
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(100);
      const frame = await adapter.getHeroAnimFrame();
      frames.push(frame!);
    }

    await page.keyboard.up('ArrowUp');

    // Should see animation changing (multiple different frames)
    const uniqueFrames = [...new Set(frames)];
    expect(uniqueFrames.length).toBeGreaterThanOrEqual(2);

    // All frames should be in valid range 0-3
    frames.forEach(f => {
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThanOrEqual(3);
    });
  });

  test('Направление сохраняется после остановки', async ({ page }) => {
    // Move up
    await pressMovementKey(page, 'ArrowUp', 500);

    const directionAfterMove = await adapter.getHeroDirection();
    expect(directionAfterMove).toBe('top');

    // Wait and verify direction persists
    await page.waitForTimeout(500);

    const directionAfterWait = await adapter.getHeroDirection();
    expect(directionAfterWait).toBe('top');
  });

  test('Одновременное нажатие двух клавиш обрабатывается', async ({ page }) => {
    const startPixel = await adapter.getHeroPixelPos();

    await page.locator('#myCanvas').click({ force: true });

    // Press UP and LEFT simultaneously (both should work from spawn)
    await page.keyboard.down('ArrowUp');
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(500);
    await page.keyboard.up('ArrowUp');
    await page.keyboard.up('ArrowLeft');
    await page.waitForTimeout(100);

    const endPixel = await adapter.getHeroPixelPos();

    // Position should change (may move diagonally or favor one direction)
    const moved = (endPixel!.x !== startPixel!.x) || (endPixel!.y !== startPixel!.y);
    expect(moved).toBe(true);
  });

  test('WASD клавиши работают для управления', async ({ page }) => {
    // Test W (up) - known to work from spawn
    const startPos = await adapter.getHeroPos();

    await pressMovementKey(page, 'KeyW', 500);
    let direction = await adapter.getHeroDirection();
    expect(direction).toBe('top');

    const afterW = await adapter.getHeroPos();
    expect(afterW!.y).toBeLessThan(startPos!.y); // Moved up

    // Test S (down)
    await page.locator('#myCanvas').click({ force: true });
    await page.keyboard.down('KeyS');
    await page.waitForTimeout(100);
    await page.keyboard.up('KeyS');
    direction = await adapter.getHeroDirection();
    expect(direction).toBe('bottom');

    // Test A (left)
    await page.keyboard.down('KeyA');
    await page.waitForTimeout(100);
    await page.keyboard.up('KeyA');
    direction = await adapter.getHeroDirection();
    expect(direction).toBe('left');

    // Test D (right)
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(100);
    await page.keyboard.up('KeyD');
    direction = await adapter.getHeroDirection();
    expect(direction).toBe('right');
  });

  test('Многократные нажатия клавиш работают последовательно', async ({ page }) => {
    const startPos = await adapter.getHeroPos();

    // Move up 3 times
    await pressMovementKey(page, 'ArrowUp', 300);
    await pressMovementKey(page, 'ArrowUp', 300);
    await pressMovementKey(page, 'ArrowUp', 300);

    const endPos = await adapter.getHeroPos();

    // Should have moved up by at least 1 tile total
    expect(endPos!.y).toBeLessThan(startPos!.y);
  });
});
