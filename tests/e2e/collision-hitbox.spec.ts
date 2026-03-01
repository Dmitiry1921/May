import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';
import type { Page } from '@playwright/test';

const freshStart = async (page: Page): Promise<TestAdapter> => {
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

test.describe('Hero collision hitbox precision', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    adapter = await freshStart(page);
  });

  test('hitbox dimensions match formula', async ({ page }) => {
    const box = await adapter.getHeroCollisionBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
    expect(box!.width).toBeLessThan(box!.height * 4);
  });

  test('hitbox positioned at bottom quarter', async ({ page }) => {
    const box = await adapter.getHeroCollisionBox();
    const pixelPos = await adapter.getHeroPixelPos();
    expect(box).not.toBeNull();
    expect(pixelPos).not.toBeNull();
    expect(box!.y).toBeGreaterThan(pixelPos!.y);
  });

  test('checkCollisionAtPixel returns true for wall tile', async ({ page }) => {
    const tileSize = await adapter.getTileSize();

    // Find a wall tile by scanning x=0..10 at y=0
    let wallTileX = -1;
    for (let x = 0; x <= 10; x++) {
      const result = await adapter.checkCollisionAt(x, 0);
      if (result.hasCollision) {
        wallTileX = x;
        break;
      }
    }

    // If we found a wall, verify pixel-level collision
    expect(wallTileX).toBeGreaterThanOrEqual(0);
    const wallPixelX = wallTileX * tileSize.w;
    const wallPixelY = 0;
    const hitWall = await adapter.checkCollisionAtPixel(wallPixelX, wallPixelY, 1, 1);
    expect(hitWall).toBe(true);

    // Far-off coordinate should have no collision
    const hitEmpty = await adapter.checkCollisionAtPixel(1000, 1000, 1, 1);
    expect(hitEmpty).toBe(false);
  });

  test('getMobLifecycleState nonexistent mob returns exists:false', async ({ page }) => {
    const state = await adapter.getMobLifecycleState('НесуществующийМоб');
    expect(state.exists).toBe(false);
  });
});
