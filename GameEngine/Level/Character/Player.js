'use strict';

import {Character} from "../Character";
import {Rectangle} from "../../GameObject/index.js";

export class Player extends Character {
	#name;
	#events;
  constructor(name) {
		if(typeof name !== 'string') throw new TypeError('name must be string');
		super(new Rectangle(0, 0, 32, 32));
		this.setType('Player');
		this.#name = name;
		this.#events = new Map();
  }

	get name() {
		return this.#name;
	}
}
