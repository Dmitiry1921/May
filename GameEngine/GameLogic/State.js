'use strict';

export class State {
	enter;
	exit;
	handleEvent;
	#name;
	constructor(name, {enter, exit, handleEvent}) {
		if(typeof name !== 'string') throw new TypeError('name must be string');
		if(typeof enter !== 'function') throw new TypeError('enter must be function');
		if(typeof exit !== 'function') throw new TypeError('exit must be function');
		if(typeof handleEvent !== 'function') throw new TypeError('handleEvent must be function');
		this.#name = name;
		this.enter = enter;
		this.exit = exit;
		this.handleEvent = handleEvent;
	}

	get name() {
		return this.#name;
	}
}
