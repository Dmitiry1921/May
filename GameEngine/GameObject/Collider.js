'use strict';

import {GameObject, Vector2} from "../../GameEngine";
import {logOnce} from "../utils/logger.js";

const Shapes = [
	'Circle',
	'Rectangle',
];

export class Collider extends GameObject {
	#shape;
	#type;
	// Другие колайдеры, с которыми может столкнуться данный колайдер
	#colliders;
	#handlers;
	#handledTypes;
	// С каким коллайдером столкнулся данный коллайдер
	#collided;
	#collidedNextFrame;
	#availableDirections;
	#velocity;

	constructor(type, shape) {
		super();
		this.#shape = shape;
		this.#type = type;
		this.#colliders = new Map();
		this.#handlers = new Map();
		this.#handledTypes = new Set();

		this.#reset();
	}


	get type() {
		return this.#type;
	}

	set type(value) {
		if (typeof value !== 'string') throw new TypeError('type must be string');
		this.#type = value;
	}

	set shape(value) {
		if (!Shapes.some(name => value.constructor.name === name)) throw new TypeError(`shape must be instance of Shape [${Shapes.join(', ')}]`);
		this.#shape = value;
	}

	get shape() {
		return this.#shape.constructor.name;
	}

	get x() {
		return this.#shape.x;
	}

	get y() {
		return this.#shape.y;
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

	get visible() {
		return this.#shape.visible;
	}

	get delta() {
		return this.#shape.delta;
	}

	get velocity() {
		return this.#velocity;
	}
	setVelocity(value) {
		if (!(value instanceof Vector2)) throw new TypeError('velocity must be instance of Vector2');
		console.log('set velocity', value);
		this.#velocity = value;
	}

	moveTo(point) {
		this.#shape.moveTo(point);
	}

	moveBy(vector2) {
		this.#shape.moveBy(vector2);
	}

	getNextPosition(vector2) {
		this.#shape.getNextPosition(vector2);
	}

	resize(width, height) {
		this.#shape.resize(width, height);
	}

	#calcAvailableDirections(collider) {
		const neighbors = Vector2.getVonNeumannNeighborhood();
		// проверяем пересечение в следующем кадре
		neighbors.forEach((neighbor) => {
			// перемещаем коллайдер в следующую позицию
			if(this.#velocity.x !== 0 || this.#velocity.y !== 0) {
			logOnce('========');
			logOnce('neighbor speed:', this.#velocity, neighbor.multiply(this.#velocity))
			}
			this.moveBy(neighbor.multiply(this.#velocity));
			if (this.intersects(collider)) {
				// console.log(neighbor.sign().toString());
				this.#availableDirections.delete(neighbor.sign().toString());
			}
			if(this.#velocity.x !== 0 || this.#velocity.y !== 0) {
				logOnce('!!!!========!!!!');
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
		// this.#shape.release(); // перемещаем коллайдер в следующую позицию
		this.moveBy(this.#velocity);
		if (this.intersects(collider)) {
			if (!this.#collidedNextFrame.has(collider.type)) {
				this.#collidedNextFrame.set(collider.type, new Set());
			}
			this.#collidedNextFrame.get(collider.type).add(collider);
		}
		this.moveBy(this.#velocity.clone().invert());

		// this.#shape.rollback(); // возвращаем коллайдер в текущую позицию
	}

	#detectCollisionsForHandler(type, collider) {
		if (this.#handlers.has(type)) {
			this.#handlers.get(type).forEach(handler => handler(this, collider));
		}
	}

	processInput() {

	}

	update(deltaTime) {
		const uniqTypes = [
			...new Set([...this.#handlers.keys(),
				...this.#handledTypes,
			])];
		// Если есть события для обработки пересечения
		uniqTypes.forEach(type => {
			// Берем все коллайдеры с этим типом
			this.#colliders.get(type)?.forEach((collider) => {
				this.#detectCollisionsForHandler(type, collider)
				this.#detectCollisionsInCurrentFrame(collider);
				this.#detectCollisionsInNextFrame(collider);
				this.#calcAvailableDirections(collider);
			});
		});
	}

	#reset() {
		// Сбрасываем состояние
		this.#collided = new Map();
		this.#collidedNextFrame = new Map();
		this.#availableDirections = new Map();
		Vector2.getVonNeumannNeighborhood().forEach((neighbor) => {
			this.#availableDirections.set(neighbor.sign().toString(), neighbor);
		});
	}

	render(canvasContext) {
		this.#reset();

		// Задаем цвет и толщину линии
		canvasContext.lineWidth = .5;
		canvasContext.strokeStyle = "red";

		this.#shape.render(canvasContext);

		// Отрисовываем диагональные линии
		canvasContext.beginPath();
		canvasContext.moveTo(Math.round(this.x) + .5, Math.round(this.y) + .5);
		canvasContext.lineTo(Math.round(this.x) + .5 + this.width, Math.round(this.y) + .5 + this.height);
		canvasContext.stroke();

		// Отрисовываем диагональные линии
		canvasContext.beginPath();
		canvasContext.moveTo(Math.round(this.x) + .5 + this.width, Math.round(this.y) + .5);
		canvasContext.lineTo(Math.round(this.x) + .5, Math.round(this.y) + .5 + this.height);
		canvasContext.stroke();
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
		if (typeof type !== "string") throw new TypeError('type must be string');
		return this.#collided.has(type);
	}

	/**
	 * Столкнулся ли данный коллайдер с коллайдером указанного типа в следующий кадр
	 * @param type {String} - тип коллайдера
	 * @returns {boolean} - true если столкнулся, иначе false
	 */
	hasIntersectedInNextFrameWithType(type) {
		if (typeof type !== "string") throw new TypeError('type must be string');
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
		if (!(collider instanceof Collider)) throw new TypeError('collider must be instance of Collider');
		if (!this.#colliders.has(collider.type)) {
			this.#colliders.set(collider.type, new Set());
		}
		this.#colliders.get(collider.type).add(collider);
	}

	addColliders(colliders) {
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
		const collisionKey = [collider1.shape, '2', collider2.shape];
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
	 * @param collider1 {Collider}
	 * @param collider2 {Collider}
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
	 * @param collider1 {Collider}
	 * @param collider2 {Collider}
	 * @returns {boolean}
	 * @constructor
	 */
	static Circle2Rectangle(collider1, collider2) {
		const circleDistanceX = Math.abs(collider1.x - collider2.x);
		const circleDistanceY = Math.abs(collider1.y - collider2.y);

		if (circleDistanceX > (collider2.width / 2 + collider1.width / 2)) return false
		if (circleDistanceY > (collider2.height / 2 + collider1.width / 2)) return false
		if (circleDistanceX <= (collider2.width / 2)) return true;
		if (circleDistanceY <= (collider2.height / 2)) return true;

		const cornerDistance_sq = (circleDistanceX - collider2.width / 2) ** 2 +
			(circleDistanceY - collider2.height / 2) ** 2;

		return (cornerDistance_sq <= (collider1.width / 2) ** 2);
	}
}
