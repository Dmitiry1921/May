'use strict';

import {Vector2} from "./Vector2.js";

export class Vector3 extends Vector2 {
	#x;
	#y;
	#z;
	constructor(x, y, z) {
		super(x, y);
		this.#z = z;
	}

	toString() {
		return `(${this.#x}, ${this.#y}, ${this.#z})`;
	}

	toJSON() {
		return {
			x: this.#x,
			y: this.#y,
			z: this.#z,
		};
	}
}
