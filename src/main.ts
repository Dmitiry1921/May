import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';
import { setupTestApi } from './test-api';

// Game configuration — CANVAS renderer for pixel-perfect golden test compatibility
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  canvas: document.getElementById('myCanvas') as HTMLCanvasElement,
  width: 1280,
  height: 704,
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    clearBeforeRender: false,
  },
  backgroundColor: '#000000',
  scene: [WorldScene],
  // Disable Phaser's built-in input to manage it ourselves
  input: {
    keyboard: true,
    mouse: false,
    touch: false,
    gamepad: false,
  },
  // No physics — we use custom collision
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  // Do NOT let Phaser create its own canvas — we use the existing #myCanvas
  banner: false,
  audio: {
    noAudio: true,
  },
};

// Create the game — NOT exposed to global scope (user preference)
const game = new Phaser.Game(config);


// Set up the test API bridge
setupTestApi(game);
