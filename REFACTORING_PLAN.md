# План рефакторинга «Майские острова»

**Ветка:** `refactor/phaser3`  
**Стек:** Phaser 3 + TypeScript + Vite + Vitest + Playwright  
**Стратегия:** Strangler Fig — параллельная переписка. Старая игра работает как эталон.

---

## Технологический стек

| Назначение | Было | Станет | Обоснование |
|---|---|---|---|
| Рендеринг | Canvas API вручную | **Phaser 3** | Камера, сцены, fullscreen, анимации, Tiled из коробки |
| Язык | Vanilla JS | **TypeScript** | Типобезопасность, рефакторинг, IDE-поддержка |
| Сборка | нет (ES Modules напрямую) | **Vite** | HMR, tree-shaking, production build |
| Unit-тесты | Mocha (только MobMicroTask) | **Vitest** | Natively TS, быстрый, совместим с Vite |
| E2E-тесты | нет | **Playwright** | Браузерный, надёжный, скриншоты |
| Карты | JS-массивы в lvl.js | **Tiled JSON** | Единый источник правды, визуальный редактор |

---

## Архитектура нового проекта

```
may-islands/              ← новый Vite-проект (рядом или внутри May/)
├── src/
│   ├── main.ts           ← точка входа Phaser
│   ├── config.ts         ← Phaser.Game config
│   │
│   ├── scenes/           ← СЦЕНЫ (аналог текущих уровней)
│   │   ├── BootScene.ts  ← предзагрузка ассетов
│   │   ├── MenuScene.ts  ← главное меню
│   │   ├── GameScene.ts  ← основная игровая сцена
│   │   └── UIScene.ts    ← HUD (HP, инвентарь, диалоги) — поверх GameScene
│   │
│   ├── systems/          ← СИСТЕМЫ (логика без состояния)
│   │   ├── MovementSystem.ts    ← WASD + коллизии
│   │   ├── DialogSystem.ts      ← диалоги, очередь реплик
│   │   ├── QuestSystem.ts       ← выдача/проверка квестов
│   │   ├── InventorySystem.ts   ← инвентарь (5 слотов)
│   │   ├── CombatSystem.ts      ← HP, атака, смерть
│   │   └── PathfindingSystem.ts ← A* для NPC/врагов
│   │
│   ├── entities/         ← СУЩНОСТИ
│   │   ├── Hero.ts       ← класс героя
│   │   ├── NPC.ts        ← NPC (type: npc/animal)
│   │   └── Enemy.ts      ← враги (type: enemy, FSM: idle/patrol/chase/attack)
│   │
│   ├── data/             ← ДАННЫЕ (типизированные, из старых lvl.js/spt.js/tile.js)
│   │   ├── levels/       ← Tiled JSON карты (0.json, 1.json, 2.json, 3.json)
│   │   ├── sprites.ts    ← типизированный аналог spt.js
│   │   ├── tiles.ts      ← типизированный аналог tile.js
│   │   └── items.ts      ← типизированный аналог itms.js
│   │
│   ├── scripting/        ← СКРИПТИНГ (DSL квестов)
│   │   ├── MobMicroTask.ts  ← переписанный MobMicroTask с валидацией
│   │   └── quests.ts        ← переписанный code.js
│   │
│   ├── storage/
│   │   └── SaveSystem.ts ← Storage + schemaVersion + миграции сейвов
│   │
│   └── utils/
│       └── ImageLoader.ts
│
├── public/
│   └── assets/           ← img/ (спрайты, тайлы) — без изменений
│
├── tests/
│   ├── unit/             ← Vitest unit-тесты
│   │   ├── MobMicroTask.spec.ts
│   │   ├── PathfindingSystem.spec.ts
│   │   ├── QuestSystem.spec.ts
│   │   ├── InventorySystem.spec.ts
│   │   ├── CombatSystem.spec.ts
│   │   └── SaveSystem.spec.ts
│   └── e2e/              ← Playwright e2e
│       ├── game-loads.spec.ts
│       ├── hero-moves.spec.ts
│       ├── dialog.spec.ts
│       ├── quest-village.spec.ts
│       └── level-switch.spec.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## Фазы работы

### ФАЗА 0 — Покрытие тестами (ТЕКУЩАЯ ЗАДАЧА)

> Цель: задокументировать поведение старой игры тестами ДО переписывания.  
> Если тест сломается — значит что-то пошло не так при миграции.

**0.1 Unit-тесты (Vitest / Mocha на старом коде)**

| Что тестировать | Файл | Приоритет |
|---|---|---|
| MobMicroTask — парсинг, вызов команд, edge cases | `js/class/test/MobMicroTask.spec.js` | ✅ уже есть (расширить) |
| Storage — get/set, автосейв, зарезервированные ключи, `setOnce` | новый файл | 🔴 высокий |
| A* pathfinding (`Enemy.findPath`) | новый файл | 🔴 высокий |
| Логика инвентаря (`_Hero.inventory`) | новый файл | 🟡 средний |
| Квестовая логика (`_Hero.setQuest`, проверки) | новый файл | 🟡 средний |
| Система HP / урона | новый файл | 🟡 средний |
| Коллизии (`_Map.isWall`) | новый файл | 🟡 средний |

**0.2 E2E-тесты (Playwright)**

| Сценарий | Описание |
|---|---|
| Игра запускается | Открыть index.html, canvas отрисовывается, герой виден |
| Герой двигается | Нажать WASD, герой меняет позицию |
| Диалог открывается | Подойти к NPC, нажать Enter, диалог появился |
| Квест деревни | Взять квест у Дазды, собрать предметы, сдать |
| Переключение уровня | Дойти до портала, уровень изменился |

---

### ФАЗА 1 — Настройка нового проекта

- [ ] Создать `may-islands/` рядом с текущим проектом
- [ ] Настроить Vite + TypeScript + Vitest
- [ ] Перенести ассеты `img/` без изменений
- [ ] Настроить Phaser 3, убедиться что canvas рендерится
- [ ] Настроить Playwright для e2e

---

### ФАЗА 2 — Перенос данных

- [ ] Сконвертировать карты из `lvl.js` в Tiled JSON (0.json–3.json)
- [ ] Типизировать `spt.js` → `sprites.ts`
- [ ] Типизировать `tile.js` → `tiles.ts`
- [ ] Типизировать `itms.js` → `items.ts`

---

### ФАЗА 3 — Переписывание систем (по одной!)

Порядок: каждая система переписывается с тестами ОДНОВРЕМЕННО.

1. **SaveSystem** — Storage + schemaVersion + тест совместимости старых сейвов
2. **MobMicroTask** — переписать на TS, добавить валидацию и unit-тесты
3. **MovementSystem** — WASD + коллизии тайлов
4. **PathfindingSystem** — A* из `Enemy.findPath`
5. **DialogSystem** — диалоги, очередь реплик, аватарки
6. **InventorySystem** — 5 слотов, инструмент в руке
7. **QuestSystem** — `setQuest` + проверки
8. **CombatSystem** — HP, атака, смерть

---

### ФАЗА 4 — Сцены и сущности

- [ ] Hero.ts
- [ ] NPC.ts + Enemy.ts (FSM: idle → patrol → chase → attack)
- [ ] BootScene (предзагрузка)
- [ ] GameScene (основная)
- [ ] UIScene (HUD поверх)
- [ ] MenuScene

---

### ФАЗА 5 — Новые возможности

> Только после полной миграции всего функционала.

- [ ] Камера следит за героем (Phaser Camera)
- [ ] Fullscreen режим (Phaser Scale Manager)
- [ ] Исправить z-order NPC по оси Y
- [ ] Исправить баг с Кириллом (busy не выставляется)
- [ ] Звуки и музыка (Phaser Sound Manager)
- [ ] Адаптивный экран (мобильные?)

---

## Стратегия тестирования

### Unit-тесты (Vitest) — что и как

```
Тестируем ЛОГИКУ, а не Phaser.
Все системы должны быть независимы от Phaser (pure functions / classes).

Пример:
  PathfindingSystem.findPath(grid, start, end) → Point[]
  QuestSystem.checkCompletion(quest, inventory) → boolean
  MobMicroTask.execute(command, context) → void
```

### E2E-тесты (Playwright) — что и как

```
Тестируем СЦЕНАРИИ игрока.
5–7 ключевых сценариев, не больше.
Скриншоты как fallback при рефакторинге.
```

### Золотое правило

> Перед переписыванием каждой системы — тест написан.  
> После переписывания — тот же тест должен пройти.

---

## Известные баги (починить в процессе)

1. Z-order по оси Y — NPC проходит «сквозь» другой
2. Кирилл не уходит после первого диалога (busy не выставляется)
3. Некорректное поведение мобов при переключении уровней
