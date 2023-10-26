'use strict';

import {GameObject, Sprite} from "../../GameObject/index.js";
import {ImageLoader} from "../Resources/index.js";

export class SpriteAnimation extends GameObject {
	#frameDuration;
	#currentFrame;
	#elapsedTime;
	#frames;
	#play;

	constructor(image, frames, frameDuration = 1 / 10) {
		if(!(image instanceof ImageLoader)) throw new TypeError('image must be instance of ImageLoader');
		if (typeof frameDuration !== 'number') throw new TypeError('frameDuration must be number');

		super();
		this.frames = frames.map(frame => new Sprite(image, frame)); // Кадры анимации
		this.#frameDuration = frameDuration; // Длительность кадра
		this.#currentFrame = 0; // Текущий кадр
		this.#elapsedTime = 0; // Прошедшее время
		this.#play = true; // Воспроизводить анимацию
	}

	get bound() {
		return this.#frames[this.#currentFrame].bound;
	}

	set frames(frames) {
		if (!Array.isArray(frames)) throw new TypeError('frames must be array');
		if (frames.length === 0) throw new Error('frames must be not empty');
		if (frames.some(frame => !(frame instanceof Sprite))) throw new TypeError('frames must be array of Sprite');
		this.addResources(frames.flatMap(frame => frame.resources));
		this.#frames = frames;
	}

	get frames() {
		return this.#frames;
	}

	/**
	 * Сбрасывает анимацию
	 */
	#reset() {
		this.#currentFrame = 0;
		this.#elapsedTime = 0;
	}

	play() {
		this.#play = true;
	}
	pause() {
		this.#play = false;
	}
	stop() {
		this.#play = false;
		this.#reset();
	}

	update(deltaTime) {
		if (typeof deltaTime !== 'number') throw new TypeError('deltaTime must be number');
		// Если анимация не воспроизводится, то нет необходимости обновлять её
		if (!this.#play) return;
		// Нет необходимости обновлять анимацию, если всего 1 кадр
		if (this.#frames.length === 1) return;
		// Увеличить прошедшее время
		this.#elapsedTime += deltaTime;
		// Если прошло больше времени чем нужно для смены кадра
		if (this.#elapsedTime > this.#frameDuration) {
			this.#currentFrame = (this.#currentFrame + 1) % this.#frames.length;
			// Сбрасываем время
			this.#elapsedTime = 0;
		}
	}

	moveTo(point) {
		this.#frames.forEach(frame => frame.moveTo(point));
	}
	moveBy(vector2) {
		this.#frames.forEach(frame => frame.moveBy(vector2));
	}

	resize(width, height) {
		this.#frames.forEach(frame => frame.resize(width, height));
	}

	hasCollider() {
		return false;
	}

	toString() {
		return `${this.constructor.name}(${this.#frames.map(frame => frame.toString()).join(', ')})`;
	}

	processInput() {

	}
	render(canvasContext) {
		this.#frames[this.#currentFrame].render(canvasContext);
	}
}
