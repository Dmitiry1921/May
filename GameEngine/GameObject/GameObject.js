import {Loader} from "../../GameEngine";

export class GameObject {
	#resources;

	constructor() {
		this.#resources = new Map();
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
	}

	get resources() {
		return [...this.#resources.values()];
	}

	/**
	 * Перемещает объект в указанную точку
	 * @param point {Point} - точка, в которую перемещаем объект
	 */
	moveTo(point) {
		console.warn('moveTo', this.constructor.name, 'not implemented');
	}

	/**
	 * Перемещает объект на указанный вектор
	 * @param vector2
	 */
	moveBy(vector2) {
		console.warn('moveBy', this.constructor.name, 'not implemented');
	}

	processInput() {
		console.warn('processInput', this.constructor.name, 'not implemented');
	}

	resize() {
		console.warn('resize', this.constructor.name, 'not implemented');
	}

	update(deltaTime) {
		console.warn('update', this.constructor.name, 'not implemented');
	}

	render(canvasContext) {
		console.warn('render', this.constructor.name, 'not implemented');
	}

	toString() {
		console.warn('toString', this.constructor.name, 'not implemented');
	}

	toJSON() {
		console.warn('toJSON', this.constructor.name, 'not implemented');
	}
}
