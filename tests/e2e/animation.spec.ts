/**
 * E2E тест: Анимация и система направлений спрайтов «Майские острова».
 *
 * Проверяемые аспекты:
 *   - Направление героя (memory.pos): 'top'|'bottom'|'left'|'right'
 *   - Кадр анимации (_spt.hero.frame.im): индекс 0, 1 или 2
 *   - Idle-кадр = 1 (когда герой стоит на месте)
 *   - Направления NPC
 *   - Телепорт и обновление позиции
 *   - Соответствие пиксельной и тайловой позиции
 *   - Размер тайла 32×32
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── helpers ──────────────────────────────────────────────────────────────────

const VALID_DIRECTIONS = ['top', 'bottom', 'left', 'right'];

// ─── ТЕСТЫ ────────────────────────────────────────────────────────────────────

test.describe('Анимация и направления спрайтов', () => {
  test.beforeEach(async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    await page.goto('/');
    await adapter.clearStorage();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForGameReady(page, adapter);
  });

  // (a) Hero has a valid initial direction
  test('Герой имеет валидное начальное направление', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const direction = await adapter.getHeroDirection();
    expect(VALID_DIRECTIONS).toContain(direction);
    console.log(`✅ Направление героя: "${direction}"`);
  });

  // (b) Hero animation frame is a valid number (0, 1, or 2)
  test('Кадр анимации героя — валидное число (0, 1 или 2)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const frame = await adapter.getHeroAnimFrame();
    expect(typeof frame).toBe('number');
    expect([0, 1, 2]).toContain(frame);
    console.log(`✅ Кадр анимации: ${frame}`);
  });

  // (c) When stationary, hero frame is 1 (idle frame)
  test('В покое герой показывает idle-кадр (frame = 1)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    // Teleport hero and wait — hero should be idle
    await adapter.teleport(5, 3);
    await page.waitForTimeout(500);

    // Poll for idle frame — the engine may take a tick to settle
    await expect.poll(
      async () => adapter.getHeroAnimFrame(),
      { timeout: 5000, message: 'Ждём idle-кадр (1)' }
    ).toBe(1);
    console.log('✅ Idle-кадр = 1');
  });

  // (d) NPCs have valid directions
  test('NPC имеют валидные направления', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const npcs = await adapter.getAllNpcs();
    expect(npcs.length).toBeGreaterThan(0);

    for (const npc of npcs) {
      expect(VALID_DIRECTIONS).toContain(npc.direction);
    }
    const names = npcs.map(n => `${n.name}:${n.direction}`).join(', ');
    console.log(`✅ NPC направления: ${names}`);
  });

  // (e) After teleport, hero position updates correctly
  test('После телепорта позиция героя обновляется корректно', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const targetX = 10;
    const targetY = 8;
    await adapter.teleport(targetX, targetY);
    await page.waitForTimeout(300);

    const pos = await adapter.getHeroPos();
    expect(pos).not.toBeNull();
    expect(pos!.x).toBe(targetX);
    expect(pos!.y).toBe(targetY);
    console.log(`✅ Телепорт → (${pos!.x}, ${pos!.y})`);
  });

  // (f) Hero pixel position corresponds to tile position (* tileSize)
  test('Пиксельная позиция героя соответствует тайловой (* tileSize)', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const targetX = 7;
    const targetY = 5;
    await adapter.teleport(targetX, targetY);
    await page.waitForTimeout(300);

    const pixel = await adapter.getHeroPixelPos();
    const tileSize = await adapter.getTileSize();

    expect(pixel).not.toBeNull();
    expect(tileSize).not.toBeNull();

    // teleport sets memory.x = tx * w, memory.y = ty * h
    expect(pixel!.x).toBe(targetX * tileSize.w);
    expect(pixel!.y).toBe(targetY * tileSize.h);
    console.log(`✅ Pixel(${pixel!.x}, ${pixel!.y}) = Tile(${targetX}, ${targetY}) × ${tileSize.w}`);
  });

  // (g) NPC directions are valid strings from the allowed set
  test('Направления NPC — строки из допустимого набора', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const npcNames = ['Даздраперма', 'Артака', 'Астоф', 'Ванесса'];
    const npcs = await adapter.getAllNpcs();
    
    for (const name of npcNames) {
      const npc = npcs.find(n => n.name === name);
      expect(npc).not.toBeUndefined();
      expect(npc!.direction).not.toBeNull();
      expect(typeof npc!.direction).toBe('string');
      expect(VALID_DIRECTIONS).toContain(npc!.direction);
    }
    console.log(`✅ Все 4 NPC имеют валидные строковые направления`);
  });

  // (h) getTileSize returns {w: 32, h: 32}
  test('getTileSize возвращает {w: 32, h: 32}', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    const tileSize = await adapter.getTileSize();
    expect(tileSize).toEqual({ w: 32, h: 32 });
    console.log(`✅ Размер тайла: ${tileSize.w}×${tileSize.h}`);
  });
});
