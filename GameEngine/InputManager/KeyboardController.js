'use strict';

export const KEYBOARD = {
	ESCAPE: 27,
	ENTER: 13,
	SPACE: 32,
	COMMAND: 91,
	WIN: 91,
	CONTROL: 17,
	ALT: 18,
	BACKSPACE: 8,
	TAB: 9,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	Q: 81,
	R: 82,
	S: 83,
	W: 87,
	X: 88,
	Z: 90,
};

const TYPE = 'KEYBOARD';

export default new class KeyboardController {
	#state;
	#wasPressed;

	constructor() {
		this.#state = new Set();
		this.#wasPressed = new Set();

		window.addEventListener('keydown', (event) => this.#keyDown(event));
		window.addEventListener('keyup', (event) => this.#keyUp(event));
		// window.addEventListener('keypress', (event) => this.#keyPress(event));
	}

	processInput() {}

	getKeyCode(event) {
		return event.keyCode || event.which;
	}

	#keyDown(event) {
		const keyCode = this.getKeyCode(event);
		this.#state.add(keyCode);
		this.#wasPressed.add(keyCode);
	}

	#keyPress(event) {
		// const keyCode = this.getKeyCode(event);
		// this.#state.delete(keyCode);
		// console.log('keyPress', this.getKeyCode(event), 'state', this.#state);
	}

	#keyUp(event) {
		const keyCode = this.getKeyCode(event);
		this.#state.delete(keyCode);
	}

	oneOf(...keys) {
		return keys.flatMap(key => key[TYPE]).some(key => this.#state.has(key));
	}

	isPressed(key) {
		return key[TYPE].some(key => this.#state.has(key));
	}

	isReleased(key) {
		const wasPressed = key[TYPE].some(key => {
			return this.#wasPressed.has(key);
		});
		if (wasPressed && !this.isPressed(key)) {
			key[TYPE].forEach((key) => {
				this.#wasPressed.delete(key);
			});
			return true;
		}
		return false;
	}

}
