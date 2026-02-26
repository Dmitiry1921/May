'use strict';

import {Layer, Point} from "../../../GameEngine";

export class Container extends Layer {
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
		canvasContext.save();
		canvasContext.translate(this.#point.x, this.#point.y);
		super.render(canvasContext);
		canvasContext.restore();
	}
}
