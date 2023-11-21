'use strict';

import {Layout, Point} from "../../../GameEngine";

export class Container extends Layout {
	#point;

	constructor() {
		super();
		this.#point = new Point(0, 0);
	}

	get point() {
		return this.#point;
	}
	moveBy(vector2) {
		this.#point.moveBy(vector2);
	}
	moveTo(point) {
		this.#point.moveTo(point);
	}

	render(canvasContext) {
		const oldTransform = canvasContext.getTransform();
		canvasContext.translate(this.#point.x, this.#point.y);
		super.render(canvasContext);
		canvasContext.setTransform(oldTransform);
	}
}
