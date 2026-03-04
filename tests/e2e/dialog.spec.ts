/**
 * E2E тест: NPC dialog system
 *
 * Проверяем:
 *   - Открытие диалога при взаимодействии с NPC
 *   - Доступность текста диалога
 *   - Прокрутка диалога через SPACE
 *   - Закрытие диалога после последней реплики
 *   - Различия в диалогах разных NPC
 *   - Блокировка движения героя во время диалога
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, pressSpace } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── ТЕСТ ─────────────────────────────────────────────────────────────────────

test.describe('NPC Dialog System', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    // Чистый старт: очищаем localStorage и перезагружаем
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
  });

  test('should open dialog when talking to NPC', async ({ page }) => {
    // Астоф at (5, 5)
    await adapter.teleport(4, 5);
    await page.waitForTimeout(300);

    // Диалог должен быть закрыт изначально
    const initiallyOpen = await adapter.isDialogOpen();
    expect(initiallyOpen).toBe(false);

    // Начинаем диалог с Астофом
    const started = await adapter.talkTo('Астоф');
    expect(started).toBe(true);

    await page.waitForTimeout(300);

    // Диалог должен быть открыт
    const nowOpen = await adapter.isDialogOpen();
    expect(nowOpen).toBe(true);

    console.log('✅ Dialog opens when talking to NPC');
  });

  test('should make dialog text content accessible', async ({ page }) => {
    // Ванесса at (21, 15)
    await adapter.teleport(20, 15);
    await page.waitForTimeout(300);

    // Начинаем диалог с Ванессой
    await adapter.talkTo('Ванесса');
    await page.waitForTimeout(300);

    // Получаем текст диалога
    const dialogData = await adapter.getDialogText();
    
    // dialogData должен быть объектом с полями text, line, total
    expect(dialogData).toBeTruthy();
    expect(dialogData!.text).toBeTruthy();
    expect(typeof dialogData!.text).toBe('string');
    expect(dialogData!.text.length).toBeGreaterThan(0);

    console.log('✅ Dialog text is accessible:', dialogData!.text.substring(0, 50));
  });

  test('should advance dialog with SPACE and change text', async ({ page }) => {
    // Даздраперма at (16, 4)
    await adapter.teleport(15, 4);
    await page.waitForTimeout(300);

    // Начинаем диалог
    await adapter.talkTo('Даздраперма');
    await page.waitForTimeout(300);

    // Захватываем фокус для keyboard событий
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(100);

    // Получаем первую реплику
    const firstData = await adapter.getDialogText();
    expect(firstData).toBeTruthy();

    // Нажимаем SPACE
    await pressSpace(page, 1);

    // Получаем вторую реплику
    const secondData = await adapter.getDialogText();
    expect(secondData).toBeTruthy();

    // Тексты должны отличаться
    expect(secondData!.text).not.toBe(firstData!.text);

    console.log('✅ Dialog advances with SPACE and text changes');
    console.log('   First:', firstData!.text.substring(0, 30));
    console.log('   Second:', secondData!.text.substring(0, 30));
  });

  test('should close dialog after last line', async ({ page }) => {
    // Артака at (24, 5)
    await adapter.teleport(23, 5);
    await page.waitForTimeout(300);

    // Начинаем диалог с Артакой
    await adapter.talkTo('Артака');
    await page.waitForTimeout(300);

    // Диалог открыт
    let isOpen = await adapter.isDialogOpen();
    expect(isOpen).toBe(true);

    // Захватываем фокус
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(100);

    // Прокликиваем все реплики (макс 50)
    for (let i = 0; i < 50; i++) {
      isOpen = await adapter.isDialogOpen();
      if (!isOpen) break;
      await pressSpace(page, 1);
    }

    // Диалог должен закрыться
    const finallyOpen = await adapter.isDialogOpen();
    expect(finallyOpen).toBe(false);

    console.log('✅ Dialog closes after last line');
  });

  test('should show different content for different NPCs', async ({ page }) => {
    // Разговор с Астофом
    await adapter.teleport(4, 5);
    await page.waitForTimeout(300);
    await adapter.talkTo('Астоф');
    await page.waitForTimeout(300);
    const astofData = await adapter.getDialogText();

    // Закрываем диалог Астофа
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(100);
    for (let i = 0; i < 50; i++) {
      const isOpen = await adapter.isDialogOpen();
      if (!isOpen) break;
      await pressSpace(page, 1);
    }
    await page.waitForTimeout(500);

    // Разговор с Ванессой
    await adapter.teleport(20, 15);
    await page.waitForTimeout(300);
    await adapter.talkTo('Ванесса');
    await page.waitForTimeout(300);
    const vanessaData = await adapter.getDialogText();

    // Тексты должны отличаться
    expect(astofData).toBeTruthy();
    expect(vanessaData).toBeTruthy();
    expect(astofData!.text).not.toBe(vanessaData!.text);

    console.log('✅ Different NPCs show different dialog content');
    console.log('   Астоф:', astofData!.text.substring(0, 40));
    console.log('   Ванесса:', vanessaData!.text.substring(0, 40));
  });

  test('should prevent hero movement during dialog', async ({ page }) => {
    // Даздраперма at (16, 4)
    await adapter.teleport(15, 4);
    await page.waitForTimeout(300);

    // Получаем начальные координаты героя
    const startPos = await adapter.getHeroPos();

    // Начинаем диалог
    await adapter.talkTo('Даздраперма');
    await page.waitForTimeout(300);

    // Диалог открыт
    const isOpen = await adapter.isDialogOpen();
    expect(isOpen).toBe(true);

    // Захватываем фокус и пытаемся двигаться
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(100);

    // Пытаемся двигаться в разных направлениях (стрелки)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);

    // Получаем текущие координаты
    const endPos = await adapter.getHeroPos();

    // Координаты не должны измениться
    expect(endPos!.x).toBe(startPos!.x);
    expect(endPos!.y).toBe(startPos!.y);

    console.log('✅ Hero cannot move during dialog');
    console.log('   Start position:', startPos);
    console.log('   End position:', endPos);
  });
});
