import type { Page } from '@playwright/test';
import type {
  TestAdapter,
  GameConfig,
  HeroPos,
  HeroState,
  EnemyInfo,
  NpcInfo,
  MobInfo,
  DialogText,
  HudState,
  ItemTile,
  TileSize,
  CollisionResult,
  HeroCollisionBox,
  EnemyPathState,
  EnemyAIState,
  MobLifecycleState,
  QuestState,
  MobCount,
} from '../types/test-adapter';

const DEFAULT_CONFIG: GameConfig = {
  canvasSelector: '#myCanvas',
  baseUrl: 'http://localhost:8080',
};

/**
 * PlaywrightAdapter — реализация TestAdapter для текущего движка.
 * Все вызовы проксируются через page.evaluate → window.May._test.
 */
export class PlaywrightAdapter implements TestAdapter {
  constructor(
    private readonly page: Page,
    private readonly config: GameConfig,
  ) {}

  // ===========================================================================
  // Utility methods
  // ===========================================================================

  /** Wait for the game canvas to appear in DOM */
  async waitForCanvas(): Promise<void> {
    await this.page.waitForSelector(this.config.canvasSelector);
  }

  /** Navigate to the game and wait for canvas */
  async navigateToGame(): Promise<void> {
    await this.page.goto(this.config.baseUrl);
    await this.waitForCanvas();
  }

  // ===========================================================================
  // ReadState — query game state, no side effects
  // ===========================================================================

  async getHeroPos(): Promise<HeroPos | null> {
    return this.page.evaluate(() => window.May._test.getHeroPos());
  }

  async getHeroState(): Promise<HeroState | null> {
    return this.page.evaluate(() => window.May._test.getHeroState());
  }

  async getHeroDirection(): Promise<string | null> {
    return this.page.evaluate(() => window.May._test.getHeroDirection());
  }

  async getHeroHealth(): Promise<number | null> {
    return this.page.evaluate(() => window.May._test.getHeroHealth());
  }

  async getHeroPixelPos(): Promise<HeroPos | null> {
    return this.page.evaluate(() => window.May._test.getHeroPixelPos());
  }

  async getEnemies(): Promise<EnemyInfo[]> {
    return this.page.evaluate(() => window.May._test.getEnemies());
  }

  async getEnemyCount(): Promise<number> {
    return this.page.evaluate(() => window.May._test.listEnemies());
  }

  async getAllNpcs(): Promise<NpcInfo[]> {
    return this.page.evaluate(() => window.May._test.getAllNpcs());
  }

  async getNpcPosition(name: string): Promise<HeroPos | null> {
    return this.page.evaluate((n) => window.May._test.getNpcPosition(n), name);
  }

  async getMobInfo(name: string): Promise<MobInfo | null> {
    return this.page.evaluate((n) => window.May._test.getMobInfo(n), name);
  }

  async isDialogOpen(): Promise<boolean> {
    return this.page.evaluate(() => window.May._test.isDialogOpen());
  }

  async getDialogText(): Promise<DialogText | null> {
    return this.page.evaluate(() => window.May._test.getDialogText());
  }

  async getQuestText(): Promise<string | null> {
    return this.page.evaluate(() => window.May._test.getQuestText());
  }

  async isInventoryVisible(): Promise<boolean> {
    return this.page.evaluate(() => window.May._test.isInventoryVisible());
  }

  async getInventory(): Promise<unknown | null> {
    return this.page.evaluate(() => window.May._test.getInventory());
  }

  async getItemCount(itemId: number): Promise<number> {
    return this.page.evaluate((id) => window.May._test.getItemCount(id), itemId);
  }

  async getLevel(): Promise<number> {
    return this.page.evaluate(() => window.May._test.getLevel());
  }

  async isGameOver(): Promise<boolean> {
    return this.page.evaluate(() => window.May._test.isGameOver());
  }

  async isGameRunning(): Promise<boolean> {
    return this.page.evaluate(() => window.May._test.isGameRunning());
  }

  async getHudState(): Promise<HudState> {
    return this.page.evaluate(() => window.May._test.getHudState());
  }

  async findItemTiles(itemId: number): Promise<ItemTile[]> {
    return this.page.evaluate((id) => window.May._test.findItemTiles(id), itemId);
  }

  async getHeroAnimFrame(): Promise<number | null> {
    return this.page.evaluate(() => window.May._test.getHeroAnimFrame());
  }

  async getHeroAttackRadius(): Promise<number | null> {
    return this.page.evaluate(() => window.May._test.getHeroAttackRadius());
  }

  async getTileSize(): Promise<TileSize> {
    return this.page.evaluate(() => window.May._test.getTileSize());
  }

  async getKeyDownState(): Promise<Record<string, boolean>> {
    return this.page.evaluate(() => window.May._test.getKeyDownState());
  }

  async checkCollisionAt(px: number, py: number): Promise<CollisionResult> {
    return this.page.evaluate(
      ({ px, py }) => window.May._test.checkCollisionAt(px, py),
      { px, py },
    );
  }

  // ===========================================================================
  // Actions — mutations for test setup and manipulation
  // ===========================================================================

  async teleport(tx: number, ty: number): Promise<void> {
    await this.page.evaluate(
      ({ x, y }) => window.May._test.teleport(x, y),
      { x: tx, y: ty },
    );
  }

  async talkTo(name: string): Promise<boolean> {
    return this.page.evaluate((n) => window.May._test.talkTo(n), name);
  }

  async killAllEnemies(): Promise<void> {
    await this.page.evaluate(() => window.May._test.killAllEnemies());
  }

  async addItem(itemId: number, count: number): Promise<void> {
    await this.page.evaluate(
      ({ id, c }) => window.May._test.addItem(id, c),
      { id: itemId, c: count },
    );
  }

  async setHeroHealth(hp: number): Promise<void> {
    await this.page.evaluate((hp) => window.May._test.setHeroHealth(hp), hp);
  }

  async damageHero(amount: number): Promise<void> {
    await this.page.evaluate((a) => window.May._test.damageHero(a), amount);
  }

  async enableAttack(): Promise<void> {
    await this.page.evaluate(() => window.May._test.enableAttack());
  }

  async enableWalk(): Promise<void> {
    await this.page.evaluate(() => window.May._test.enableWalk());
  }

  async freezeNpcs(): Promise<void> {
    await this.page.evaluate(() => window.May._test.freezeNpcs());
  }

  async unfreezeNpcs(): Promise<void> {
    await this.page.evaluate(() => window.May._test.unfreezeNpcs());
  }

  async pauseGameLoop(): Promise<void> {
    await this.page.evaluate(() => window.May._test.pauseGameLoop());
  }

  async resumeGameLoop(): Promise<void> {
    await this.page.evaluate(() => window.May._test.resumeGameLoop());
  }

  async saveStat(): Promise<void> {
    await this.page.evaluate(() => window.May._test.saveStat());
  }

  async goToLevel(level: number): Promise<void> {
    // Composed: set level in localStorage, reload, wait for game
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.page.evaluate((l) => {
      localStorage.clear();
      localStorage.setItem('_lvl', JSON.stringify(l));
    }, level);
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForCanvas();
  }

  async clearStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  async pressKey(keyCode: number): Promise<void> {
    await this.page.evaluate((k) => window.May._test.pressKey(k), keyCode);
  }

  async releaseKey(keyCode: number): Promise<void> {
    await this.page.evaluate((k) => window.May._test.releaseKey(k), keyCode);
  }

  async getRenderingLayerOrder(): Promise<string[]> {
    return this.page.evaluate(() => window.May._test.getRenderingLayerOrder());
  }

  async getHeroCollisionBox(): Promise<HeroCollisionBox | null> {
    return this.page.evaluate(() => window.May._test.getHeroCollisionBox());
  }

  async checkCollisionAtPixel(px: number, py: number, w: number, h: number): Promise<boolean> {
    return this.page.evaluate(
      ({ px, py, w, h }) => window.May._test.checkCollisionAtPixel(px, py, w, h),
      { px, py, w, h },
    );
  }

  async getEnemyPath(name: string): Promise<EnemyPathState | null> {
    return this.page.evaluate((n) => window.May._test.getEnemyPath(n), name);
  }

  async getEnemyAIState(name: string): Promise<EnemyAIState | null> {
    return this.page.evaluate((n) => window.May._test.getEnemyAIState(n), name);
  }

  async getMobLifecycleState(name: string): Promise<MobLifecycleState> {
    return this.page.evaluate((n) => window.May._test.getMobLifecycleState(n), name);
  }

  async getRegisteredHooks(): Promise<string[]> {
    return this.page.evaluate(() => window.May._test.getRegisteredHooks());
  }

  async getQuestState(): Promise<QuestState> {
    return this.page.evaluate(() => window.May._test.getQuestState());
  }

  async getMobCount(): Promise<MobCount> {
    return this.page.evaluate(() => window.May._test.getMobCount());
  }

  async getNpcCode(name: string): Promise<string | null> {
    return this.page.evaluate((n) => window.May._test.getNpcCode(n), name);
  }

  async triggerNpcDialog(name: string): Promise<boolean> {
    return this.page.evaluate((n) => window.May._test.triggerNpcDialog(n), name);
  }

  async addTestHookAfterLoadMob(hookCode: string): Promise<void> {
    await this.page.evaluate((h) => window.May._test.addTestHookAfterLoadMob(h), hookCode);
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a PlaywrightAdapter with optional config overrides.
 * Default config: canvasSelector='#myCanvas', baseUrl='http://localhost:8080'
 */
export function createPlaywrightAdapter(
  page: Page,
  config?: Partial<GameConfig>,
): TestAdapter {
  return new PlaywrightAdapter(page, { ...DEFAULT_CONFIG, ...config });
}
