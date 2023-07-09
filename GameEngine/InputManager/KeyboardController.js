export default new class KeyboardController {
  constructor() {
    this.state = new Set();

    window.onkeydown = event => this.pressKey(event);
    window.onkeyup = event => this.releaseKey(event);

  }

  get #keyMap() {
    return {
      37: "LEFT",
      38: "UP",
      39: "RIGHT",
      40: "DOWN",
      32: "SPACE",
      87: "W",
      65: "A",
      83: "S",
      68: "D",
      13: "ENTER",
    }
  }

  getKeyCode(event) {
    return this.#keyMap[event.keyCode || event.which];
  }

  pressKey(event) {
    const keyCode = this.getKeyCode(event);
    this.state.add(keyCode);
  }

  releaseKey(event) {
    const keyCode = this.getKeyCode(event);
    this.state.delete(keyCode);
  }

  oneOf(...keys) {
    return keys.some(key => this.state.has(key));
  }
  isPressed(key) {
    return this.state.has(key);
  }

}
