'use strict';

import {Character} from "./Character.js";
import {Rectangle} from "../../GameObject/index.js";

export class Mob extends Character {
	#name;

	constructor(name) {
		super(new Rectangle(0, 0, 32, 32));
		this.setType('Mob');
		this.#name = name;
	}

	get name() {
		return this.#name;
	}
}
