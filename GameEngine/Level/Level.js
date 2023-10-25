'use strict';

import {GameObject, ImageLoader, LayoutArray, Layout, LayoutCharacters} from "../../GameEngine";

export class Level extends GameObject {
	#layouts;
	#colliders;
	#characters;
	#charactersLayer;
	#compareCharactersBeforeRender;

	/**
	 *
	 * @param layouts[] {Layout | LayoutCharacters} - Порядок расположения слоев карты
	 */
	constructor(...layouts) {
		super();
		this.#layouts = new LayoutArray();
		this.#characters = new Map();
		this.#colliders = new Set();
		this.#compareCharactersBeforeRender = () => 0;

		this.addLayouts(...layouts);
	}

	processInput(inputManager) {
		this.#layouts.processInput(inputManager);
	}

	update(deltaTime) {
		this.#layouts.update(deltaTime);
	}

	/**
	 * Рисует персонажей на canvas
	 * @param canvasContext
	 */
	render(canvasContext) {
		this.#layouts.render(canvasContext);
	}

	async init() {
		await Promise.all(this.resources.map(resource => resource.load()));
		this.resources.forEach(resource => {
			if(resource instanceof ImageLoader) resource.sliceIntoTiles();
		});
	}

	#checkCharacterLayer() {
		if(this.#charactersLayer === undefined) throw new Error('Level characters layer is not defined, use Level.charactersLayer() in Level constructor');
	}

	addCharacter(character) {
		this.#checkCharacterLayer();
		this.addResources(character.resources);
		this.#characters.set(character.name, character);
		this.#charactersLayer.addCharacter(character);
		character.collisionBox.addColliders(this.#colliders);
	}


	/**
	 * Задает функцию сортировки персонажей перед рисованием на canvas
	 * @param compareFn {function} - функция сравнения
	 */
	setSortCharactersBeforeRender(compareFn) {
		this.#checkCharacterLayer();
		this.#charactersLayer.setSortBeforeRender(compareFn);
	}

	addColliders(colliders) {
		if(!Array.isArray(colliders)) throw new TypeError('colliders must be array');
		colliders.forEach(collider => {
			if(!(collider instanceof GameObject)) throw new TypeError('collider must be instance of GameObject');
			this.#colliders.add(collider);
		});
	}

	addLayout(layout) {
		if(!(layout instanceof Layout)) throw new Error('layout must be instance of Layout');
		this.addResources(layout.resources);
		this.addColliders(layout.colliders);
		this.#layouts.push(layout);
	}

	addLayouts(...layouts) {
		layouts.flat().forEach(layout => {
			if(layout instanceof LayoutCharacters) {
				if(this.#charactersLayer !== undefined) throw new Error('Level characters layer is already defined');
				this.#charactersLayer = layout;
			}
			this.addLayout(layout);
		});
	}

	static charactersLayer() {
		return new LayoutCharacters();
	}

}
