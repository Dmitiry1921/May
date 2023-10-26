'use strict';

export class Point {
	#x;
	#y;
	#prevX;
	#prevY;
	/**
	 * Создает объект Point
	 * @param x {number} - координата x
	 * @param y {number} - координата y
	 * @throws {TypeError} - если x или y не являются числами
	 * @returns {Point}
	 */
	constructor(x, y) {
		if(typeof x !== "number") throw new TypeError('x must be number');
		if(typeof y !== "number") throw new TypeError('y must be number');
		this.#x = x;
		this.#y = y;
		this.#prevX = x;
		this.#prevY = y;
	}

	get x() {
		return this.#x;
	}
	get y() {
		return this.#y;
	}
	get prevX() {
		return this.#prevX;
	}
	get prevY() {
		return this.#prevY;
	}

	/**
	 * Перемещает прямоугольник в указанную точку
	 * @param point {Point} - точка
	 */
	moveTo(point) {
		if (!(point instanceof Point)) throw new TypeError('point must be instance of Point');
		// Сохраняем предыдущие координаты
		this.#prevX = this.#x;
		this.#prevY = this.#y;
		// Перемещаем точку
		this.#x = point.x;
		this.#y = point.y;
	}

	/**
	 * Перемещает прямоугольник на указанный вектор
	 * @param vector2 {Vector2} - вектор
	 */
	moveBy(vector2) {
		if (vector2.constructor.name !== "Vector2") throw new TypeError('vector2 must be instance of Vector2');
		// Сохраняем предыдущие координаты
		this.#prevX = this.#x;
		this.#prevY = this.#y;
		// Перемещаем точку
		this.#x += vector2.x;
		this.#y += vector2.y;
	}

	toString() {
		return `${this.constructor.name}(${this.#x}, ${this.#y})`;
	}
}
