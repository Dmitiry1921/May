'use strict';

import {Point} from "./index.js";

export class Rectangle {

	#point;
	#delta;
	#width;
	#height;
	#rotation;
	#visible;

	/**
	 * Прямоугольник
	 * @param [x] {number} - координата x
	 * @param [y] {number} - координата y
	 * @param [width] {number} - ширина
	 * @param [height] {number} - высота
	 * @throws {TypeError} - если x, y, width или height не являются числами
	 */
	constructor(x = 0, y = 0, width = 0, height = 0) {
		if(typeof x !== "number") throw new TypeError('x must be number');
		if(typeof y !== "number") throw new TypeError('y must be number');
		if(typeof width !== 'number') throw new TypeError('width must be number');
		if(typeof height !== 'number') throw new TypeError('height must be number');
		this.#point = new Point(x, y);
		this.#delta = new Point(0, 0);
		this.#width = width;
		this.#height = height;
	}

	get point() {
		return this.#point;
	}

	get x() {
		return this.#point.x + this.#delta.x;
	}

	get y() {
		return	this.#point.y + this.#delta.y;
	}

	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
	}

	get delta() {
		return this.#delta;
	}

	set width(value) {
		if(typeof value !== 'number') throw new TypeError('width must be number');
		if(value < 0) throw new RangeError('width must be greater than or equal to 0');
		this.#width = value;
	}
	set height(value) {
		if(typeof value !== 'number') throw new TypeError('height must be number');
		if(value < 0) throw new RangeError('height must be greater than or equal to 0');
		this.#height = value;
	}

	/**
	 * Перемещает прямоугольник в указанную точку
	 * @param point {Point} - точка
	 */
	moveTo(point) {
		this.#point.moveTo(point);
	}

	/**
	 * Перемещает прямоугольник на указанный вектор
	 * @param vector2 {Vector2} - вектор
	 */
	moveBy(vector2) {
		this.#point.moveBy(vector2);
	}

	/**
	 * Изменяет размеры прямоугольника
	 * @param width {number | {width: number, height: number}} - ширина
	 * @param [height] {number} - высота
	 */
	resize(width, height) {
		if(typeof width === "object") {
			this.height = width.height;
			this.width = width.width;
			return this;
		}
		this.width = width;
		this.height = height;
		return this;
	}

	render(canvasContext) {
		// Рисуем прямоугольник на холсте
		canvasContext.beginPath();
		canvasContext.rect(Math.round(this.x) + .5, Math.round(this.y) + .5, this.width, this.height);
		canvasContext.stroke();
	}
}
