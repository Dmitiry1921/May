'use strict';
import {reverse} from "../utils/object";

const XBOX = {
	A: 0,
	B: 1,
	X: 2,
	Y: 3,
	LB: 4,
	RB: 5,
	LT: 6,
	RT: 7,
	VIEW: 8,
	MENU: 9,
	LSB: 10,
	RSB: 11,
	UP: 12,
	DOWN: 13,
	LEFT: 14,
	RIGHT: 15,
	XBOX: 16,
	SHARE: 17,
};

export const GAMEPAD = {
	XBOX,
}

const TYPE = 'GAMEPAD';

// TODO поддержать оси
// TODO поддержать вибрацию

export default class GamePadController {
	#gpIndex;
	#buttonsMapper;
	#state;
	#isVibrate;
	#events;

	constructor(gamepadIndex) {
		this.#gpIndex = gamepadIndex;
		this.#buttonsMapper = reverse(XBOX); //  TODO Добавить поддержку других геймпад'ов
		this.#state = new Set();
		this.#isVibrate = false;
		this.#events = new Map();
	}

	get type() {
		return 'GAMEPAD';
	}

	get gamepadIndex() {
		return this.#gpIndex;
	}

	get #gamepad() {
		return navigator.getGamepads()[this.#gpIndex];
	}

	log(...args) {
		console.log('Gamepad', this.#gpIndex, ...args);
	}

	on(event, callback) {
		if(typeof event !== 'string') throw new TypeError('event must be string');
		if(typeof callback !== 'function') throw new TypeError('callback must be function');
		this.#events.set(event, callback);
	}

	#checkState() {
		this.vibrate();
		// console.log(this.#gamepad.vibrationActuator.playEffect('dual-rumble', {}));
		// console.log(this.#gamepad.axes.map(Math.round.bind(2)));
		this.#gamepad.buttons.forEach((button, index) => {
			if (button.pressed || button.touched || button.value > 0) {
				this.log('button', index, button.pressed, button.touched, button.value, this.#buttonsMapper[index]);
				if (!this.#state.has(index)) {
					this.#state.add(index);
				}
			} else {
				this.#state.delete(index);
			}
		});
	}

	vibrate(duration = 200, strongMagnitude = 1.0, weakMagnitude = 1.0) {
		if (this.#isVibrate) return;
		this.#isVibrate = true;
		const hapticActuator = this.#gamepad.vibrationActuator || this.#gamepad.hapticActuators[0];
		if (hapticActuator) {
			hapticActuator.playEffect(hapticActuator.type, {
				duration, // Длительность эффекта
				strongMagnitude, // Сила эффекта (от 0.0 до 1.0)
				weakMagnitude, // Слабая сила эффекта (от 0.0 до 1.0)
			})
				.then(() => {
					this.#isVibrate = false;
				})
				.catch((error) => {
					console.error("Ошибка воспроизведения эффекта обратной связи: " + error);
				})
				.finally(() => {
					this.#isVibrate = false;
				});
		}
		// playEffect(type, {
		// 	startDelay: 0,
		// 	duration,
		// 	strongMagnitude: 1.0,
		// 	weakMagnitude: 1.0
		// }).then(console.log)
		// 	.catch(console.error)
		// 	.finally(() => {
		// 	this.#isVibrate = false;
		// });
	}

	/**
	 * Проверка нажатия кнопки
	 * @param key
	 * @return {*}
	 */
	isPressed(key) {
		return this.#state.has(key);
	}

	/**
	 * Проверка отпускания кнопки
	 * @param key
	 * @return {boolean}
	 */
	isReleased(key) {
		return !this.#state.has(key);
	}

	/**
	 * Проверка нажатия одной из кнопок
	 * @param keys
	 * @return {boolean}
	 */
	oneOf(...keys) {
		return keys.flatMap(key => key[TYPE]).some(key => this.#state.has(key));
	}

	/**
	 * Обработка ввода
	 */
	processInput() {
		this.#checkState();
	}
}
