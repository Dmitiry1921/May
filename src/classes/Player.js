'use strict';

import {Mob} from './Mob.js';
import {QuestArray} from "./QuestArray.js";

export class Player extends Mob {
	#name;
	#events;
	#quests;
  constructor(name, states) {
		if(typeof name !== 'string') throw new TypeError('name must be string');
		super(name, states);
		this.setType('Player');
		this.#name = name;
		this.#events = new Map();
		this.#quests = new QuestArray();
  }

	get name() {
		return this.#name;
	}

	update(deltaTime) {
		super.update(deltaTime);
		this.#quests.update(deltaTime);
	}
}
