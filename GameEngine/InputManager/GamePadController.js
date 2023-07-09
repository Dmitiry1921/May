const XBOX360 = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  BACK: 8,
  START: 9,
  UP: 12,
  DOWN: 13,
  LEFT: 14,
  RIGHT: 15,
};

// const PS4 = {
//   SQUARE: 0,
//   X: 1,
//   CIRCLE: 2,
//   TRIANGLE: 3,
//   L1: 4,
//   R1: 5,
//   L2: 6,
//   R2: 7,
//   PS: 12,
//   UP: 14,
//   DOWN: 15,
//   LEFT: 16,
//   RIGHT: 17,
// }

export default new class GamePadController {
  constructor() {
    window.addEventListener("gamepadconnected", (e) => {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
      console.log(e.gamepad.buttons);
      console.log(navigator.getGamepads());

    });
    window.addEventListener("gamepaddisconnected", (e) => {
      console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
    });
    requestAnimationFrame(() => {
      this.checkGamePadState();
    });
    this.state = new Set();
  }

  checkGamePadState() {
    Object.entries(XBOX360).forEach(([key, value]) => {
      if (this.isPressed(value)) {

      }
      if (this.isReleased(value)) {
        this.emit("release", key);
      }
    });
  }

  isPressed(value) {
    if(!this.state.has(value)) {
      this.state.add(value)
      this.emit("press", {

      });
    }
    return false;
  }

  isReleased() {
    return false;
  }
}
