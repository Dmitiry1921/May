'use strict';

import {GameObject, Vector2, Circle, Rectangle} from "../../GameEngine";

const Shapes = [
	'Circle',
	'Rectangle',
];

export class Collider extends GameObject {
	#type;
	#shape;
	#visible;
	#handlers;
	// Другие коллайдеры, с которыми может столкнуться данный коллайдер
	#collided;
	#velocity;
	// С каким коллайдером столкнулся данный коллайдер
	#colliders;
	#handledTypes;
	#collidedNextFrame;
	#availableDirections;

	constructor(type, shape) {
		super();
		this.#shape = shape;
		this.#type = type;
		this.#colliders = new Map();
		this.#handlers = new Map();
		this.#handledTypes = new Set();

		this.#collided = new Map();
		this.#collidedNextFrame = new Map();
		this.#availableDirections = new Map();
		this.#visible = false;

		this.#reset();
	}

	get type() {
		return this.#type;
	}

	set type(value) {
		if (typeof value !== 'string') throw new TypeError('type must be string');
		this.#type = value;
	}

	get shape() {
		return this.#shape;
	}

	get visible() {
		return this.#visible;
	}

	set visible(value) {
		if (typeof value !== 'boolean') throw new TypeError('value must be boolean');
		this.#visible = value;
	}

	get point() {
		return this.#shape.point;
	}

	get x() {
		return this.#shape.x;
	}

	get y() {
		return this.#shape.y;
	}

	get radius() {
		return this.#shape.radius;
	}

	get width() {
		return this.#shape.width;
	}

	get height() {
		return this.#shape.height;
	}

	get rotation() {
		return this.#shape.rotation;
	}

	get delta() {
		return this.#shape.delta;
	}

	get velocity() {
		return this.#velocity;
	}

	set shape(value) {
		if (!Shapes.some(name => value.constructor.name === name)) throw new TypeError(`shape must be instance of Shape [${Shapes.join(', ')}]`);
		this.#shape = value;
	}

	bound() {
		this.#shape.bound();
	}

	setVelocity(value) {
		if (!(value instanceof Vector2)) throw new TypeError('velocity must be instance of Vector2');
		this.#velocity = value;
	}

	moveTo(point) {
		this.#shape.moveTo(point);
	}

	moveBy(vector2) {
		this.#shape.moveBy(vector2);
	}

	resize(width, height) {
		this.#shape.resize(width, height);
	}

	eachAvailableCollider(callback) {
		const uniqTypes = [
			...new Set([...this.#handlers.keys(),
				...this.#handledTypes,
			])];
		// Если есть события для обработки пересечения
		uniqTypes.forEach(type => {
			// Берем все коллайдеры с этим типом
			this.#colliders.get(type)?.forEach((collider) => {
				callback(collider, type);
			});
		});
	}

	#calcAvailableDirections(collider) {
		const neighbors = Vector2.getVonNeumannNeighborhood();
		// проверяем пересечение в следующем кадре
		neighbors.forEach((neighbor) => {
			// перемещаем коллайдер в следующую позицию
			this.moveBy(neighbor.multiply(this.#velocity));
			if (this.intersects(collider)) {
				// console.log(neighbor.sign().toString());
				this.#availableDirections.delete(neighbor.sign().toString());
			}
			this.moveBy(neighbor.invert());
		});
	}

	#detectCollisionsInCurrentFrame(collider) {
		// проверяем пересечение в текущем кадре
		if (this.intersects(collider)) {
			if (!this.#collided.has(collider.type)) {
				this.#collided.set(collider.type, new Set());
			}
			this.#collided.get(collider.type).add(collider);
		}
	}

	#detectCollisionsInNextFrame(collider) {
		// проверяем пересечение в следующем кадре
		this.moveBy(this.#velocity);
		if (this.intersects(collider)) {
			if (!this.#collidedNextFrame.has(collider.type)) {
				this.#collidedNextFrame.set(collider.type, new Set());
			}
			this.#collidedNextFrame.get(collider.type).add(collider);
		}
		this.moveBy(this.#velocity.clone().invert());
	}

	#detectCollisionsForHandler(type, collider) {
		if (this.#handlers.has(type)) {
			this.#handlers.get(type).forEach(handler => handler(this, collider));
		}
	}

	processInput() {

	}

	update(deltaTime) {
		this.eachAvailableCollider((collider, type) => {
			this.#detectCollisionsForHandler(type, )
			this.#detectCollisionsInCurrentFrame(collider);
			this.#detectCollisionsInNextFrame(collider);
			this.#calcAvailableDirections(collider);
		});
	}

	#reset() {
		// Сбрасываем состояние
		this.#collided.clear();
		this.#collidedNextFrame.clear();
		this.#availableDirections.clear();
		Vector2.getVonNeumannNeighborhood().forEach((neighbor) => {
			this.#availableDirections.set(neighbor.sign().toString(), neighbor);
		});
	}

	render(canvasContext) {
		this.#reset();

		if(this.#visible === false) return;
		// Задаем цвет и толщину линии
		canvasContext.lineWidth = .5;
		canvasContext.strokeStyle = "red";

		this.#shape.render(canvasContext);

		// Рисуем диагональные линии
		canvasContext.beginPath();
		canvasContext.moveTo(Math.round(this.#shape.bound().x) + .5, Math.round(this.#shape.bound().y) + .5);
		canvasContext.lineTo(Math.round(this.#shape.bound().x) + .5 + this.width, Math.round(this.#shape.bound().y) + .5 + this.height);
		canvasContext.stroke();

		// Рисуем диагональные линии
		canvasContext.beginPath();
		canvasContext.moveTo(Math.round(this.#shape.bound().x) + .5 + this.width, Math.round(this.#shape.bound().y) + .5);
		canvasContext.lineTo(Math.round(this.#shape.bound().x) + .5, Math.round(this.#shape.bound().y) + .5 + this.height);
		canvasContext.stroke();

		this.#shape.bound().render(canvasContext);
	}

	#checkHandlerType(type, funcName) {
		if(typeof type !== "string") throw new TypeError('type must be string');
		if(!this.#handledTypes.has(type))
			throw new Error(`Before using function ${funcName}() you must add handler for type ${type} for it use .handelType('${type}') or .addHandler('${type}', () => {})`);
	}

	/**
	 * Добавляет обработчик столкновения с коллайдером указанного типа
	 * @param type
	 * @param handler
	 */
	addHandler(type, handler) {
		if (typeof type !== "string") throw new TypeError('type must be string');
		if (typeof handler !== "function") throw new TypeError('handler must be function');
		if (!this.#handlers.has(type)) {
			this.#handlers.set(type, new Set());
		}
		this.#handlers.get(type).add(handler);
	}

	/**
	 * Добавляет тип коллайдера, с которым может столкнуться данный коллайдер
	 * @param type {String} - тип коллайдера
	 */
	handelType(type) {
		if (typeof type !== "string") throw new TypeError('type must be string');
		this.#handledTypes.add(type);
	}

	/**
	 * Столкнулся ли данный коллайдер с коллайдером указанного типа в текущий кадр
	 * @param type {String} - тип коллайдера
	 * @returns {boolean} - true если столкнулся, иначе false
	 */
	hasIntersectedInCurrentFrameWithType(type) {
		this.#checkHandlerType(type, 'hasIntersectedInCurrentFrameWithType');
		return this.#collided.has(type);
	}

	/**
	 * Столкнулся ли данный коллайдер с коллайдером указанного типа в следующий кадр
	 * @param type {String} - тип коллайдера
	 * @returns {boolean} - true если столкнулся, иначе false
	 */
	hasIntersectedInNextFrameWithType(type) {
		this.#checkHandlerType(type, 'hasIntersectedInNextFrameWithType');
		return this.#collidedNextFrame.has(type);
	}

	/**
	 * Возвращает доступные направления для перемещения
	 * @returns {Map}
	 */
	getAvailableDirections() {
		return this.#availableDirections;
	}

	/**
	 * Возвращает коллайдеры, с которыми столкнулся данный коллайдер в текущий кадр
	 * @param type {String} - тип коллайдера
	 * @returns {Set}
	 */
	getCollidedWithType(type) {
		this.#checkHandlerType(type, 'getCollidedWithType');
		return this.#collided.get(type);
	}

	/**
	 * @return {boolean}
	 */
	hasCollider() {
		return !this.#shape.isEmpty();
	}

	/**
	 * Возвращает текущий коллайдер
	 * @return {Collider}
	 */
	getCollider() {
		return this;
	}

	/**
	 * Добавляет коллайдер в список коллайдеров, с которыми может столкнуться данный коллайдер
	 * @param collider {Collider}
	 */
	addCollider(collider) {
		if (!(collider instanceof GameObject)) throw new TypeError('collider must be instance of GameObject');
		if (!this.#colliders.has(collider.type)) {
			this.#colliders.set(collider.type, new Set());
		}
		this.#colliders.get(collider.type).add(collider);
	}

	addColliders(colliders) {
		// console.log(colliders);
		[...colliders].flat().forEach(collider => this.addCollider(collider.getCollider()));
	}

	/**
	 * Проверяет столкнуться ли данный коллайдер с другим коллайдером
	 * @param collider {Collider} - коллайдер
	 * @returns {boolean}
	 */
	intersects(collider) {
		return Collider.intersects(this, collider);
	}

	/**
	 * Проверяет столкнуться ли данный коллайдер с другим коллайдером
	 * @param collider1 {Collider}
	 * @param collider2 {Collider}
	 * @returns {boolean}
	 */
	static intersects(collider1, collider2) {
		if (!(collider1 instanceof Collider)) throw new TypeError('collider1 must be instance of Collider');
		if (!(collider2 instanceof Collider)) throw new TypeError('collider2 must be instance of Collider');
		const collisionKey = [collider1.shape.constructor.name, '2', collider2.shape.constructor.name];
		const collision = Collider[collisionKey.join('')] || Collider[collisionKey.reverse().join('')];
		if (typeof collision !== "function") throw new Error(`Collision method ${collisionKey.join(', ')} not implemented`);
		return collision(collider1, collider2);
	}

	/**
	 * @param collider1 {Collider}
	 * @param collider2 {Collider}
	 * @returns {boolean}
	 */
	static Circle2Circle(collider1, collider2) {
		const dx = collider1.x - collider2.x;
		const dy = collider1.y - collider2.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < collider1.width / 2 + collider2.width / 2;
	}

	/**
	 * @param collider1 {Collider | Rectangle}
	 * @param collider2 {Collider | Rectangle}
	 * @returns {boolean}
	 * @constructor
	 */
	static Rectangle2Rectangle(collider1, collider2) {
		return collider1.x < collider2.x + collider2.width &&
			collider1.x + collider1.width > collider2.x &&
			collider1.y < collider2.y + collider2.height &&
			collider1.y + collider1.height > collider2.y;
	}

	/**
	 * Определяет, пересекаются ли окружность и прямоугольник.
	 * @param {Collider} collider1 - Коллайдер
	 * @param {Collider} collider2 - Коллайдер
	 * @returns {boolean} - `true`, если окружность и прямоугольник пересекаются, иначе `false`.
	 */
	static Circle2Rectangle(collider1, collider2) {
		const circle = collider1.shape instanceof Circle ? collider1 : collider2;
		const rect = collider2.shape instanceof Rectangle ? collider2 : collider1;

		const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
		const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
		const distanceX = circle.x - closestX;
		const distanceY = circle.y - closestY;
		const distanceSquared = (distanceX ** 2) + (distanceY ** 2);

		return distanceSquared < (circle.radius ** 2);
	}
}
