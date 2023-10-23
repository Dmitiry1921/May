'use strict';

import {Character, Layout} from "../../../GameEngine";

export class LayoutCharacters extends Layout {

	#characters;
	#compareCharactersBeforeRender;

	constructor() {
		super();
		this.#characters = new Map();
		this.#compareCharactersBeforeRender = () => 0;
	}

	processInput(inputManager) {
		this.#characters.forEach(character => character.processInput(inputManager));
	}

	update(deltaTime) {
		this.#characters.forEach(character => character.update(deltaTime));
	}

	render(canvasContext) {
		[...this.#characters.values()]
			.sort(this.#compareCharactersBeforeRender)
			.forEach(character => character.render(canvasContext))
	}

	/**
	 * Задает функцию сортировки персонажей перед рисованием на canvas
	 * @param compareFn {function} - функция сравнения
	 */
	setSortCharactersBeforeRender(compareFn) {
		if(typeof compareFn !== 'function') throw new TypeError('compareFn must be function');
		this.#compareCharactersBeforeRender = compareFn;
	}

	addCharacter(character) {
		if(!(character instanceof Character)) throw new TypeError('character must be instance of Character')
		this.addResources(character.resources);
		this.addChild(character);
		this.#characters.set(character.name, character);
	}
}
