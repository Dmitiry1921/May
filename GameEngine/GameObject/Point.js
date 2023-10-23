'use strict';

export class Point {
	#x;
	#y;
	/**
	 * Создает объект Point
	 * @param x {Point | Object | number} - если первый аргумент объект, то второй аргумент должен быть undefined
	 * @param [y] {number | undefined} - если первый аргумент не объект, то второй аргумент должен быть числом
	 * @throws {TypeError} - если аргументы не соответствуют типам
	 * @returns {Point}
	 */
	constructor(x, y) {
		if(typeof x !== "number") throw new TypeError('x must be number');
		if(typeof y !== "number") throw new TypeError('y must be number');
		this.#x = x;
		this.#y = y;
	}

	get x() {
		return this.#x;
	}
	get y() {
		return this.#y;
	}

	/**
	 * Перемещает прямоугольник в указанную точку
	 * @param point {Point} - точка
	 */
	moveTo(point) {
		if (!(point instanceof Point)) throw new TypeError('point must be instance of Point');
		this.#x = point.x;
		this.#y = point.y;
	}

	/**
	 * Перемещает прямоугольник на указанный вектор
	 * @param vector2 {Vector2} - вектор
	 */
	moveBy(vector2) {
		if (vector2.constructor.name !== "Vector2") throw new TypeError('point must be instance of Vector2');
		this.#x += vector2.x;
		this.#y += vector2.y;
	}

	toString() {
		return `${this.constructor.name}(${this.#x}, ${this.#y})`;
	}
}
