'use strict';

import {State} from "./State.js";

export class StateMachine {
	states;
	currentState;
	previousState;
	#defaultState;
	constructor() {
		this.states = new Map();
		this.currentState = null;
		this.previousState = null;
	}

	get defaultState() {
		return this.#defaultState;
	}

	set defaultState(state) {
		if(!(state instanceof State)) throw new TypeError('state must be instance of State');
		this.#defaultState = state;
	}

	/**
	 * Добавляет состояние
	 * @param state {State}
	 */
	addState(state) {
		if(!(state instanceof State)) throw new TypeError('state must be instance of State');
		if (this.states.has(state.name)) throw new Error('State already exists');
		// Если текущее состояние не установлено, то устанавливаем его
		if(this.currentState === null) this.currentState = state.name;
		this.states.set(state.name, state);
	}

	/**
	 * Устанавливает текущее состояние
	 * @param name
	 */
	setState(name) {
		if(typeof name !== 'string') throw new TypeError('name must be string');
		if (!this.states.has(name)) throw new Error('State does not exists');

		if(this.currentState === name) return;
		if (this.currentState) {
			// exit не должен обладать контекстом this
			this.states.get(this.currentState).exit();
		}
		this.currentState = name;
		// call не должен обладать контекстом this
		this.states.get(this.currentState).enter();
	}

	/**
	 * Обновляет текущее состояние
	 * @param event {Event}
	 */
	handleEvent(event) {
		if(this.currentState === null) return;
		this.states.get(this.currentState).handleEvent.call(this, event);
	}

}
