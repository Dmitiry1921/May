'use strict';

export class Point {
	#x;
	#y;
	#prevX;
	#prevY;
	#nextX;
	#nextY;
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
	get nextX() {
		return this.#nextX;
	}
	get nextY() {
		return this.#nextY;
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
		if (vector2.constructor.name !== "Vector2") throw new TypeError('point must be instance of Vector2');
		// console.log('prev:', this.#prevX, this.#prevY, 'cur:', this.#x, this.#y,  'next:', this.#nextX, this.#nextY);

		// Сохраняем предыдущие координаты
		this.#prevX = this.#x;
		this.#prevY = this.#y;
		// Перемещаем точку
		this.#x += vector2.x;
		this.#y += vector2.y;
	}

	/**
	 * Возвращает следующую точку
	 * @param vector2
	 * @returns {Point} - Возвращает текущую точку у которой есть будущие координаты
	 */
	getNextPosition(vector2) {
		if(vector2.constructor.name !== "Vector2") throw new TypeError('vector2 must be instance of Vector2');
		this.#nextX = this.#x + vector2.x;
		this.#nextY = this.#y + vector2.y;
		return this;
	}

	release() {
		this.moveTo(new Point(this.nextX, this.nextY));
	}
	rollback() {
		this.moveTo(new Point(this.prevX, this.prevY));
		return this;
	}

	/**
	 * Возвращает предыдущую точку
	 * @returns {Point}
	 */
	getPreviousPoint() {
		return new Point(this.#prevX, this.#prevY);
	}

	toString() {
		return `${this.constructor.name}(${this.#x}, ${this.#y})`;
	}
}
