'use strict';

import {Point} from "./index.js";

export class Circle {

	#point;
	#radius;

	/**
	 * Круг
	 * @param [x] {number} - координата x
	 * @param [y] {number} - координата y
	 * @param [radius] {number} - радиус
	 */
	constructor(x = 0, y = 0, radius = 0) {
		if(typeof radius !== 'number') throw new TypeError('radius must be number');
		this.#point = new Point(x, y);
		this.#radius = radius;
	}

	get point() {
		return this.#point;
	}
	get x() {
		return this.#point.x;
	}
	get y() {
		return this.#point.y;
	}

	get radius() {
		return this.#radius;
	}

	render(canvasContext) {
		canvasContext.beginPath();
		canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		canvasContext.stroke();
	}

	/**
	 * Вычисляет следующую точку
	 * @param vector2
	 * @returns {*}
	 */
	getNextPosition(vector2) {
		return this.#point.getNextPosition(vector2);
	}


	/**
	 * Перемещает точку будущую позицию
	 */
	release() {
		this.#point.release();
	}

	/**
	 * Возвращает точку в исходную позицию
	 */
	rollback() {
		this.#point.rollback();
	}

	moveTo(point) {
		this.#point.moveTo(point)
	}
	moveBy(vector2) {
		this.#point.moveBy(vector2)
	}
	clone() {
		return new Circle(this.x, this.y, this.radius);
	}
	isEmpty() {
		return this.radius === 0;
	}

}
