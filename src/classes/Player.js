'use strict';

import {Mob} from './Mob.js';

export class Player extends Mob {
	#name;
	#events;
  constructor(name, states) {
		if(typeof name !== 'string') throw new TypeError('name must be string');
		super(name, states);
		this.setType('Player');
		this.#name = name;
		this.#events = new Map();
  }

	get name() {
		return this.#name;
	}
}
