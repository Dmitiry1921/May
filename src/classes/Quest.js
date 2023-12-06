'use strict';

export class Quest {
	#title;
	#description;
	#isCompleted;
	#reward;
	#condition;
	constructor(title, description, reward, condition) {
		this.title = title;
		this.description = description;
		this.reward = reward;
		this.condition = condition;
		this.#isCompleted = false;
	}

	get title() {
		return this.#title;
	}
	get description() {
		return this.#description;
	}
	get reward() {
		return this.#reward;
	}
	get condition() {
		return this.#condition;
	}

	set title(value) {
		if(typeof value !== 'string') throw new TypeError('value must be string');
		this.#title = value;
	}
	set description(value) {
		if(typeof value !== 'string') throw new TypeError('value must be string');
		this.#description = value;
	}
	set reward(value) {
		if(typeof value !== 'function') throw new TypeError('value must be function');
		this.#reward = value;
	}
	set condition(value) {
		if(typeof value !== 'function') throw new TypeError('value must be function');
		this.#condition = value;
	}

	get isCompleted() {
		return this.#isCompleted;
	}

	update() {
		if(this.#isCompleted) return;
		if(this.condition()) {
			this.#isCompleted = true;
			this.reward();
		}
	}
}
