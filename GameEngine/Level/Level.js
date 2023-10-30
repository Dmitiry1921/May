'use strict';

import {
	GameObject,
	ImageLoader,
	LayoutArray,
	Layout,
	LayoutCharacters,
	PathFinder,
	Point,
	LayoutMap
} from "../../GameEngine";

export class Level extends GameObject {
	#layouts;
	#colliders;
	#characters;
	#pathFinder;
	#charactersLayer;

	/**
	 *
	 * @param layouts[] {Layout | LayoutCharacters} - Порядок расположения слоев карты
	 */
	constructor(...layouts) {
		super();
		this.#layouts = new LayoutArray();
		this.#characters = new Map();
		this.#colliders = new Set();

		this.addLayouts(...layouts);
		this.#pathFinder = new PathFinder(this.#getTileGridSize());
		this.pathFinder.addColliders(this.#colliders);
	}

	get pathFinder() {
		return this.#pathFinder;
	}

	#getTileGridSize() {
		return this.#layouts.find(layout => layout instanceof LayoutMap)?.getTileGridSize() || new Point(0, 0);
	}

	processInput(deltaTime) {
		this.#layouts.processInput(deltaTime);
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
		this.#pathFinder.render(canvasContext);
	}

	async init() {
		await Promise.all(this.resources.map(resource => resource.load()));
		this.resources.forEach(resource => {
			if(resource instanceof ImageLoader) resource.sliceIntoTiles();
		});
		this.#pathFinder.init();
	}

	#checkCharacterLayer() {
		if(this.#charactersLayer === undefined) throw new Error('Level characters layer is not defined, use Level.charactersLayer() in Level constructor');
	}

	addCharacter(character) {
		this.#checkCharacterLayer();
		this.addCollider(character);
		this.addResources(character.resources);
		this.#characters.set(character.name, character);
		this.#charactersLayer.addCharacter(character);
		character.setPathFinder(this.#pathFinder);
		// обновляем для всех персонажей коллайдеры
		this.#characters.forEach(char => {
			char.collider.addColliders(this.#colliders);
			char.vision.addColliders(this.#colliders);
		});
	}

	/**
	 * Задает функцию сортировки персонажей перед рисованием на canvas
	 * @param compareFn {function} - функция сравнения
	 */
	setSortCharactersBeforeRender(compareFn) {
		this.#checkCharacterLayer();
		this.#charactersLayer.setSortBeforeRender(compareFn);
	}

	addCollider(collider) {
		if(!(collider instanceof GameObject)) throw new TypeError('collider must be instance of GameObject');
		this.#colliders.add(collider);
	}

	addColliders(colliders) {
		if(!Array.isArray(colliders)) throw new TypeError('colliders must be array');
		colliders.forEach(collider => this.addCollider(collider));
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
