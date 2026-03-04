/**
 * Axis-Aligned Bounding Box (AABB) collision detection utilities
 */

/**
 * Checks if two rectangles are colliding using AABB collision detection
 * @param {number} x1 - X coordinate of first rectangle
 * @param {number} y1 - Y coordinate of first rectangle
 * @param {number} w1 - Width of first rectangle
 * @param {number} h1 - Height of first rectangle
 * @param {number} x2 - X coordinate of second rectangle
 * @param {number} y2 - Y coordinate of second rectangle
 * @param {number} w2 - Width of second rectangle
 * @param {number} h2 - Height of second rectangle
 * @returns {boolean} True if rectangles are colliding, false otherwise
 */
export function isCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2;
}
