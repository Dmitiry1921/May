'use strict';

import {GameObject, Rectangle, Collider} from '../../GameEngine';

export class Wall extends GameObject {

	#collider;
	#rect;

	constructor(x, y, width, height) {
		super();
		this.#rect = new Rectangle(x, y, width, height);
		this.#collider = new Collider(this.#rect);
	}

	get x() {
		return this.#rect.x;
	}

	get y() {
		return this.#rect.y;
	}

	get width() {
		return this.#rect.width;
	}

	get height() {
		return this.#rect.height;
	}

	moveTo(point) {
		this.#rect.moveTo(point);
	}

	moveBy(vector2) {
		this.#rect.moveBy(vector2);
		console.warn('moveBy', this.constructor.name, 'not implemented');
	}

	resize(width, height) {
		this.#rect.resize(width, height);
	}

	processInput() {

	}

	update() {

	}

	render(canvasContext) {
		// Задаем цвет и толщину линии
		canvasContext.lineWidth = .5;
		canvasContext.strokeStyle = "red";

		// Отрисовываем прямоугольник
		this.#rect.render(canvasContext);

		// Отрисовываем диагональные линии
		canvasContext.beginPath();
		canvasContext.moveTo(Math.round(this.x) + .5, Math.round(this.y) + .5);
		canvasContext.lineTo(Math.round(this.x) + .5 + this.width, Math.round(this.y) + .5 + this.height);
		canvasContext.stroke();

		// Отрисовываем диагональные линии
		canvasContext.beginPath();
		canvasContext.moveTo(Math.round(this.x) + .5 + this.width, Math.round(this.y) + .5);
		canvasContext.lineTo(Math.round(this.x) + .5, Math.round(this.y) + .5 + this.height);
		canvasContext.stroke();
	}
}
