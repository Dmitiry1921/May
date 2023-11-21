'use strict';

import {GameObject} from "../../../GameEngine";

/**
 * Позволяет рисовать слои карты в нужном порядке
 */
export class Layout extends GameObject {
	#children;
	#colliders;
	#compareBeforeRender;
	#visible;
  constructor() {
    super();
		this.#children = [];
		this.#colliders = [];
		this.#visible = true;
  }

	get children() {
		return this.#children;
	}

	get colliders() {
		return this.#colliders;
	}

	/**
	 * Показывает слой
	 */
	show() {
		Promise.all(this.resources.map(resource => resource.load())).then(() => {
			this.#visible = true;
		});
	}

	/**
	 * Скрывает слой
	 */
	hide() {
		this.#visible = false;
		return this;
	}

  processInput(deltaTime) {
		this.#children.forEach(child => child.processInput(deltaTime));
  }

  update(deltaTime) {
		this.#children.forEach(child => child.update(deltaTime));
  }

  render(canvasContext) {
		if(!this.#visible) return;
		this.#children
			.sort(this.#compareBeforeRender)
			.forEach(child => child.render(canvasContext));
  }

	hasCollider() {
	}
	/**
	 * Задает функцию сортировки персонажей перед рисованием на canvas
	 * @param compareFn {function} - функция сравнения
	 */
	setSortBeforeRender(compareFn) {
		if(typeof compareFn !== 'function') throw new TypeError('compareFn must be function');
		this.#compareBeforeRender = compareFn;
	}

	/**
	 * Добавляет игровой объект в слой
	 * @param gameObject
	 */
	addChild(gameObject) {
		if(!(gameObject instanceof GameObject)) throw new TypeError('param gameObject must be instance of GameObject');
		this.#children.push(gameObject);
		if(gameObject.hasCollider()) this.#colliders.push(gameObject);
		this.addResources(gameObject.resources);
	}
}
