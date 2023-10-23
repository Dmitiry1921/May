'use strict';

import {GameObject} from "../../../GameEngine";

/**
 * Позволяет рисовать слои карты в нужном порядке
 */
export class Layout extends GameObject {
	#children;
  constructor() {
    super();
		this.#children = [];
  }

  processInput() {
		this.#children.forEach(child => child.processInput());
  }

  update(deltaTime) {
		this.#children.forEach(child => child.update(deltaTime));
  }

  render(canvasContext) {
		this.#children.forEach(child => child.render(canvasContext));
  }

	/**
	 * Добавляет игровой объект в слой
	 * @param gameObject
	 */
	addChild(gameObject) {
		if(!(gameObject instanceof GameObject)) throw new TypeError('param gameObject must be instance of GameObject');
		this.#children.push(gameObject);
	}
}
