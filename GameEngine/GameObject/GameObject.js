'use strict';

import {Collider, getRandomInt, Loader} from "../../GameEngine";
import {logOnce} from "../utils/logger.js";

export class GameObject {
	#parent;
	#rigidBodies;
	#resources;

	constructor() {
		this.#parent = null;
		this.#resources = new Map();
		this.#rigidBodies = [];
	}

	/**
	 * Добавляем ресурс в уровень, но не запускаем загрузку
	 * @param resource {Loader}
	 */
	addResource(resource) {
		if (!(resource instanceof Loader)) throw new TypeError('param resource must be instance of Loader');
		if (this.#resources.has(resource.resourceId)) return;
		this.#resources.set(resource.resourceId, resource);

		return resource;
	}

	/**
	 * Массово добавляет ресурсы в уровень, но не запускает загрузку
	 * @param resources
	 */
	addResources(resources) {
		if (!Array.isArray(resources)) throw new TypeError('resources must be array');
		resources.forEach(resource => this.addResource(resource));
		if(!!this.parent) this.parent.addResources(resources);
	}


	set parent(parent) {
		if(!(parent instanceof GameObject)) throw new TypeError('param parent must be instance of GameObject');
		this.#parent = parent;
	}

	get parent() {
		return this.#parent;
	}

	get rigidBodies() {
		return this.#rigidBodies;
	}

	set rigidBodies(rigidBodies) {
		if (!Array.isArray(rigidBodies)) throw new TypeError('rigidBodies must be array');
		if(rigidBodies.some(rigidBody => !(rigidBody instanceof Collider))) throw new TypeError('rigidBodies must be array of Collider');
		this.#rigidBodies = rigidBodies;
	}

	get resources() {
		return [...this.#resources.values()];
	}

	/**
	 * Перемещает объект в указанную точку
	 * @param point {Point} - точка, в которую перемещаем объект
	 */
	moveTo(point) {
		logOnce('moveTo', this.constructor.name, 'not implemented');
	}

	/**
	 * Перемещает объект на указанный вектор
	 * @param vector2
	 */
	moveBy(vector2) {
		logOnce('moveBy', this.constructor.name, 'not implemented');
	}

	processInput() {
		logOnce('processInput', this.constructor.name, 'not implemented');
	}

	resize() {
		logOnce('resize', this.constructor.name, 'not implemented');
	}

	update(deltaTime) {
		logOnce('update', this.constructor.name, 'not implemented');
	}

	render(canvasContext) {
		logOnce('render', this.constructor.name, 'not implemented');
	}

	toJSON() {
		logOnce('toJSON', this.constructor.name, 'not implemented');
	}

	/**
	 * Проверяет, есть ли у объекта коллайдер
	 * @returns {boolean}
	 */
	hasCollider() {
		logOnce('hasCollider', this.constructor.name, 'not implemented');
	}

	/**
	 * @returns {Collider}
	 */
	getCollider() {
		logOnce('getCollider', this.constructor.name, 'not implemented');
	}

	randomItemOfArray(array) {
		return array[getRandomInt(0, array.length - 1)];
	}
}
