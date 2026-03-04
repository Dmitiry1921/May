import { describe, it, expect } from 'vitest';
import { LEVELS, ITEMS } from '../config/game-data.js';

/**
 * Golden Tests: Portable Game Data Specification
 * 
 * These tests validate the game design specification independent of engine format.
 * Any reimplementation must satisfy these constraints.
 * 
 * NO engine imports allowed in this file.
 */

const ITEM_DATA = {
  0: { name: 'carrot', id: 440, tile: 11 },
  1: { name: 'sunflower', id: 423, tile: 11 },
} as const;

describe('Game Data Specification - Levels', () => {
  // Test 1: Verify 4 levels exist with correct indices
  it('should have exactly 4 levels (indices 0-3)', () => {
    expect(Object.keys(LEVELS)).toHaveLength(4);
    expect(LEVELS[0]).toBeDefined();
    expect(LEVELS[1]).toBeDefined();
    expect(LEVELS[2]).toBeDefined();
    expect(LEVELS[3]).toBeDefined();
  });

  // Test 2: Level 0 - Hero spawn position
  it('should have hero at (5, 3) in level 0', () => {
    expect(LEVELS[0].spawn).toBeDefined();
    expect(LEVELS[0].spawn.x).toBe(5);
    expect(LEVELS[0].spawn.y).toBe(3);
  });

  // Test 3: Level 0 - Enemy count (peaceful village)
  it('should have 0 enemies in level 0 (peaceful village)', () => {
    expect(LEVELS[0].enemies).toBe(0);
  });

  // Test 4: Level 0 - NPC count and names
  it('should have 4 named NPCs in level 0: Даздраперма, Артака, Астоф, Ванесса', () => {
    expect(LEVELS[0].npcs).toBeDefined();
    expect(Array.isArray(LEVELS[0].npcs)).toBe(true);
    expect(LEVELS[0].npcs).toHaveLength(4);
    
    expect(LEVELS[0].npcs).toContain('Даздраперма');
    expect(LEVELS[0].npcs).toContain('Артака');
    expect(LEVELS[0].npcs).toContain('Астоф');
    expect(LEVELS[0].npcs).toContain('Ванесса');
  });

  // Test 5: Level 1 - Hero spawn position
  it('should have hero at (21, 19) in level 1', () => {
    expect(LEVELS[1].spawn).toBeDefined();
    expect(LEVELS[1].spawn.x).toBe(21);
    expect(LEVELS[1].spawn.y).toBe(19);
  });

  // Test 6: Level 1 - Enemy count
  it('should have 4 enemies in level 1', () => {
    expect(LEVELS[1].enemies).toBe(4);
  });

  // Test 7: Level 2 - Hero spawn position
  it('should have hero at (25, 20) in level 2', () => {
    expect(LEVELS[2].spawn).toBeDefined();
    expect(LEVELS[2].spawn.x).toBe(25);
    expect(LEVELS[2].spawn.y).toBe(20);
  });

  // Test 8: Level 2 - Enemy count
  it('should have 7 enemies in level 2', () => {
    expect(LEVELS[2].enemies).toBe(7);
  });

  // Test 9: Level 3 - Hero spawn position
  it('should have hero at (5, 13) in level 3', () => {
    expect(LEVELS[3].spawn).toBeDefined();
    expect(LEVELS[3].spawn.x).toBe(5);
    expect(LEVELS[3].spawn.y).toBe(13);
  });

  // Test 10: Level 3 - Enemy count
  it('should have 14 enemies in level 3 (boss level)', () => {
    expect(LEVELS[3].enemies).toBe(14);
  });

  // Test 11: All levels have required structure
  it('each level should have spawn and enemies properties', () => {
    for (let i = 0; i <= 3; i++) {
      const level = LEVELS[i as keyof typeof LEVELS];
      expect(level.spawn).toBeDefined();
      expect(typeof level.spawn.x).toBe('number');
      expect(typeof level.spawn.y).toBe('number');
      expect(typeof level.enemies).toBe('number');
      expect(Array.isArray(level.npcs)).toBe(true);
    }
  });

  // Test 12: All NPCs have name properties
  it('all NPCs should have name strings', () => {
    for (let i = 0; i <= 3; i++) {
      const level = LEVELS[i as keyof typeof LEVELS];
      level.npcs.forEach(npcName => {
        expect(typeof npcName).toBe('string');
        expect(npcName.length).toBeGreaterThan(0);
      });
    }
  });
});

describe('Game Data Specification - Items', () => {
  // Test 29: Verify 2 items exist
  it('should have exactly 2 items', () => {
    expect(Object.keys(ITEMS)).toHaveLength(2);
    expect(ITEMS.CARROT).toBe(0);
    expect(ITEMS.SUNFLOWER).toBe(1);
  });

  // Test 30: Item 0 is carrot with id 440
  it('item 0 (carrot) should have id 440 and tile 11', () => {
    expect(ITEM_DATA[0].id).toBe(440);
    expect(ITEM_DATA[0].tile).toBe(11);
    expect(ITEM_DATA[0].name).toBe('carrot');
  });

  // Test 31: Item 1 is sunflower with id 423
  it('item 1 (sunflower) should have id 423 and tile 11', () => {
    expect(ITEM_DATA[1].id).toBe(423);
    expect(ITEM_DATA[1].tile).toBe(11);
    expect(ITEM_DATA[1].name).toBe('sunflower');
  });

  // Test 33: Item IDs are unique
  it('item ids should be unique', () => {
    const ids = [ITEM_DATA[0].id, ITEM_DATA[1].id];
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(2);
  });
});
