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

	get radius() {
		return this.#radius;
	}

	render(canvasContext) {
		canvasContext.beginPath();
		canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		canvasContext.stroke();
	}


	moveTo(point) {
		this.#point.moveTo(point)
	}
	moveBy(vector2) {
		this.#point.moveBy(vector2)
	}

}
