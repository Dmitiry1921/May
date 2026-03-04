#!/usr/bin/env node
/**
 * convert-levels.js
 * 
 * Converts legacy level data from js/lvl.js and js/tile.js
 * to Tiled JSON format for Phaser 3 integration.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load legacy JS files using VM context
function loadLegacyModule(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Transform ES6 export default to CommonJS
  code = code.replace(/export\s+default\s+/g, 'module.exports = ');
  
  const ctx = { 
    exports: {}, 
    module: { exports: {} },
    console: console // Allow console.log in the evaluated code
  };
  
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  
  // Return the exported value
  return ctx.module.exports;
}

console.log('Loading legacy data files...');
const _lvl = loadLegacyModule(path.join(__dirname, '../js/lvl.js'));
const _tile = loadLegacyModule(path.join(__dirname, '../js/tile.js'));

console.log('Level data loaded:', Object.keys(_lvl));
console.log('Tile data loaded. Tile IDs:', Object.keys(_tile).filter(k => !['defMap', 'default', 'param'].includes(k)));

// Constants from the game
const GRID_WIDTH = 40;
const GRID_HEIGHT = 22;
const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

// Spritesheet image metadata
const TILESHEET_IMAGES = {
  'img/tiles/main.png':     { key: 'tiles_main',     w: 192, h: 1472 },
  'img/tiles/tiled.png':   { key: 'tiles_tiled',    w: 512, h: 512  },
  'img/tiles/building.png':{ key: 'tiles_building', w: 192, h: 5408 },
  'img/tiles/plane.png':   { key: 'tiles_plane',    w: 192, h: 2400 },
};

/**
 * Build a spritesheet-based tileset mapping.
 * Each source image becomes a separate Tiled tileset (with firstgid).
 * GID = firstgid + (y/32)*cols + (x/32)
 */
function buildTilesetMapping() {
  // Collect unique source URLs in stable order (by tile ID)
  const tileIds = Object.keys(_tile)
    .filter(k => !['defMap', 'default', 'param'].includes(k))
    .map(Number)
    .sort((a, b) => a - b);

  const urlOrder = [];
  const seenUrls = new Set();
  for (const tileId of tileIds) {
    const td = _tile[tileId];
    if (td && td.url && !seenUrls.has(td.url)) {
      urlOrder.push(td.url);
      seenUrls.add(td.url);
    }
  }

  // Build firstgid table — each tileset starts after the previous one ends
  const tilesetDefs = [];
  let nextGid = 1;
  for (const url of urlOrder) {
    const meta = TILESHEET_IMAGES[url];
    if (!meta) throw new Error('Unknown tile image: ' + url);
    const cols = meta.w / TILE_WIDTH;
    const rows = meta.h / TILE_HEIGHT;
    const count = cols * rows;
    tilesetDefs.push({ url, key: meta.key, firstgid: nextGid, cols, rows, count, imagewidth: meta.w, imageheight: meta.h });
    nextGid += count;
  }

  // Build key -> globalId lookup for each (tileId, variantIndex) combo
  const tileIdToGlobalId = new Map();
  for (const tileId of tileIds) {
    const td = _tile[tileId];
    if (!td || !td.map || !td.url) continue;
    const def = tilesetDefs.find(d => d.url === td.url);
    if (!def) continue;
    td.map.forEach((variant, index) => {
      const frameCol = variant.x / TILE_WIDTH;
      const frameRow = variant.y / TILE_HEIGHT;
      const localId = frameRow * def.cols + frameCol;
      const globalId = def.firstgid + localId;
      tileIdToGlobalId.set(`${tileId}_${index}`, globalId);
    });
  }

  return { tilesetDefs, tileIdToGlobalId };
}

/**
 * Convert a level's map data to Tiled layer format.
 */
function convertMapLayer(levelMap, layerIndex, tileIdToGlobalId) {
  const data = new Array(GRID_WIDTH * GRID_HEIGHT).fill(0);

  for (let x = 0; x < GRID_WIDTH; x++) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      if (!levelMap[x] || !levelMap[x][y] || !levelMap[x][y][layerIndex]) {
        continue;
      }

      const cell = levelMap[x][y][layerIndex];
      if (cell.id !== null && cell.id !== undefined && cell.tile !== null && cell.tile !== undefined) {
        // Convert to global tile ID
        const key = `${cell.tile}_${cell.id}`;
        const globalId = tileIdToGlobalId.get(key);
        
        if (globalId) {
          // Tiled uses row-major order: index = y * width + x
          data[y * GRID_WIDTH + x] = globalId;
        }
      }
    }
  }

  return data;
}

/**
 * Extract spawn points from level data.
 */
function extractSpawnPoints(level) {
  const objects = [];
  let objectId = 1;

  // Hero spawn point
  if (level.hero) {
    objects.push({
      id: objectId++,
      name: 'hero_spawn',
      type: 'spawn',
      x: level.hero.x * TILE_WIDTH,
      y: level.hero.y * TILE_HEIGHT,
      width: TILE_WIDTH,
      height: TILE_HEIGHT,
      properties: [
        { name: 'entity_type', type: 'string', value: 'hero' }
      ],
      visible: true
    });
  }

  // NPC spawn points
  if (level.nps && Array.isArray(level.nps)) {
    level.nps.forEach((npc, idx) => {
      // npc format: [sid, sx, sy, x, y, {options}]
      const [sid, sx, sy, x, y, options = {}] = npc;
      objects.push({
        id: objectId++,
        name: options.name || `npc_${idx}`,
        type: 'npc',
        x: x * TILE_WIDTH,
        y: y * TILE_HEIGHT,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        properties: [
          { name: 'entity_type', type: 'string', value: 'nps' },
          { name: 'sprite_id', type: 'int', value: sid },
          { name: 'sprite_x', type: 'int', value: sx },
          { name: 'sprite_y', type: 'int', value: sy },
          { name: 'npc_name', type: 'string', value: options.name || '' },
          { name: 'face_id', type: 'int', value: options.face || 0 },
          { name: 'code', type: 'string', value: options.code || '' }
        ],
        visible: true
      });
    });
  }

  // Enemy spawn points
  if (level.enemy && Array.isArray(level.enemy)) {
    level.enemy.forEach((enemy, idx) => {
      const [sid, sx, sy, x, y, options = {}] = enemy;
      objects.push({
        id: objectId++,
        name: `enemy_${idx}`,
        type: 'enemy',
        x: x * TILE_WIDTH,
        y: y * TILE_HEIGHT,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        properties: [
          { name: 'entity_type', type: 'string', value: 'enemy' },
          { name: 'sprite_id', type: 'int', value: sid },
          { name: 'sprite_x', type: 'int', value: sx },
          { name: 'sprite_y', type: 'int', value: sy },
          { name: 'code', type: 'string', value: options.code || '' },
          { name: 'damage', type: 'int', value: options.damage || 1 },
          { name: 'health', type: 'int', value: options.health || 10 }
        ],
        visible: true
      });
    });
  }

  // Animal spawn points
  if (level.animal && Array.isArray(level.animal)) {
    level.animal.forEach((animal, idx) => {
      const [sid, sx, sy, x, y, options = {}] = animal;
      objects.push({
        id: objectId++,
        name: `animal_${idx}`,
        type: 'animal',
        x: x * TILE_WIDTH,
        y: y * TILE_HEIGHT,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        properties: [
          { name: 'entity_type', type: 'string', value: 'animal' },
          { name: 'sprite_id', type: 'int', value: sid },
          { name: 'sprite_x', type: 'int', value: sx },
          { name: 'sprite_y', type: 'int', value: sy }
        ],
        visible: true
      });
    });
  }

  return { objects, nextObjectId: objectId };
}

/**
 * Generate a complete Tiled JSON map for a level.
 */
function generateTiledMap(levelIndex, level, tileIdToGlobalId, tilesetDefs) {
  console.log(`\nProcessing level ${levelIndex}...`);

  // Convert map layers
  const groundData = convertMapLayer(level.map, 0, tileIdToGlobalId);
  const decorationData = convertMapLayer(level.map, 1, tileIdToGlobalId);
  const collisionData = convertMapLayer(level.map, 2, tileIdToGlobalId);
  const overlayData = convertMapLayer(level.map, 3, tileIdToGlobalId);

  // Extract spawn points
  const { objects, nextObjectId } = extractSpawnPoints(level);

  console.log(`  - Ground tiles: ${groundData.filter(x => x > 0).length}`);
  console.log(`  - Decoration tiles: ${decorationData.filter(x => x > 0).length}`);
  console.log(`  - Collision tiles: ${collisionData.filter(x => x > 0).length}`);
  console.log(`  - Overlay tiles: ${overlayData.filter(x => x > 0).length}`);
  console.log(`  - Spawn points: ${objects.length}`);

  const tiledMap = {
    type: 'map',
    version: '1.6',
    tiledversion: '1.9.0',
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    tilewidth: TILE_WIDTH,
    tileheight: TILE_HEIGHT,
    infinite: false,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    layers: [
      {
        id: 1,
        name: 'ground',
        type: 'tilelayer',
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        data: groundData
      },
      {
        id: 2,
        name: 'decoration',
        type: 'tilelayer',
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        data: decorationData
      },
      {
        id: 3,
        name: 'collision',
        type: 'tilelayer',
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        data: collisionData
      },
      {
        id: 4,
        name: 'overlay',
        type: 'tilelayer',
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        data: overlayData
      },
      {
        id: 5,
        name: 'objects',
        type: 'objectgroup',
        visible: true,
        opacity: 1,
        x: 0,
        y: 0,
        objects: objects
      }
    ],
    tilesets: tilesetDefs.map(def => ({
      name: def.key,
      firstgid: def.firstgid,
      tilewidth: TILE_WIDTH,
      tileheight: TILE_HEIGHT,
      tilecount: def.count,
      columns: def.cols,
      image: def.url,
      imagewidth: def.imagewidth,
      imageheight: def.imageheight,
      spacing: 0,
      margin: 0,
    })),
    nextlayerid: 6,
    nextobjectid: nextObjectId
  };

  return tiledMap;
}

/**
 * Main conversion logic
 */
function main() {
  console.log('\n=== May Game Level Converter ===\n');

  // Build tileset mapping
  console.log('Building tileset mapping...');
  const { tilesetDefs, tileIdToGlobalId } = buildTilesetMapping();
  console.log(`Tilesets: ${tilesetDefs.map(d => d.key + '(' + d.count + ')').join(', ')}`);

  // Create output directory
  const outputDir = path.join(__dirname, '../assets/maps');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }

  // Convert each level
  const levelIds = [0, 1, 2, 3];
  const spawnPointsSummary = [];

  for (const levelId of levelIds) {
    const level = _lvl[levelId];
    if (!level) {
      console.error(`Level ${levelId} not found!`);
      continue;
    }

    const tiledMap = generateTiledMap(levelId, level, tileIdToGlobalId, tilesetDefs);
    const outputPath = path.join(outputDir, `level-${levelId}.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify(tiledMap, null, 2), 'utf8');
    console.log(`  ✓ Written: ${outputPath}`);

    // Collect spawn points for evidence
    const objectLayer = tiledMap.layers.find(l => l.type === 'objectgroup');
    spawnPointsSummary.push({
      level: levelId,
      hero: level.hero,
      npcCount: (level.nps || []).length,
      enemyCount: (level.enemy || []).length,
      animalCount: (level.animal || []).length,
      totalObjects: objectLayer ? objectLayer.objects.length : 0
    });
  }

  console.log('\n=== Conversion Complete ===\n');
  console.log('Generated files:');
  levelIds.forEach(id => {
    console.log(`  - assets/maps/level-${id}.json`);
  });

  // Save spawn points summary
  const evidenceDir = path.join(__dirname, '../.sisyphus/evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  const spawnPointsEvidence = spawnPointsSummary.map(s => 
    `Level ${s.level}:\n` +
    `  Hero spawn: (${s.hero.x}, ${s.hero.y})\n` +
    `  NPCs: ${s.npcCount}\n` +
    `  Enemies: ${s.enemyCount}\n` +
    `  Animals: ${s.animalCount}\n` +
    `  Total objects: ${s.totalObjects}\n`
  ).join('\n');

  fs.writeFileSync(
    path.join(evidenceDir, 'task-4-spawn-points.txt'),
    'Spawn Points Summary\n' +
    '===================\n\n' +
    spawnPointsEvidence,
    'utf8'
  );

  console.log('\n✓ Evidence files will be generated after validation.');
}

// Run the converter
main();
