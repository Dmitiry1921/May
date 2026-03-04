import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../js/class/Storage.js', () => ({
  default: {
    _hero: {
      memory: { x: 999, y: 999, dump: { x: 999, y: 999 }, pos: 'top', cell: null, digger: 0 },
      sprite: { x: 2, y: 0 },
      options: { quest: null, digger: 0, tool: null, max: { health: 100 }, radios: 1, speed: 1, damage: 1, health: 100 },
      can: { attack: false, walk: true },
      type: 'hero',
      face: 0,
      nps: null,
    },
    _inventory: { tool: null },
  },
}));

describe('heroInit — always uses spawn coordinates from lvl.js', () => {
  let heroInit: typeof import('../../src/entities/MobManager').heroInit;
  let setMobManagerState: typeof import('../../src/entities/MobManager').setMobManagerState;
  let getHeroRef: typeof import('../../src/entities/MobManager').getHeroRef;

  beforeEach(async () => {
    vi.resetModules();

    vi.mock('../../js/class/Storage.js', () => ({
      default: {
        _hero: {
          memory: { x: 999, y: 999, dump: { x: 999, y: 999 }, pos: 'top', cell: null, digger: 0 },
          sprite: { x: 2, y: 0 },
          options: { quest: null, digger: 0, tool: null, max: { health: 100 }, radios: 1, speed: 1, damage: 1, health: 100 },
          can: { attack: false, walk: true },
          type: 'hero',
          face: 0,
          nps: null,
        },
        _inventory: { tool: null },
      },
    }));

    const mod = await import('../../src/entities/MobManager');
    heroInit = mod.heroInit;
    setMobManagerState = mod.setMobManagerState;
    getHeroRef = mod.getHeroRef;

    function FakePerson(this: any) {
      this.memory = { dump: {}, x: 0, y: 0, pos: '', cell: null, digger: 0 };
      this.options = { quest: null, digger: 0, tool: null, max: { health: 100 }, radios: 1, speed: 1, damage: 1, health: 100 };
      this.can = { attack: false, walk: true };
      this.nps = null;
    }

    setMobManagerState([], null, FakePerson, null);
  });

  it('level 0: hero spawns at (160, 96), not saved coords (999, 999)', () => {
    heroInit(0);
    const hero = getHeroRef();
    expect(hero.memory.x).toBe(5 * 32);
    expect(hero.memory.y).toBe(3 * 32);
    expect(hero.memory.dump.x).toBe(5 * 32);
    expect(hero.memory.dump.y).toBe(3 * 32);
  });

  it('level 1: hero spawns at (672, 608), not saved coords (999, 999)', () => {
    heroInit(1);
    const hero = getHeroRef();
    expect(hero.memory.x).toBe(21 * 32);
    expect(hero.memory.y).toBe(19 * 32);
    expect(hero.memory.dump.x).toBe(21 * 32);
    expect(hero.memory.dump.y).toBe(19 * 32);
  });

  it('level 2: hero spawns at (800, 640), not saved coords', () => {
    heroInit(2);
    const hero = getHeroRef();
    expect(hero.memory.x).toBe(25 * 32);
    expect(hero.memory.y).toBe(20 * 32);
  });

  it('level 3: hero spawns at (160, 416), not saved coords', () => {
    heroInit(3);
    const hero = getHeroRef();
    expect(hero.memory.x).toBe(5 * 32);
    expect(hero.memory.y).toBe(13 * 32);
  });

  it('hero.can.walk is true after init', () => {
    heroInit(0);
    const hero = getHeroRef();
    expect(hero.can.walk).toBe(true);
  });

  it('hero.memory.pos is bottom after init', () => {
    heroInit(0);
    const hero = getHeroRef();
    expect(hero.memory.pos).toBe('bottom');
  });
});

describe('drawTool — depth ordering: text renders above background rect', () => {
  it('_toolBgRect.depth < _toolText.depth (text visible over white rect)', async () => {
    // We can't instantiate real Phaser GameObjects in unit tests,
    // so we verify the depth values by reading the source constants.
    // The actual objects are created in ensureHeroSprite() with explicit depths.
    // This test reads Hero.ts source and verifies the depth relationship.
    const fs = await import('node:fs');
    const path = await import('node:path');
    const heroSource = fs.readFileSync(
      path.resolve(__dirname, '../../src/entities/Hero.ts'),
      'utf-8'
    );

    // Find _toolBgRect depth
    const bgRectMatch = heroSource.match(/_toolBgRect\s*=\s*_scene\.add\.rectangle\([^)]*\)[^;]*\.setDepth\(([^)]+)\)/);
    expect(bgRectMatch).not.toBeNull();
    const bgDepth = parseFloat(bgRectMatch![1]);

    // Find _toolText depth
    const textMatch = heroSource.match(/_toolText\s*=\s*_scene\.add\.text\([^)]*\{[^}]*\}\s*\)[^;]*\.setDepth\(([^)]+)\)/s);
    expect(textMatch).not.toBeNull();
    const textDepth = parseFloat(textMatch![1]);

    expect(bgDepth).toBeLessThan(textDepth);
    expect(textDepth).toBe(6);
    expect(bgDepth).toBe(5.5);
  });

  it('drawTool positions bgRect lower than original (tdy + 2 offset)', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const heroSource = fs.readFileSync(
      path.resolve(__dirname, '../../src/entities/Hero.ts'),
      'utf-8'
    );

    // Verify the bgRect uses tdy + 2 (lowered by 2px)
    const bgPosMatch = heroSource.match(/_toolBgRect\.setPosition\([^,]+,\s*tdy\s*\+\s*(\d+)\)/);
    expect(bgPosMatch).not.toBeNull();
    expect(parseInt(bgPosMatch![1])).toBe(2);

    // Verify the text uses tdy - 12 (lowered from -14 to -12)
    const textPosMatch = heroSource.match(/_toolText\.setText\([^)]*\)\.setPosition\([^,]+,\s*tdy\s*-\s*(\d+)\)/);
    expect(textPosMatch).not.toBeNull();
    expect(parseInt(textPosMatch![1])).toBe(12);
  });
});
