'use strict';

import {GAMEPAD} from "../../GameEngine/InputManager/GamePadController.js";
import {KEYBOARD} from "../../GameEngine/InputManager/KeyboardController.js";

export const KEYS = {
	LEFT: {
		GAMEPAD: [
			GAMEPAD.XBOX.LEFT,
		],
		KEYBOARD: [
			KEYBOARD.LEFT,
			KEYBOARD.A,
		],
	},
	RIGHT: {
		GAMEPAD: [
			GAMEPAD.XBOX.RIGHT,
		],
		KEYBOARD: [
			KEYBOARD.RIGHT,
			KEYBOARD.D,
		],
	},
	UP: {
		GAMEPAD: [
			GAMEPAD.XBOX.UP,
		],
		KEYBOARD: [
			KEYBOARD.UP,
			KEYBOARD.W,
		],
	},
	DOWN: {
		GAMEPAD: [
			GAMEPAD.XBOX.DOWN,
		],
		KEYBOARD: [
			KEYBOARD.DOWN,
			KEYBOARD.S,
		],
	},
	ACTION: {
		GAMEPAD: [
			GAMEPAD.XBOX.A,
			GAMEPAD.XBOX.RT,
		],
		KEYBOARD: [
			KEYBOARD.SPACE,
			KEYBOARD.ENTER,
		],
	},
}
