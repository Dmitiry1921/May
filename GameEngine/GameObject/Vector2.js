'use strict';

export class Vector2 {
	#x;
	#y;

	/**
	 * Создает объект Vector2
	 * @param x { number} - если первый аргумент объект, то второй аргумент должен быть undefined
	 * @param y {number} - если первый аргумент не объект, то второй аргумент должен быть числом
	 * @throws {TypeError} - если аргументы не соответствуют типам
	 * @returns {Vector2}
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
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		this.#x += vector2.x;
		this.#y += vector2.y;
		return this;
	}

	/**
	 * Умножение векторов
	 * @param vector2
	 * @example new Vector2(1, 2).multiply(new Vector2(1, 2)) // Vector2(1, 4)
	 * @returns {Vector2}
	 */
	multiply(vector2) {
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		this.#x *= vector2.x;
		this.#y *= vector2.y;
		return this;
	}

	divide(vector2) {
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		this.#x /= vector2.x;
		this.#y /= vector2.y;
		return this;
	}

	/**
	 * Вычитание векторов
	 * @param vector2
	 * @example new Vector2(1, 2).diff(new Vector2(1, 2)) // Vector2(0, 0)
	 * @returns {Vector2}
	 */
	diff(vector2) {
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		this.#x -= vector2.x;
		this.#y -= vector2.y;
		return this;
	}

	/**
	 * Метод получения нормализованного вектора
	 * @example new Vector2(1, 2).normalize() // Vector2(0.4472135954999579, 0.8944271909999159)
	 * @returns {Vector2}
	 */
	normalize() {
		const length = Math.sqrt(this.x * this.x + this.y * this.y);
		if (length !== 0) {
			this.x /= length;
			this.y /= length;
		}
		return this;
	}

	/**
	 * Инвертирует вектор
	 * @example new Vector2(1, 2).invert() // Vector2(-1, -2)
	 * @returns {Vector2}
	 */
	invert() {
		this.#x *= -1;
		this.#y *= -1;
		return this;
	}

	/**
	 * Разложение векторов на оси
	 * @example new Vector2(1, 2).project() // {x: Vector2(1, 0), y: Vector2(0, 2)}
	 * @returns {{x: Vector2, y: Vector2}}
	 */
	project() {
		return {
			x: new Vector2(this.x, 0),
			y: new Vector2(0, this.y)
		};
	}

	/**
	 * Возвращает новый вектор с тем же направлением, но с длиной 1|0|-1
	 * @example new Vector2(1, 2).sign() // Vector2(1, 1)
	 * @example new Vector2(-100500, 10).sign() // Vector2(-1, 0)
	 * @returns {Vector2}
	 */
	sign(){
		return new Vector2(Math.sign(this.x), Math.sign(this.y));
	}

	// Метод для вычисления расстояния между текущей точкой и другой точкой
	distanceTo(otherPoint) {
		const dx = this.x - otherPoint.x;
		const dy = this.y - otherPoint.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * Возвращает новый вектор с тем же направлением, но с длиной 1|0|-1
	 * @param trashHold
	 * @param targetValue
	 * @returns {Vector2}
	 */
	clampToRange(trashHold, targetValue = 1) {
		return Vector2.clampToRange(this, trashHold, targetValue);
	}

	/**
	 * Создает новый вектор из текущего
	 * @returns {Vector2}
	 */
	clone() {
		return new Vector2(this.#x, this.#y);
	}

	/**
	 * Строковое представление вектора
	 * @returns {string}
	 */
	toString() {
		return `${this.constructor.name}(${this.#x}, ${this.#y})`;
	}

	/**
	 * Разность векторов
	 * @param vector1
	 * @param vector2
	 * @example Vector2.diff(new Vector2(1, 2), new Vector2(1, 2)) // Vector2(0, 0)
	 * @returns {Vector2}
	 */
	static diff(vector1, vector2) {
		if (!(vector1 instanceof Vector2)) throw new TypeError('vector1 must be instance of Vector2');
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y);
	}

	/**
	 * Сложение векторов
	 * @param vector1
	 * @param vector2
	 * @returns {Vector2}
	 */
	static add(vector1, vector2) {
		if (!(vector1 instanceof Vector2)) throw new TypeError('vector1 must be instance of Vector2');
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y);
	}

	static multiply(vector1, vector2) {
		if (!(vector1 instanceof Vector2)) throw new TypeError('vector1 must be instance of Vector2');
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		return new Vector2(vector1.x * vector2.x, vector1.y * vector2.x);
	}

	static divide(vector1, vector2) {
		if (!(vector1 instanceof Vector2)) throw new TypeError('vector1 must be instance of Vector2');
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		return new Vector2(vector1.x / vector2.x, vector1.y / vector2.x);
	}

	/**
	 * Метод получения нормализованного вектора
	 * @returns {Vector2}
	 */
	static normalize(vector) {
		if(!(vector instanceof Vector2)) throw new TypeError('vector must be instance of Vector2');
		const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
		if (length === 0) {
			// Если вектор имеет нулевую длину, возвращаем копию исходного вектора
			return vector;

		}
		return new Vector2(vector.x / length, vector.y / length);
	}

	/**
	 * Создает новый вектор из текущего
	 * @returns {Vector2}
	 */
	static clone(vector) {
		if(!(vector instanceof Vector2)) throw new TypeError('vector must be instance of Vector2');
		return new Vector2(vector.x, vector.y);
	}

	/**
	 * Инвертирует вектор
	 * @param vector
	 * @returns {Vector2}
	 */
	static invert(vector) {
		if(!(vector instanceof Vector2)) throw new TypeError('vector must be instance of Vector2');
		return new Vector2(vector.x * -1, vector.y * -1);
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

	/**
	 * Ограничивает значения x и y объекта Vector2 в заданных пределах.
	 *
	 * @param {Vector2} vector2 - Объект Vector2, который требуется ограничить.
	 * @param {number} trashHold - Порог, при превышении которого значения будут ограничены.
	 * @param {number} [targetValue=1] - Значение, которым будут заменены значения, превышающие порог.
	 * @throws {TypeError} Если vector2 не является экземпляром Vector2 или trashHold/targetValue не является числом.
	 * @returns {Vector2} Новый объект Vector2 с ограниченными значениями.
	 */
	static clampToRange(vector2, trashHold, targetValue = 1) {
		if(!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		if(typeof trashHold !== 'number') throw new TypeError('trashHold must be number');
		if(typeof targetValue !== 'number') throw new TypeError('targetValue must be number');
		const newVector2 = new Vector2(0 ,0);
		// Проверьте, превышают ли значения x или y заданный трешхолд
		if (Math.abs(vector2.x) > trashHold) {
			newVector2.x = vector2.x > 0 ? targetValue : -targetValue;
		}

		if (Math.abs(vector2.y) > trashHold) {
			newVector2.y = vector2.y > 0 ? targetValue : -targetValue;
		}

		return newVector2;
	}
}
