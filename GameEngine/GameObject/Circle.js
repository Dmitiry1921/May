'use strict';

import {Point} from "./index.js";

export class Circle {

	#point;
	#delta;
	#radius;


	/**
	 * Круг
	 * @param [x] {number} - координата x
	 * @param [y] {number} - координата y
	 * @param [radius] {number} - радиус
	 */
	constructor(x = 0, y = 0, radius = 0) {
		this.#point = new Point(x, y);
		this.#delta = new Point(0, 0);
		this.#radius = radius;
	}

	get point() {
		return this.#point;
	}
	get x() {
		return this.#point.x + this.#delta.x;
	}
	get y() {
		return this.#point.y + this.#delta.y;
	}
	get radius() {
		return this.#radius;
	}
	get delta() {
		return this.#delta;
	}
	set radius(value) {
		if(typeof value !== 'number') throw new TypeError('radius must be number');
		if(value < 0) throw new RangeError('radius must be greater than or equal to 0');
		this.#radius = value;
	}

	render(canvasContext) {
		canvasContext.beginPath();
		canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		canvasContext.stroke();
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
	resize(radius) {
		this.radius = radius;
	}
	clone() {
		return new Circle(this.x, this.y, this.radius);
	}
	isEmpty() {
		return this.radius === 0;
	}

}
