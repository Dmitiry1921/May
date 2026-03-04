/**
 * InputManager — keyboard state via Phaser.Input.Keyboard.
 * keyDown state is independent of Phaser so pressKey/releaseKey work in headless tests.
 */

const keys: Record<string, number> = {
  'W': 87,
  'A': 65,
  'S': 83,
  'D': 68,
  'LEFT': 37,
  'RIGHT': 39,
  'TOP': 38,
  'DOWN': 40,
  'SPACE': 32
};

const keyDown: Record<number, boolean> = {};

export function setKey(k: number): void {
  keyDown[k] = true;
}

export function clearKey(k: number): void {
  keyDown[k] = false;
}

export function isKeyDown(k: string): boolean {
  return keyDown[keys[k]] === true;
}

export function getKeyDownState(): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  for (const [name, code] of Object.entries(keys)) {
    if (keyDown[code] === true) {
      state[name] = true;
    }
  }
  return state;
}

export function pressKey(keyCode: number): void {
  setKey(keyCode);
}

export function releaseKey(keyCode: number): void {
  clearKey(keyCode);
}

export function initKeyboard(scene: Phaser.Scene): void {
  const kb = scene.input.keyboard;
  if (!kb) return;
  kb.on('keydown', (e: KeyboardEvent) => {
    setKey(e.keyCode);
  });
  kb.on('keyup', (e: KeyboardEvent) => {
    clearKey(e.keyCode);
  });
}

/** @deprecated Use initKeyboard(scene) instead. Kept as no-op stub for backward compat. */
export function installKeyboardHandlers(): void {
  // no-op — use initKeyboard(scene) to bind Phaser keyboard events
}

export { keys, keyDown };
