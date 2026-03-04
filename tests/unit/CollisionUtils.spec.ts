import { describe, it, expect } from 'vitest';
import { isCollision } from '../../js/class/CollisionUtils.js';

describe('CollisionUtils - isCollision', () => {
  it('should detect overlapping rectangles (basic overlap)', () => {
    // Rectangle 1: x=0, y=0, w=10, h=10
    // Rectangle 2: x=5, y=5, w=10, h=10
    // These overlap in the region (5,5)-(10,10)
    const result: boolean = isCollision(0, 0, 10, 10, 5, 5, 10, 10);
    expect(result).toBe(true);
  });

  it('should detect when first rectangle is completely inside second', () => {
    // Rectangle 1: x=5, y=5, w=2, h=2 (small rectangle)
    // Rectangle 2: x=0, y=0, w=20, h=20 (large rectangle)
    const result: boolean = isCollision(5, 5, 2, 2, 0, 0, 20, 20);
    expect(result).toBe(true);
  });

  it('should detect when second rectangle is completely inside first', () => {
    // Rectangle 1: x=0, y=0, w=20, h=20 (large rectangle)
    // Rectangle 2: x=5, y=5, w=2, h=2 (small rectangle)
    const result: boolean = isCollision(0, 0, 20, 20, 5, 5, 2, 2);
    expect(result).toBe(true);
  });

  it('should detect identical rectangles as colliding', () => {
    // Same rectangle at same position with same dimensions
    const result: boolean = isCollision(10, 10, 50, 50, 10, 10, 50, 50);
    expect(result).toBe(true);
  });

  it('should NOT detect collision when rectangles are separate (to the left)', () => {
    // Rectangle 1: x=0, y=0, w=10, h=10
    // Rectangle 2: x=20, y=0, w=10, h=10 (10 pixels gap)
    const result: boolean = isCollision(0, 0, 10, 10, 20, 0, 10, 10);
    expect(result).toBe(false);
  });

  it('should NOT detect collision when rectangles are separate (to the right)', () => {
    // Rectangle 1: x=20, y=0, w=10, h=10
    // Rectangle 2: x=0, y=0, w=10, h=10 (10 pixels gap)
    const result: boolean = isCollision(20, 0, 10, 10, 0, 0, 10, 10);
    expect(result).toBe(false);
  });

  it('should NOT detect collision when rectangles are separate (above)', () => {
    // Rectangle 1: x=0, y=0, w=10, h=10
    // Rectangle 2: x=0, y=20, w=10, h=10 (10 pixels gap)
    const result: boolean = isCollision(0, 0, 10, 10, 0, 20, 10, 10);
    expect(result).toBe(false);
  });

  it('should NOT detect collision when rectangles are separate (below)', () => {
    // Rectangle 1: x=0, y=20, w=10, h=10
    // Rectangle 2: x=0, y=0, w=10, h=10 (10 pixels gap)
    const result: boolean = isCollision(0, 20, 10, 10, 0, 0, 10, 10);
    expect(result).toBe(false);
  });

  it('should NOT detect collision when rectangles touch at edges (AABB < not <=)', () => {
    // Rectangle 1: x=0, y=0, w=10, h=10 (right edge at x=10)
    // Rectangle 2: x=10, y=0, w=10, h=10 (left edge at x=10)
    // These share an edge but don't overlap based on < comparison
    const result: boolean = isCollision(0, 0, 10, 10, 10, 0, 10, 10);
    expect(result).toBe(false);
  });

  it('should handle zero-width rectangles (no collision)', () => {
    // Rectangle 1: x=5, y=5, w=0, h=10 (zero width)
    // Rectangle 2: x=5, y=5, w=10, h=10
    // Zero width means no actual area, so no collision
    const result: boolean = isCollision(5, 5, 0, 10, 5, 5, 10, 10);
    expect(result).toBe(false);
  });

  it('should handle zero-height rectangles (no collision)', () => {
    // Rectangle 1: x=5, y=5, w=10, h=0 (zero height)
    // Rectangle 2: x=5, y=5, w=10, h=10
    // Zero height means no actual area, so no collision
    const result: boolean = isCollision(5, 5, 10, 0, 5, 5, 10, 10);
    expect(result).toBe(false);
  });

  it('should work with negative coordinates', () => {
    // Rectangle 1: x=-10, y=-10, w=20, h=20 (covers -10 to 10 on both axes)
    // Rectangle 2: x=0, y=0, w=10, h=10
    // These overlap in the region (0,0)-(10,10)
    const result: boolean = isCollision(-10, -10, 20, 20, 0, 0, 10, 10);
    expect(result).toBe(true);
  });

  it('should detect partial overlap (corner collision)', () => {
    // Rectangle 1: x=0, y=0, w=10, h=10
    // Rectangle 2: x=8, y=8, w=10, h=10
    // These overlap in a small 2x2 region at (8,8)-(10,10)
    const result: boolean = isCollision(0, 0, 10, 10, 8, 8, 10, 10);
    expect(result).toBe(true);
  });

  it('should work with large rectangles', () => {
    // Rectangle 1: x=0, y=0, w=1000, h=1000
    // Rectangle 2: x=500, y=500, w=1000, h=1000
    const result: boolean = isCollision(0, 0, 1000, 1000, 500, 500, 1000, 1000);
    expect(result).toBe(true);
  });

  it('should work with very small rectangles', () => {
    // Rectangle 1: x=10.5, y=10.5, w=0.5, h=0.5
    // Rectangle 2: x=10.6, y=10.6, w=0.5, h=0.5
    const result: boolean = isCollision(10.5, 10.5, 0.5, 0.5, 10.6, 10.6, 0.5, 0.5);
    expect(result).toBe(true);
  });

  it('should NOT detect collision when diagonal rectangles are separate', () => {
    // Rectangle 1: x=0, y=0, w=10, h=10
    // Rectangle 2: x=20, y=20, w=10, h=10 (separate diagonally)
    const result: boolean = isCollision(0, 0, 10, 10, 20, 20, 10, 10);
    expect(result).toBe(false);
  });
});
