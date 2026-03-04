/**
 * MapFacade — adapter exposing legacy _Map interface for code.js
 *
 * Delegates searchNPS() to _Mobs iteration and levelSet() to the
 * actual TileMap implementation.
 */

export interface MapFacade {
  searchNPS(name: string): any | undefined;
  levelSet(lvl: number): void;
}

export function createMapFacade(
  tileMap: { levelSet(lvl: number): void },
  getMobs: () => any[],
): MapFacade {
  return {
    searchNPS(name: string): any | undefined {
      return Object.values(getMobs()).find(
        (mob: any) => mob.type === 'nps' && mob.options.name === name,
      );
    },
    levelSet(lvl: number): void {
      // Defer to next event loop tick to avoid calling levelSet synchronously inside
      // Phaser's update() loop. Destroying tilemap layers mid-render crashes Phaser.
      setTimeout(() => tileMap.levelSet(lvl), 0);
    },
  };
}
