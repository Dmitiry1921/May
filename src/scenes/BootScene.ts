import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  private _isReady = false;

  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Will preload sprites/tiles in later milestones
  }

  create(): void {
    this._isReady = true;
    // Signal that the game is running
    (this.game as any).__bootReady = true;
  }

  update(): void {
    // Main game loop — will be replaced by WorldScene in later milestones
  }

  get isReady(): boolean {
    return this._isReady;
  }
}
