'use strict';

import {
	GameObject,
	ImageLoader,
	LayerArray,
	Layer,
	LayerCharacters,
	PathFinder,
	Point,
	Collider,
	LayerMap,
} from "../../GameEngine";

export class Level extends GameObject {
	#layouts;
	#colliders;
	#characters;
	#pathFinder;
	#initProcesses;
	#collider;
	#charactersLayer;

	/**
	 *
	 * @param layouts[] {Layer | LayerCharacters} - Порядок расположения слоев карты
	 */
	constructor(...layouts) {
		super();
		this.#layouts = new LayerArray();
		this.#characters = new Map();
		this.#colliders = new Set();
		this.#collider = new Collider();
		this.#initProcesses = new Set();

		this.addLayouts(...layouts);
		this.#pathFinder = new PathFinder(this.#getTileGridSize());
		this.pathFinder.addColliders(this.#collider.colliders);
	}

	get pathFinder() {
		return this.#pathFinder;
	}

	get collider() {
		return this.#collider;
	}

	#getTileGridSize() {
		return this.#layouts.find(layout => layout instanceof LayerMap)?.getTileGridSize() || new Point(0, 0);
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

	async load() {
		console.log(this.resources);
		await Promise.all(this.resources.map(resource => resource.load()));
		this.resources.forEach(resource => {
			if(resource instanceof ImageLoader) resource.sliceIntoTiles();
		});
		console.log(this.#pathFinder);
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
			char.collider.addColliders([...this.#collider.colliders]);
			char.vision.addColliders([...this.#collider.colliders]);
		});
	}
	addCharacters(...characters) {
		characters.flat(Infinity).forEach((character) => {
			this.addCharacter(character);
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
		this.#collider.addCollider(collider);
	}

	addColliders(...colliders) {
		if(!Array.isArray(colliders)) throw new TypeError('colliders must be array');
		colliders.flat(Infinity).forEach(collider => this.addCollider(collider));
	}

	addLayout(layout) {
		if(!(layout instanceof Layer)) throw new Error('layout must be instance of Layer');
		this.addResources(layout.resources);
		this.addColliders(layout.colliders);
		this.#layouts.push(layout);
	}

	addLayouts(...layouts) {
		layouts.flat(Infinity).forEach(layout => {
			if(layout instanceof LayerCharacters) {
				if(this.#charactersLayer !== undefined) throw new Error('Level characters layer is already defined');
				this.#charactersLayer = layout;
			}
			layout.parent = this;
			console.log('asdasds')
			this.addLayout(layout);
		});
	}

	addInitProcess(func) {
		if(typeof func !== 'function') throw new TypeError('func must be function');
		this.#initProcesses.add(func);
	}

	init() {
		console.log(this.#pathFinder);
		this.#characters.forEach((character) => {
			character.setPathFinder(this.#pathFinder);
			character.setLevel(this);
		})
		this.#initProcesses.forEach(func => func());
	}

	static charactersLayer() {
		return new LayerCharacters();
	}

}
