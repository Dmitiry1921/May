'use strict';

import { Sprite } from '../../GameObject';

export class AnimationManager {
	#animations;
	#currentAnimation;
	constructor() {
		this.#animations = new Map();
		this.#currentAnimation = null;
	}

	/**
	 * Добавляет анимацию с именем name
	 * @param name
	 * @param animation
	 */
	addAnimation(name, animation) {
		if(this.#animations.has(name)) throw new Error('SpriteAnimation already exists');
		if(!(animation instanceof SpriteAnimation)) throw new TypeError('animation must be instance of SpriteAnimation');
		this.#animations.set(name, animation);
	}

	/**
	 * Воспроизводит анимацию с именем name
	 * @param name
	 */
	playAnimation(name) {
		if(!this.#animations.has(name)) throw Error('SpriteAnimation does not exist');
		this.#currentAnimation = this.#animations.get(name);
		// Если анимация не сменилась на другую, то кадры не меняются
		if(this.#currentAnimation.name === name) return;
		this.#currentAnimation.reset();
	}

	/**
	 * Останавливает воспроизведение анимации
	 */
	stopAnimation() {
		this.#currentAnimation = null;
	}


	update(deltaTime) {
		if(this.#currentAnimation === null) return;
		this.#currentAnimation.update(deltaTime);
	}
}
