'use strict';

export class Vector2 {
	#x;
	#y;

	/**
	 * Создает объект Vector2
	 * @param x { number} - если первый аргумент объект, то второй аргумент должен быть undefined
	 * @param y {number} - если первый аргумент не объект, то второй аргумент должен быть числом
	 * @throws {TypeError} - если аргументы не соответствуют типам
	 * @returns {Point}
	 */
	constructor(x, y) {
		this.#x = x;
		this.#y = y;
	}

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	set x(value) {
		if (typeof value !== "number") throw new TypeError('x must be number');
		this.#x = value;
	}

	set y(value) {
		if (typeof value !== "number") throw new TypeError('y must be number');
		this.#y = value;
	}

	/**
	 * Сложение векторов
	 * @param vector2
	 * @return {Vector2}
	 */
	add(vector2) {
		if (!(vector2 instanceof Vector2)) throw new TypeError('point must be instance of Vector2');
		this.#x += vector2.x;
		this.#y += vector2.y;
		return this;
	}

	multiply(vector2) {
		if (!(vector2 instanceof Vector2)) throw new TypeError('point must be instance of Vector2');
		this.#x *= vector2.x;
		this.#y *= vector2.y;
		return this;
	}

	diff(vector2) {
		if (!(vector2 instanceof Vector2)) throw new TypeError('point must be instance of Vector2');
		this.#x -= vector2.x;
		this.#y -= vector2.y;
		return this;
	}

	invert() {
		this.#x *= -1;
		this.#y *= -1;
		return this;
	}

	/**
	 * Разложение векторов на оси
	 * @returns {{x: Vector2, y: Vector2}}
	 */
	project() {
		return {
			x: new Vector2(this.x, 0),
			y: new Vector2(0, this.y)
		};
	}

	sign(){
		return new Vector2(Math.sign(this.x), Math.sign(this.y));
	}

	clone() {
		return new Vector2(this.#x, this.#y);
	}

	toString() {
		return `${this.constructor.name}(${this.#x}, ${this.#y})`;
	}

	/**
	 * Разность векторов
	 * @param vector1
	 * @param vector2
	 * @returns {Vector2}
	 */
	static diff(vector1, vector2) {
		if (!(vector1 instanceof Vector2)) throw new TypeError('point must be instance of Vector2');
		if (!(vector2 instanceof Vector2)) throw new TypeError('point must be instance of Vector2');
		return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
	}

	/**
	 * Сложение векторов
	 * @param vector1
	 * @param vector2
	 * @returns {Vector2}
	 */
	static add(vector1, vector2) {
		if (!(vector1 instanceof Vector2)) throw new TypeError('point must be instance of Vector2');
		if (!(vector2 instanceof Vector2)) throw new TypeError('point must be instance of Vector2');
		return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
	}

	/**
	 * Скалярное произведение векторов
	 * @param vector1
	 * @param vector2
	 * @returns {boolean}
	 */
	static areParallel(vector1, vector2) {
		if ((vector1.x === 0 && vector1.y === 0) || (vector2.x === 0 && vector2.y === 0)) {
			// Один из векторов имеет нулевую длину, поэтому они не сонаправлены.
			return false;
		}

		// Проверяем, что отношение x-координат и y-координат одинаково для обоих векторов.
		return vector1.x / vector2.x === vector1.y / vector2.y;
	}

	/**
	 * Возвращает массив соседей по фон Мура
	 * @param [vector] {Vector2}
	 * @returns {Vector2[]}
	 */
	static getMooreNeighborhood(vector = new Vector2(0, 0)) {
		return [
			vector.clone().add(new Vector2(-1, -1)), 	// -x, -y
			vector.clone().add(new Vector2(0, -1)), 	// 0, -y
			vector.clone().add(new Vector2(1, -1)), 	// +x, -y
			vector.clone().add(new Vector2(-1, 0)), 	// -x, 0
			vector.clone().add(new Vector2(1, 0)), 		// +x, 0
			vector.clone().add(new Vector2(-1, 1)), 	// -x, +y
			vector.clone().add(new Vector2(0, 1)), 		// 0, +y
			vector.clone().add(new Vector2(1, 1)), 		// +x, +y
		];
	}

	/**
	 * Возвращает массив соседей по фон Нейману
	 * @param [vector] {Vector2}
	 * @returns {Vector2[]}
	 */
	static getVonNeumannNeighborhood(vector = new Vector2(0, 0)) {
		return [
			vector.clone().add(new Vector2(0, -1)),
			vector.clone().add(new Vector2(-1, 0)),
			vector.clone().add(new Vector2(1, 0)),
			vector.clone().add(new Vector2(0, 1)),
		];
	}
}
