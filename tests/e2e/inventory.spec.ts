/**
 * E2E тест: Система инвентаря в игре «Майские острова».
 * 
 * Проверяет:
 *   - Видимость инвентаря (скрыт на старте, открывается после диалога с Ванессой)
 *   - Добавление предметов через adapter.addItem(id, count)
 *   - Подсчёт предметов через adapter.getItemCount(id)
 *   - Получение полного инвентаря через adapter.getInventory()
 *   - Работу с несколькими типами предметов (морковь = 0, подсолнух = 1)
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, talkToNpc } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── ТЕСТЫ ────────────────────────────────────────────────────────────────────

test.describe('Система инвентаря', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    // Чистый старт: очищаем localStorage и перезагружаем
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
  });


  test('1. Инвентарь скрыт в начале игры', async ({ page }) => {
    const isVisible = await adapter.isInventoryVisible();
    expect(isVisible).toBe(false);
    console.log('✅ Инвентарь скрыт на старте');
  });

  test('2. Инвентарь становится видимым после диалога с Ванессой', async ({ page }) => {
    // Проверяем что изначально скрыт
    let isVisible = await adapter.isInventoryVisible();
    expect(isVisible).toBe(false);
    console.log('✅ Инвентарь скрыт до диалога');

    // Разговор с Астофом (открывает доступ к Ванессе)
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    
    // Разговор с Ванессой (открывает инвентарь)
    console.log('💬 Разговор с Ванессой...');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    
    // Проверяем что инвентарь стал видимым
    isVisible = await adapter.isInventoryVisible();
    expect(isVisible).toBe(true);
    console.log('✅ Инвентарь стал видимым после диалога с Ванессой');
  });

  test('3. Добавление предметов через addItem увеличивает счётчик', async ({ page }) => {
    // Добавляем 5 морковок (item id = 0)
    await adapter.addItem(0, 5);
    
    const count = await adapter.getItemCount(0);
    expect(count).toBe(5);
    console.log('✅ Добавлено 5 морковок, getItemCount(0) = 5');
  });

  test('4. Повторное добавление предметов увеличивает счётчик', async ({ page }) => {
    // Добавляем морковки дважды
    await adapter.addItem(0, 3);
    let count = await adapter.getItemCount(0);
    expect(count).toBe(3);
    console.log('✅ Первое добавление: 3 морковки');

    await adapter.addItem(0, 7);
    count = await adapter.getItemCount(0);
    expect(count).toBe(10);
    console.log('✅ Второе добавление: итого 10 морковок');
  });

  test('5. getInventory возвращает полный массив инвентаря', async ({ page }) => {
    // Добавляем разные предметы
    await adapter.addItem(0, 9); // 9 морковок
    await adapter.addItem(1, 8); // 8 подсолнухов

    const inventory = await adapter.getInventory() as Record<string, any> | null;
    if (!inventory) throw new Error('inventory is null');
    
    // getInventory возвращает объект {0: null, 1: {itm:0, count:9}, ...}
    // Нужно искать по слотам
    let carrotCount = 0;
    let sunflowerCount = 0;
    Object.values(inventory).forEach((slot: any) => {
      if (slot && slot.itm === 0) carrotCount += slot.count;
      if (slot && slot.itm === 1) sunflowerCount += slot.count;
    });
    
    expect(carrotCount).toBe(9);
    expect(sunflowerCount).toBe(8);
    console.log('✅ getInventory вернул объект с корректными данными:', {carrotCount, sunflowerCount});
  });

  test('6. Работа с несколькими типами предметов (морковь и подсолнух)', async ({ page }) => {
    // Добавляем морковки (id = 0)
    await adapter.addItem(0, 15);
    let carrotCount = await adapter.getItemCount(0);
    expect(carrotCount).toBe(15);
    console.log('✅ Добавлено 15 морковок');

    // Добавляем подсолнухи (id = 1)
    await adapter.addItem(1, 12);
    let sunflowerCount = await adapter.getItemCount(1);
    expect(sunflowerCount).toBe(12);
    console.log('✅ Добавлено 12 подсолнухов');

    // Проверяем что оба типа независимы
    carrotCount = await adapter.getItemCount(0);
    sunflowerCount = await adapter.getItemCount(1);
    
    expect(carrotCount).toBe(15);
    expect(sunflowerCount).toBe(12);
    console.log('✅ Оба типа предметов независимы: морковь=15, подсолнух=12');
  });

  test('7. Комплексный тест: видимость инвентаря + добавление предметов', async ({ page }) => {
    // 1. Инвентарь скрыт
    let isVisible = await adapter.isInventoryVisible();
    expect(isVisible).toBe(false);
    console.log('✅ Инвентарь скрыт');

    // 2. Добавляем предметы до открытия инвентаря
    await adapter.addItem(0, 5);
    let count = await adapter.getItemCount(0);
    expect(count).toBe(5);
    console.log('✅ Предметы добавляются даже при скрытом инвентаре');

    // 3. Открываем инвентарь через диалоги
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    
    isVisible = await adapter.isInventoryVisible();
    expect(isVisible).toBe(true);
    console.log('✅ Инвентарь открыт');

    // 4. Проверяем что предметы сохранились
    count = await adapter.getItemCount(0);
    expect(count).toBe(5);
    console.log('✅ Предметы сохранились после открытия инвентаря');

    // 5. Добавляем ещё предметов
    await adapter.addItem(0, 3);
    await adapter.addItem(1, 10);
    
    const inventory = await adapter.getInventory() as Record<string, any> | null;
    if (!inventory) throw new Error('inventory is null');
    // inventory - объект {0: null, 1: {itm:0, count:8}, ...}
    let carrotCount = 0;
    let sunflowerCount = 0;
    Object.values(inventory).forEach((slot: any) => {
      if (slot && slot.itm === 0) carrotCount += slot.count;
      if (slot && slot.itm === 1) sunflowerCount += slot.count;
    });
    expect(carrotCount).toBe(8);  // 5 + 3 = 8 морковок
    expect(sunflowerCount).toBe(10); // 10 подсолнухов
  });
});
