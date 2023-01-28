export default new class KeyBoard {
  constructor() {
    window.onkeydown = (e) => {
      this.setKey(e.keyCode);
    };
    window.onkeyup = (e) => {
      this.clearKey(e.keyCode);
    };
    this.keys = {
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
    this.keyDown = {};
  }

  setKey(k) {
    this.keyDown[k] = true;
  };
  clearKey(k) {
    this.keyDown[k] = false;
  };
  isKeyDown(k) {
    return this.keyDown[this.keys[k]] === true;
  };
}
