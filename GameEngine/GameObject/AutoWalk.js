'use strict';

import {Character, GameObject, Vector2} from "../../GameEngine";

export class AutoWalk extends GameObject {
	#path;
	#speed;
	#target;
	#character;
	#distanceThreshold;
	#awakeTimer;
	#awakeDelay;
	#mode;
	#moved;
	#finish;

	constructor(character) {
		super();
		this.#path = [];
		this.#target = null;
		this.#awakeTimer = null;
		this.#awakeDelay = 0;
		this.#speed = 64;
		this.#distanceThreshold = 1;
		this.character = character;
		this.#mode = AutoWalk.MODE.RANDOM_MOVEMENT;
		this.#moved = false;
		this.#finish = null;
	}

	get target() {
		return this.#target;
	}

	set target(value) {
		if (value !== null && !(value instanceof Vector2)) throw new TypeError('target must be instance of Vector2');
		return this.#target = value;
	}

	get character() {
		return this.#character;
	}

	set character(character) {
		if (!(character instanceof Character)) throw new TypeError('character must be instance of Character');
		this.#character = character;
	}

	set awakeDelay(value) {
		if (typeof value !== 'number') throw new TypeError('awakeDelay must be number');
		if (value < 0) throw new RangeError('awakeDelay must be greater than or equal to 0');
		this.#awakeDelay = value;
	}

	set moved(value) {
		if (typeof value !== "boolean") throw new TypeError('value must be boolean');
		this.#moved = value;
	}

	get moved() {
		return this.#moved;
	}

	/**
	 * Возвращает точку персонажа
	 * @returns {Point}
	 */
	get characterPoint() {
		const mobPoint = this.#character.collider.shape.bound().point.clone();
		mobPoint.moveBy(new Vector2(this.#character.collider.shape.bound().width / 2, this.#character.collider.shape.bound().height));
		return mobPoint;
	}

	/**
	 * Возвращает вектор с координатами персонажа
	 * @returns {Vector2}
	 */
	get characterVector() {
		return new Vector2(this.characterPoint.x, this.characterPoint.y);
	}

	get speed() {
		return this.#speed;
	}

	set speed(speed) {
		if (typeof speed !== 'number') throw new TypeError('speed must be number');
		this.#speed = speed;
	}

	get finish() {
		if(typeof this.#finish !== 'function') return () => {};
		const finish = this.#finish;
		this.#finish = null;
		return finish;
	}

	static get MODE() {
		return {
			RANDOM_MOVEMENT: 'Random Movement', // Случайное движение
			RADIOS_PATROLLING: 'Radius Patrolling', // Патрулирование радиуса
			WAYPOINT_FOLLOWING: 'Waypoint Following', // Патрулирование маршрута
			TRACKING: 'Tracking', // Преследование
		};
	}

	/**
	 * Получает следующую точку маршрута
	 */
	#getNextTarget() {
		if (!this.#path.length) return;
		if (this.#target !== null) return;
		const cord = this.#path.shift();
		this.target = new Vector2(cord.x + this.character.pathFinder.cellSize / 2, cord.y + this.character.pathFinder.cellSize / 2);
	}

	/**
	 * Проверяет, есть ли точки маршрута
	 */
	#checkPath() {
		if (!!this.#path.length) return;
		this.target = null;
		this.character.velocity.x = 0;
		this.character.velocity.y = 0;
		this.finish();
	}

	/**
	 * Проверяет, достиг ли персонаж цели
	 */
	#checkTarget() {
		if (!this.#path.length) return;
		if (this.target === null) return;
		if (this.target.distanceTo(this.characterPoint) < this.#distanceThreshold) {
			this.target = null;
		}
	}

	/**
	 * Двигаем персонажа к цели
	 * @param deltaTime
	 */
	#moveToTarget(deltaTime) {
		if (this.target === null) return;
		// если точка маршрута есть, то двигаемся к ней
		const distance = this.characterVector.distanceTo(this.#target);
		const timeToReach = distance / this.speed; // Время в секундах
		// На каждом кадре
		const progress = Math.min(deltaTime / timeToReach, 1); // Прогресс движения
		const directionVector = Vector2.diff(this.#target, this.characterVector);
		// Интерполируем позицию
		this.#character.velocity.x = directionVector.x * progress;
		this.#character.velocity.y = directionVector.y * progress;
	}

	searchPathOnce(point) {
		if (this.#moved) return;
		this.#moved = true;
		this.searchPath(point);
	}

	/**
	 * Поиск пути до точки
	 * @param point  {Point}
	 */
	searchPath(point) {
		if(!point) return;
		if (this.#awakeTimer !== null) return;
		const path = this.#character.pathFinder.searchPath(this.characterPoint, point);
		if (this.#awakeDelay === 0) {
			this.#path = path;
			return;
		}
		this.#awakeTimer = setTimeout(() => {
			this.#path = path;
			this.#awakeTimer = null;
		}, this.#awakeDelay);
	}

	/**
	 * Проверяет, есть ли маршрут
	 * @returns {boolean}
	 */
	pathExists() {
		return !!this.#path.length && this.#awakeTimer === null;
	}

	processInput(deltaTime) {
		this.#checkPath();
		this.#checkTarget();
		this.#getNextTarget();
		this.#moveToTarget(deltaTime);
	}

	then(func) {
		if(typeof func !== 'function') throw new TypeError('func must be function');
		this.#finish = func;
	}

}
