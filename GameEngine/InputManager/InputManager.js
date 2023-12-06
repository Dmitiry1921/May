'use strict';

import KeyboardController from "./KeyboardController.js";
import GamePadController from "./GamePadController.js";

export default new class InputManager {
	#gamePads;

	constructor() {
		this.#gamePads = new Set();

		window.addEventListener("gamepadconnected", this.#gamepadConnected.bind(this));
		window.addEventListener("gamepaddisconnected", this.#gamepadDisconnected.bind(this));
		// this.keyboardController = new KeyboardController();
		// this.mouseController = new MouseController();
		// this.touchController = new TouchController();
	}

	get controllers() {
		return [
			KeyboardController,
			...this.#gamePads,
		];
	}

	#gamepadConnected(e) {
		console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
			e.gamepad.index, e.gamepad.id,
			e.gamepad.buttons.length, e.gamepad.axes.length);
		this.#gamePads.add(new GamePadController(e.gamepad.index));
	}

	#gamepadDisconnected(e) {
		console.log("Gamepad disconnected from index %d: %s",
			e.gamepad.index, e.gamepad.id);
		const gamepad = this.getGamePad(e.gamepad.index);
		this.#gamePads.delete(gamepad);
	}

	/**
	 * Интерфейс для добавления функции обработки ввода
	 */
	processInput() {
		// Обработка ввода, этап сбора данных
		this.controllers.forEach(controller => controller.processInput());
	}

	getGamePad(index) {
		return [...this.#gamePads].find(gamepad => gamepad.gamepadIndex === index);
	}

	/**
	 * Проверка нажатия одной из кнопок
	 * @param key
	 * @return {boolean}
	 */
	isPressed(key) {
		return this.controllers.some(controller => controller.isPressed(key));
	}
	isReleased(key) {
		return this.controllers.some(controller => controller.isReleased(key));

	}
	oneOf(keys) {
		return this.controllers.some(controller => controller.oneOf(keys));
	}
}
