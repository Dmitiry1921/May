'use strict';

import {Rectangle} from "../../../GameEngine";

export class Entity extends Rectangle{
	#rigidBodies;
	constructor(x, y, width, height, rigidBodies = []) {
		super(x, y, width, height);
		this.#rigidBodies = rigidBodies;
	}

	get rigidBodies() {
		return this.#rigidBodies;
	}

	toRectangle() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

	toJSON() {
		return {
			...super.toJSON(),
			rigidBodies: this.#rigidBodies,
		};
	}

	toString() {
		return super.toString();
	}
}
