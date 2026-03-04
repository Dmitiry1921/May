import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, talkToNpc, waitForQuest, waitForLevel } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

/**
 * E2E тесты: Механика копания предметов (item digging) в «Майских островах».
 *
 * Тест-кейсы:
 *   a. findItemTiles возвращает корректные позиции морковки на уровне 1
 *   b. findItemTiles возвращает корректные позиции подсолнухов на уровне 2
 *   c. addItem корректно увеличивает количество предметов в инвентаре
 *   d. getItemCount возвращает 0 для пустого инвентаря
 *   e. Callback квеста срабатывает при сборе нужного количества предметов (addItem)
 *   f. Инвентарь отображает предметы после добавления
 */

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Загрузить игру на определённом уровне через localStorage-shortcut.
 * storage.setOnce('_lvl', 0) не перезапишет значение если оно уже есть.
 */
const loadOnLevel = async (
  page: import('@playwright/test').Page,
  lvl: number,
): Promise<TestAdapter> => {
  await page.goto('/');
  await page.evaluate((l) => localStorage.setItem('_lvl', JSON.stringify(l)), lvl);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const newAdapter = createPlaywrightAdapter(page);
  await waitForGameReady(page, newAdapter);
  return newAdapter;
};

// ─── ТЕСТЫ ───────────────────────────────────────────────────────────────────

test.describe('Механика копания предметов', () => {
  let adapter: TestAdapter;

  test.beforeEach(async ({ page }) => {
    // Чистый старт: очищаем localStorage и перезагружаем
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    adapter = createPlaywrightAdapter(page);
    await waitForGameReady(page, adapter);
  });

  // ── a. findItemTiles возвращает корректные позиции морковки на уровне 1 ──
  test('findItemTiles returns correct carrot positions on level 1', async ({ page }) => {
    // Перезагружаемся на уровень 1 через localStorage-shortcut
    adapter = await loadOnLevel(page, 1);

    const level = await adapter.getLevel();
    expect(level).toBe(1);

    // Ищем тайлы с морковью (itmId = 0, tile:11, mapId:440)
    const carrotTiles = await adapter.findItemTiles(0);

    expect(Array.isArray(carrotTiles)).toBe(true);
    expect(carrotTiles.length).toBeGreaterThan(0);

    // Каждый тайл должен иметь числовые x и y координаты
    for (const tile of carrotTiles) {
      expect(tile).toHaveProperty('x');
      expect(tile).toHaveProperty('y');
      expect(typeof tile.x).toBe('number');
      expect(typeof tile.y).toBe('number');
      expect(tile.x).toBeGreaterThanOrEqual(0);
      expect(tile.y).toBeGreaterThanOrEqual(0);
    }

    console.log(`✅ findItemTiles(0) нашёл ${carrotTiles.length} морковок на уровне 1`);
  });

  // ── b. findItemTiles возвращает корректные позиции подсолнухов на уровне 2 ──
  test('findItemTiles returns correct sunflower positions on level 2', async ({ page }) => {
    // Перезагружаемся на уровень 2 через localStorage-shortcut
    adapter = await loadOnLevel(page, 2);

    const level = await adapter.getLevel();
    expect(level).toBe(2);

    // Ищем тайлы с подсолнухами (itmId = 1, tile:11, mapId:423)
    const sunflowerTiles = await adapter.findItemTiles(1);

    expect(Array.isArray(sunflowerTiles)).toBe(true);
    expect(sunflowerTiles.length).toBeGreaterThan(0);

    for (const tile of sunflowerTiles) {
      expect(tile).toHaveProperty('x');
      expect(tile).toHaveProperty('y');
      expect(typeof tile.x).toBe('number');
      expect(typeof tile.y).toBe('number');
      expect(tile.x).toBeGreaterThanOrEqual(0);
      expect(tile.y).toBeGreaterThanOrEqual(0);
    }

    console.log(`✅ findItemTiles(1) нашёл ${sunflowerTiles.length} подсолнухов на уровне 2`);
  });

  // ── c. addItem корректно увеличивает количество предметов в инвентаре ──
  test('addItem correctly increments inventory count', async ({ page }) => {
    // Проверяем начальное состояние
    const countBefore = await adapter.getItemCount(0);
    expect(countBefore).toBe(0);

    // Добавляем 3 морковки
    await adapter.addItem(0, 3);
    await page.waitForTimeout(300);
    const countAfter3 = await adapter.getItemCount(0);
    expect(countAfter3).toBe(3);

    // Добавляем ещё 5 морковок — должно стать 8
    await adapter.addItem(0, 5);
    await page.waitForTimeout(300);
    const countAfter8 = await adapter.getItemCount(0);
    expect(countAfter8).toBe(8);

    // Добавляем подсолнухи — отдельный предмет, не влияет на морковь
    await adapter.addItem(1, 4);
    await page.waitForTimeout(300);
    const sunflowerCount = await adapter.getItemCount(1);
    expect(sunflowerCount).toBe(4);

    // Морковь не изменилась
    const carrotStill = await adapter.getItemCount(0);
    expect(carrotStill).toBe(8);

    console.log('✅ addItem корректно увеличивает счётчик: 0→3→8 (морковь), 0→4 (подсолнух)');
  });

  // ── d. getItemCount возвращает 0 для пустого инвентаря ──
  test('getItemCount returns 0 for empty inventory', async ({ page }) => {
    // Морковь (id=0) — пустой инвентарь
    const carrotCount = await adapter.getItemCount(0);
    expect(carrotCount).toBe(0);

    // Подсолнух (id=1) — пустой инвентарь
    const sunflowerCount = await adapter.getItemCount(1);
    expect(sunflowerCount).toBe(0);

    // Несуществующий предмет (id=99)
    const unknownCount = await adapter.getItemCount(99);
    expect(unknownCount).toBe(0);

    console.log('✅ getItemCount возвращает 0 для пустого инвентаря (id:0, id:1, id:99)');
  });

  // ── e. Callback квеста срабатывает при сборе нужного количества предметов ──
  test('quest callback fires after collecting required item count', async ({ page }) => {
    // Прогрессируем до квеста "Выкопать морковку" через NPC-цепочку
    // Астоф → Ванесса → Астоф→lvl1 → Кирил → Бэтмен → Кирил
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

    // Квест установлен: {itm: 0, count: 9, callback: "_code.hero.carrot()"}
    // Добавляем 9 морковок через addItem — callback должен изменить квест
    await adapter.addItem(0, 9);
    await waitForQuest(page, adapter, 'Вернитесь к причалу', 15_000);

    console.log('✅ Callback квеста сработал: "Выкопать морковку" → "Вернитесь к причалу"');
  });

  // ── f. Инвентарь показывает предметы после добавления ──
  test('inventory shows items after adding them', async ({ page }) => {
    // Активируем инвентарь через диалог с Ванессой
    // (Ванесса вызывает Interface.inventory.show())
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');

    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');

    // Инвентарь теперь видим
    const isVisible = await adapter.isInventoryVisible();
    expect(isVisible).toBe(true);

    // Добавляем 5 морковок
    await adapter.addItem(0, 5);
    await page.waitForTimeout(300);

    // Проверяем через getInventory()
    const inventory = await adapter.getInventory();
    expect(inventory).not.toBeNull();

    // Инвентарь должен содержать ячейку с морковью (itmId=0, count=5)
    const items = Object.values(inventory as Record<string, unknown>);
    const carrotCell = items.find(
      (cell): cell is { itm: number; count: number } =>
        cell !== null && typeof cell === 'object' && 'itm' in cell && (cell as any).itm === 0,
    );
    expect(carrotCell).toBeDefined();
    expect(carrotCell!.count).toBe(5);

    // Добавляем подсолнухи
    await adapter.addItem(1, 3);
    await page.waitForTimeout(300);

    const inventory2 = await adapter.getInventory();
    const items2 = Object.values(inventory2 as Record<string, unknown>);
    const sunflowerCell = items2.find(
      (cell): cell is { itm: number; count: number } =>
        cell !== null && typeof cell === 'object' && 'itm' in cell && (cell as any).itm === 1,
    );
    expect(sunflowerCell).toBeDefined();
    expect(sunflowerCell!.count).toBe(3);

    // Морковь всё ещё на месте
    const carrotCell2 = items2.find(
      (cell): cell is { itm: number; count: number } =>
        cell !== null && typeof cell === 'object' && 'itm' in cell && (cell as any).itm === 0,
    );
    expect(carrotCell2).toBeDefined();
    expect(carrotCell2!.count).toBe(5);

    console.log('✅ Инвентарь корректно показывает 5 морковок и 3 подсолнуха');
  });
});
