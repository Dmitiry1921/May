/**
 * E2E тест: Игра «Майские острова» играет сама в себя — полное прохождение.
 *
 * Стратегия:
 *   1. adapter.teleport(tx, ty)    — мгновенная телепортация героя в памяти движка
 *   2. adapter.talkTo(name)        — прямой запуск диалога NPC по имени
 *   3. adapter.killAllEnemies()    — убить всех врагов на уровне
 *   4. adapter.addItem(id, n)      — добавить предмет в инвентарь
 *   5. pressSpace(n)               — прокрутить n реплик диалога
 *   6. waitForQuest / waitForLevel — дождаться смены состояния
 */

import { test, expect } from '@playwright/test';
import { createPlaywrightAdapter } from '../adapters/playwright-adapter';
import { waitForGameReady, pressSpace, talkToNpc, waitForQuest, waitForLevel } from '../helpers/game-helpers';
import type { TestAdapter } from '../types/test-adapter';

// ─── ТЕСТ ─────────────────────────────────────────────────────────────────────

test.describe('Полное прохождение «Майских островов»', () => {
  test.beforeEach(async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);
    // Чистый старт: очищаем localStorage и перезагружаем
    await page.goto('/');
    await adapter.clearStorage();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForGameReady(page, adapter);
  });

  test('Игра проходит сама себя от начала до финала', async ({ page }) => {
    const adapter = createPlaywrightAdapter(page);

    // ═══ ФАЗА 0 — стартуем на уровне 0 ══════════════════════════════════════
    const startLvl = await adapter.getLevel();
    expect(startLvl).toBe(0);
    console.log('✅ Старт на уровне 0');

    // ═══ ФАЗА 1 — Астоф (17 реплик) ═════════════════════════════════════════
    // Астоф: x:5, y:5
    console.log('💬 Разговор с Астофом...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForQuest(page, adapter, 'Найти уже девушку..^.^');
    console.log('✅ Квест: "Найти уже девушку..^.^"');

    // ═══ ФАЗА 2 — Ванесса (10 реплик) ════════════════════════════════════════
    // Ванесса: x:21, y:15
    console.log('💬 Разговор с Ванессой...');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Отправляйтесь к причалу');
    console.log('✅ Квест: "Отправляйтесь к причалу"');

    // ═══ ФАЗА 3 — Астоф везёт на уровень 1 (3 реплики) ══════════════════════
    console.log('💬 Астоф → уровень 1...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);
    console.log('✅ Уровень 1');

    // ═══ ФАЗА 4 — Кирил (15 реплик) ══════════════════════════════════════════
    // Кирил: x:33, y:4
    console.log('💬 Разговор с Кирилом...');
    await talkToNpc(page, adapter, 'Кирил', 33, 4);
    await waitForQuest(page, adapter, 'Найти подшутившего над Кирилом..');
    console.log('✅ Квест: "Найти подшутившего над Кирилом.."');

    // ═══ ФАЗА 5 — Бэтмен (29 реплик) ════════════════════════════════════════
    // Бэтмен активируется после farmerBob(). x:21, y:7
    console.log('💬 Разговор с Бэтменом...');
    await talkToNpc(page, adapter, 'Бэтмен', 21, 7);
    await waitForQuest(page, adapter, 'Расскажите Кирилу о Бэтмене');
    console.log('✅ Квест: "Расскажите Кирилу о Бэтмене"');

    // ═══ ФАЗА 6 — Кирил famerBob1 (9 реплик) ════════════════════════════════
    console.log('💬 Кирил — famerBob1...');
    await talkToNpc(page, adapter, 'Кирил', 33, 4);
    await waitForQuest(page, adapter, 'Выкопать морковку');
    console.log('✅ Квест: "Выкопать морковку"');

    // ═══ ФАЗА 7 — 9 морковок через adapter.addItem ══════════════════════════
    console.log('🥕 Добавляем 9 морковок...');
    await adapter.addItem(0, 9);
    await waitForQuest(page, adapter, 'Вернитесь к причалу', 15_000);
    console.log('✅ Квест: "Вернитесь к причалу"');

    // ═══ ФАЗА 8 — Астоф везёт обратно на уровень 0 ═══════════════════════════
    // Астоф на уровне 1: x:21, y:20
    console.log('💬 Астоф → уровень 0...');
    await talkToNpc(page, adapter, 'Астоф', 21, 20);
    await waitForLevel(page, adapter, 0);
    console.log('✅ Уровень 0');

    // ═══ ФАЗА 9 — Ванесса даёт топорик (3 реплики) ═══════════════════════════
    console.log('💬 Ванесса → топорик...');
    await talkToNpc(page, adapter, 'Ванесса', 21, 15);
    await waitForQuest(page, adapter, 'Найти работу..');
    console.log('✅ Квест: "Найти работу.."');

    // ═══ ФАЗА 10 — Даздраперма (13 реплик) ═══════════════════════════════════
    // Даздраперма: x:16, y:4
    console.log('💬 Даздраперма — квест зомби...');
    await talkToNpc(page, adapter, 'Даздраперма', 16, 4);
    await waitForQuest(page, adapter, 'Иди в порт..');
    console.log('✅ Квест: "Иди в порт.."');

    // ═══ ФАЗА 11 — Астоф везёт на уровень 1 (зачистка) ══════════════════════
    console.log('💬 Астоф → уровень 1 (зачистка)...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 1);
    console.log('✅ Уровень 1');

    // ═══ ФАЗА 12 — Убиваем 4 врагов на уровне 1 ════════════════════════════
    console.log('⚔️  Убиваем всех врагов на уровне 1...');
    await adapter.killAllEnemies();
    await waitForQuest(page, adapter, 'Вернитесь в деревню', 15_000);
    console.log('✅ Квест: "Вернитесь в деревню"');

    // ═══ ФАЗА 13 — Астоф везёт обратно на уровень 0 ════════════════════════
    console.log('💬 Астоф → уровень 0...');
    await talkToNpc(page, adapter, 'Астоф', 21, 20);
    await waitForLevel(page, adapter, 0);
    console.log('✅ Уровень 0');

    // ═══ ФАЗА 14 — Даздраперма permaEnd (15 реплик) ═════════════════════════
    console.log('💬 Даздраперма — permaEnd...');
    await talkToNpc(page, adapter, 'Даздраперма', 16, 4);
    await waitForQuest(page, adapter, 'Найти Артаку');
    console.log('✅ Квест: "Найти Артаку"');

    // ═══ ФАЗА 15 — Артака (13 реплик) ════════════════════════════════════════
    // Артака: x:24, y:5
    console.log('💬 Артака — задание подсолнухи...');
    await talkToNpc(page, adapter, 'Артака', 24, 5);
    await waitForQuest(page, adapter, 'Отправляйтесь на остров..');
    console.log('✅ Квест: "Отправляйтесь на остров.."');

    // ═══ ФАЗА 16 — Астоф везёт на уровень 2 ════════════════════════════════
    console.log('💬 Астоф → уровень 2...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 2);
    console.log('✅ Уровень 2');

    // ═══ ФАЗА 17 — 8 подсолнухов ═════════════════════════════════════════════
    console.log('🌻 Добавляем 8 подсолнухов...');
    await adapter.addItem(1, 8);
    await waitForQuest(page, adapter, 'Вернитесь к Астофу', 15_000);
    console.log('✅ Квест: "Вернитесь к Астофу"');

    // ═══ ФАЗА 18 — Астоф везёт обратно на уровень 0 ═════════════════════════
    // Астоф на уровне 2: x:27, y:20
    console.log('💬 Астоф → уровень 0...');
    await talkToNpc(page, adapter, 'Астоф', 27, 20);
    await waitForLevel(page, adapter, 0);
    console.log('✅ Уровень 0');

    // ═══ ФАЗА 19 — Артака artakEnd (5 реплик) ════════════════════════════════
    console.log('💬 Артака — получаем меч...');
    await talkToNpc(page, adapter, 'Артака', 24, 5);
    await waitForQuest(page, adapter, 'Отправляйтесь с Астовом');
    console.log('✅ Квест: "Отправляйтесь с Астовом"');

    // ═══ ФАЗА 20 — Астоф везёт на уровень 3 (финал) ═════════════════════════
    console.log('💬 Астоф → уровень 3 (финал)...');
    await talkToNpc(page, adapter, 'Астоф', 5, 5);
    await waitForLevel(page, adapter, 3);
    console.log('✅ Уровень 3 — финальная локация!');

    // ═══ ФАЗА 21 — Автор/Создатель (15 реплик) ═════════════════════════════
    // NPC name в lvl.js: 'Автор', x:12, y:8
    console.log('💬 Разговор с Автором (Создателем)...');
    await talkToNpc(page, adapter, 'Автор', 12, 8);
    await waitForQuest(page, adapter, 'Убей и Выживи');
    console.log('✅ Квест: "Убей и Выживи"');

    // ═══ ФАЗА 22 — Убиваем 14 врагов на уровне 3 ════════════════════════════
    console.log('⚔️  Убиваем всех врагов на уровне 3...');
    await adapter.killAllEnemies();
    await waitForQuest(page, adapter, 'Бэтмену что то Надо', 15_000);
    console.log('✅ Квест: "Бэтмену что то Надо"');

    // ═══ ФАЗА 23 — Финальный Бэтмен (5 реплик) ══════════════════════════════
    // Бэтмен на уровне 3: x:32, y:8
    console.log('💬 Финальный разговор с Бэтменом...');
    await talkToNpc(page, adapter, 'Бэтмен', 32, 8);
    await waitForQuest(page, adapter, 'Надрать жопу Бэтмену');
    console.log('✅ Квест: "Надрать жопу Бэтмену"');

    // ═══ ФАЗА 24 — Убиваем босса + приспешников ══════════════════════════════
    console.log('⚔️  Убиваем босса Бэтмена и приспешников...');
    await adapter.killAllEnemies();

    // После убийства всех врагов движок запускает _code.end() — диалог из 14 реплик.
    // Ждём открытия финального диалога и прокликиваем его.
    await expect.poll(
      async () => adapter.isDialogOpen(),
      { timeout: 10_000, message: 'Ждём открытия финального диалога end()' }
    ).toBe(true);
    console.log('💬 Финальный диалог открылся — кликаем...');
    await page.locator('#myCanvas').click({ force: true });
    await page.waitForTimeout(100);
    for (let i = 0; i < 20; i++) {
      const isOpen = await adapter.isDialogOpen();
      if (!isOpen) break;
      await pressSpace(page);
    }

    await waitForQuest(page, adapter, 'Игра пройдена. Спасибо.', 10_000);
    console.log('🏆 ИГРА ПРОЙДЕНА! Квест: "Игра пройдена. Спасибо."');
  });
});
