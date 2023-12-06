'use strict';

import {Quest} from "./Quest.js";

export class QuestArray {
	#quests;

	constructor() {
		this.#quests = new Map();
	}

	addQuest(quest) {
		if (!(quest instanceof Quest)) throw new TypeError('quest must be instance of Quest');
		this.#quests.set(quest.title, quest);
	}

	update(deltaTime) {
		this.#quests.forEach((quest) => quest.update(deltaTime));
	}
}
