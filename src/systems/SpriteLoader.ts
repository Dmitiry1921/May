import { _spt } from '../data/sprites';

function genArr(
  columns: number,
  rows: number
): Record<number, Record<number, null>> {
  const arr: Record<number, Record<number, null>> = {};
  for (let i = 0; i < columns; i++) {
    arr[i] = {};
    for (let j = 0; j < rows; j++) {
      arr[i][j] = null;
    }
  }
  return arr;
}

export const SpriteLoader = {
  loaded: false,

  register(scene: Phaser.Scene): void {
    const spt = _spt as Record<string, Record<string, unknown>>;
    Object.entries(spt).forEach(([key, itm]) => {
      const urls = itm.url as string[] | undefined;
      if (!urls) return;
      for (let j = 0; j < urls.length; j++) {
        const textureKey = `${key}_${j}`;
        if (!scene.textures.exists(textureKey)) {
          scene.load.image(textureKey, urls[j]);
        }
      }
    });
  },

  load(scene: Phaser.Scene, callback: () => void): void {
    const spt = _spt as Record<string, Record<string, unknown>>;
    Object.entries(spt).forEach(([key, itm]) => {
      const urls = itm.url as string[] | undefined;
      if (!urls) return;
      if (itm.dom === undefined) itm['dom'] = {};
      const dom = itm['dom'] as Record<string, HTMLImageElement>;
      for (let j = 0; j < urls.length; j++) {
        const textureKey = `${key}_${j}`;
        if (scene.textures.exists(textureKey)) {
          dom[j] = scene.textures.get(textureKey).getSourceImage() as HTMLImageElement;
        }
      }
    });
    this.genMap();
    this.loaded = true;
    callback();
  },

  genMap(): void {
    const spt = _spt as Record<string, Record<string, unknown>>;
    for (const id in spt) {
      const itm = spt[id];
      const count = itm.count as { x: number; y: number; mini: { x: number; y: number } } | undefined;
      const f = itm.frame as Record<string, number | null>;
      if (!f) continue;
      const img = (itm.dom as Record<string, HTMLImageElement> | undefined)?.[0];
      if (count !== undefined && img) {
        f.w = img.width / count.mini.x;
        f.h = img.height / count.mini.y;
        f.bw = img.width / count.x;
        f.bh = img.height / count.y;
        itm.map = genArr(count.x, count.y);
        for (let x = 0; x < count.x; x++) {
          for (let y = 0; y < count.y; y++) {
            (itm.map as Record<number, Record<number, { x: number; y: number } | null>>)[x][y] = {
              x: x ? (f.bw as number) * x : 0,
              y: y ? (f.bh as number) * y : 0,
            };
          }
        }
      }
    }
  }
};
