'use strict';

import {Layout, Point, SpriteAnimation} from "../../index.js";

export class LayoutMap extends Layout {
	#map; // двумерный массив с индексами тайлов
	#tileCount; // количество тайлов
	constructor() {
		super();
		this.#map = [[]];
		this.#tileCount = 0;
	}

	/**
	 * Добавляет тайл в указанные координаты
	 * @param x
	 * @param y
	 * @param animation
	 */
	addSpriteAnimation(x, y, animation) {
		if(typeof x !== "number" || typeof y !== "number") throw new TypeError('x and y must be number');
		if(!(animation instanceof SpriteAnimation)) throw new TypeError('animation must be instance of SpriteAnimation');

		this.addResources(animation.resources);

		if(!this.#map[x]) this.#map[x] = [];
		const point = new Point(x, y);
		if(this.#map[x][y] !== undefined) throw new Error(`this cell ${point} is already occupied`);
		this.#map[x][y] = animation;
		this.#tileCount++;

		this.addChild(animation);
	}

	/**
	 * Проверяет существует ли тайл в указанных координатах
	 * @param x
	 * @param y
	 * @return {boolean}
	 */
	checkExist(x, y) {
		if(typeof x !== "number" || typeof y !== "number") throw new TypeError('x and y must be number');
		return Boolean(this.#map[x] && this.#map[x][y]);
	}
}
