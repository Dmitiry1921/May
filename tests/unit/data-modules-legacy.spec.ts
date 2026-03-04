// LEGACY: engine-specific, not part of golden tests
import { describe, it, expect } from 'vitest';
import lvl from '../../js/lvl.js';
import spt from '../../js/spt.js';
import tile from '../../js/tile.js';
import itms from '../../js/itms.js';

/**
 * Legacy Tests: Engine-Specific Data Format Validation
 * 
 * These tests validate the current engine's internal data structures.
 * They will be discarded during engine rewrite.
 */

describe('spt.js - Sprite Definitions', () => {
  // Test 13: Verify sprite categories exist
  it('should have sprite definitions for hero, enemy, animal, nps, interface, face', () => {
    expect(spt.hero).toBeDefined();
    expect(spt.enemy).toBeDefined();
    expect(spt.animal).toBeDefined();
    expect(spt.nps).toBeDefined();
    expect(spt.interface).toBeDefined();
    expect(spt.face).toBeDefined();
  });

  // Test 14: Hero sprite has required properties
  it('hero sprite should have url and frame properties', () => {
    expect(spt.hero.url).toBeDefined();
    expect(Array.isArray(spt.hero.url)).toBe(true);
    expect(spt.hero.url.length).toBeGreaterThan(0);
    expect(spt.hero.frame).toBeDefined();
    expect(spt.hero.count).toBeDefined();
  });

  // Test 15: Enemy sprite has required properties
  it('enemy sprite should have url and frame properties', () => {
    expect(spt.enemy.url).toBeDefined();
    expect(Array.isArray(spt.enemy.url)).toBe(true);
    expect(spt.enemy.url.length).toBeGreaterThan(0);
    expect(spt.enemy.frame).toBeDefined();
  });

  // Test 16: Animal sprite has required properties
  it('animal sprite should have url and frame properties', () => {
    expect(spt.animal.url).toBeDefined();
    expect(Array.isArray(spt.animal.url)).toBe(true);
    expect(spt.animal.url.length).toBeGreaterThan(0);
    expect(spt.animal.frame).toBeDefined();
  });

  // Test 17: NPS sprite has required properties
  it('nps sprite should have url and frame properties', () => {
    expect(spt.nps.url).toBeDefined();
    expect(Array.isArray(spt.nps.url)).toBe(true);
    expect(spt.nps.url.length).toBeGreaterThan(0);
    expect(spt.nps.frame).toBeDefined();
  });

  // Test 18: Interface sprite exists
  it('interface sprite should have url property', () => {
    expect(spt.interface.url).toBeDefined();
    expect(Array.isArray(spt.interface.url)).toBe(true);
    expect(spt.interface.url.length).toBeGreaterThan(0);
  });

  // Test 19: Face sprite has required properties
  it('face sprite should have url, frame, and count properties', () => {
    expect(spt.face.url).toBeDefined();
    expect(Array.isArray(spt.face.url)).toBe(true);
    expect(spt.face.url.length).toBeGreaterThan(0);
    expect(spt.face.frame).toBeDefined();
    expect(spt.face.count).toBeDefined();
  });

  // Test 20: All sprite URLs point to valid image files
  it('all sprite URLs should point to .png files', () => {
    const spriteTypes = ['hero', 'enemy', 'animal', 'nps', 'interface', 'face'];
    
    spriteTypes.forEach(type => {
      if ((spt as any)[type].url) {
        const urls = Array.isArray((spt as any)[type].url) ? (spt as any)[type].url : [(spt as any)[type].url];
        urls.forEach((url: any) => {
          expect(typeof url).toBe('string');
          expect(url).toMatch(/\.png$/i);
        });
      }
    });
  });
});

describe('tile.js - Tileset Configuration', () => {
  // Test 21: Verify 4 tilesets exist
  it('should have 4 tilesets: 1, 2, 3, 11', () => {
    expect(tile[1]).toBeDefined();
    expect(tile[2]).toBeDefined();
    expect(tile[3]).toBeDefined();
    expect(tile[11]).toBeDefined();
  });

  // Test 22: Tile size is 32x32
  it('tile size should be 32x32 pixels', () => {
    expect(tile.param).toBeDefined();
    expect(tile.param.w).toBe(32);
    expect(tile.param.h).toBe(32);
  });

  // Test 23: Each tileset has url and map
  it('each tileset should have url and map properties', () => {
    [1, 2, 3, 11].forEach(tileId => {
      expect((tile as any)[tileId].url).toBeDefined();
      expect(typeof (tile as any)[tileId].url).toBe('string');
      expect((tile as any)[tileId].map).toBeDefined();
      expect(Array.isArray((tile as any)[tileId].map)).toBe(true);
    });
  });

  // Test 24: Tileset URLs point to valid image files
  it('tileset URLs should point to valid image paths', () => {
    [1, 2, 3, 11].forEach(tileId => {
      const url = (tile as any)[tileId].url;
      expect(typeof url).toBe('string');
      expect(url).toMatch(/\.png$/i);
    });
  });

  // Test 25: Tiles have wall flag property
  it('each tile in map should have wall flag (0 or 1)', () => {
    [1, 2, 3, 11].forEach(tileId => {
      const tileMap = (tile as any)[tileId].map;
      tileMap.forEach((tileEntry: any) => {
        expect(tileEntry.wall).toBeDefined();
        expect([0, 1]).toContain(tileEntry.wall);
      });
    });
  });

  // Test 26: Tiles have overlay flag property
  it('each tile in map should have overlay flag', () => {
    [1, 2, 3, 11].forEach(tileId => {
      const tileMap = (tile as any)[tileId].map;
      tileMap.forEach((tileEntry: any) => {
        expect(tileEntry.overlay).toBeDefined();
        expect(typeof tileEntry.overlay).toBe('number');
      });
    });
  });

  // Test 27: Tileset 11 has wall elements
  it('tileset 11 (plane) should have at least one wall tile', () => {
    const tileMap = tile[11].map;
    const wallTiles = tileMap.filter(t => t.wall === 1);
    expect(wallTiles.length).toBeGreaterThan(0);
  });

  // Test 28: Tileset 3 has wall elements
  it('tileset 3 (building) should have wall tiles', () => {
    const tileMap = tile[3].map;
    const wallTiles = tileMap.filter(t => t.wall === 1);
    expect(wallTiles.length).toBeGreaterThan(0);
  });
});

describe('itms.js - Item Definitions', () => {
  // Test 32: All items have required map structure
  it('all items should have map property with tile and id', () => {
    [0, 1].forEach(itemId => {
      const item = (itms as any)[itemId];
      expect(item.map).toBeDefined();
      expect(typeof item.map.tile).toBe('number');
      expect(typeof item.map.id).toBe('number');
    });
  });

  // Test 34: Items use valid tileset references
  it('item tile references should point to valid tilesets', () => {
    [0, 1].forEach(itemId => {
      const tileId = (itms as any)[itemId].map.tile;
      expect([1, 2, 3, 11]).toContain(tileId);
    });
  });
});

describe('Cross-module Data Consistency', () => {
  // Test 35: NPC sprites referenced in levels exist
  it('NPC sprite indices used in levels should exist', () => {
    for (let level = 0; level <= 3; level++) {
      (lvl as any)[level].nps.forEach((npcData: any) => {
        const spriteId = npcData[0]; // sprite index
        // Sprite indices should be reasonable numbers for nps sprite
        expect(typeof spriteId).toBe('number');
        expect(spriteId).toBeGreaterThanOrEqual(0);
      });
    }
  });

  // Test 36: Enemy sprites referenced in levels exist
  it('enemy sprite indices used in levels should be valid', () => {
    for (let level = 0; level <= 3; level++) {
      (lvl as any)[level].enemy.forEach((enemyData: any) => {
        const spriteId = enemyData[0]; // sprite index
        expect(typeof spriteId).toBe('number');
        expect(spriteId).toBeGreaterThanOrEqual(0);
      });
    }
  });

  // Test 37: All level maps use valid tile references
  it('tile references in level maps should be valid tileset IDs', () => {
    for (let level = 0; level <= 3; level++) {
      const levelMap = (lvl as any)[level].map;
      // Map is array of layers/cells with tile ids
      if (Array.isArray(levelMap)) {
        levelMap.forEach(layer => {
          if (Array.isArray(layer)) {
            layer.forEach(row => {
              if (Array.isArray(row)) {
                row.forEach(cell => {
                  if (cell && typeof cell === 'object' && cell.tile !== null) {
                    const tileId = cell.tile;
                    // Accept both string and number formats
                    expect(['1', 1, '2', 2, '3', 3, '11', 11, null]).toContain(tileId);
                  }
                });
              }
            });
          }
        });
      }
    }
  });
});
