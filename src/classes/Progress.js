'use strict';

import {Container, Rectangle} from "../../GameEngine";

export class Progress extends Container {
	#max;
	#value;
	#maxWidth;
	#progress;
	constructor(value= 0, max = 0, x = 0, y = 0, width = 0, height = 0) {
		super();
		this.#maxWidth = width;
		this.#max = max;
		this.#value = value;
		this.#progress = new Rectangle(x, y, width, height);
	}

	get max() {
		return this.#max;
	}
	get value() {
		return this.#value;
	}
	set value(value) {
		if(typeof value !== 'number') throw new TypeError('value must be number');
		this.#value = value;
	}
	set max(value) {
		if(typeof value !== 'number') throw new TypeError('value must be number');
		this.#max = value;
	}

	update(deltaTime) {
		this.#progress.resize(this.#maxWidth * (this.#value / this.#max), this.#progress.height);
		super.update(deltaTime);
	}

	resize(width, height) {
		this.#progress.resize(width, height);
		super.resize(width, height);
	}

	render(canvasContext) {
		this.#progress.fill(canvasContext, {style: 'red'});
	}

}
