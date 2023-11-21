'use strict';

import {Rectangle, Character, Point} from "../../GameEngine";
import {DEFAULT} from "../common/index.js";

/**
 * @extends Character
 */
export class Mob extends Character {

	#name;

	/**
	 * @extends {Character}
	 * @param name {String}
	 * @param states Object<AnimationState>
	 */
	constructor(name, states) {
		if(typeof name !== 'string') throw TypeError('param name should be string');
		super(new Rectangle(0, 0, 32, 32));
		this.setType('Mob');
		this.#name = name;

		this.collider.resize(DEFAULT.COLLISION_BOX.width, DEFAULT.COLLISION_BOX.height);
		this.collider.delta.moveTo(DEFAULT.COLLISION_BOX.delta);

		this.#addStates(states);
		// Задаем начальное состояние
		this.setState(this.randomItemOfArray([
			states.IDLE_TOP.name,
			states.IDLE_LEFT.name,
			states.IDLE_RIGHT.name,
			states.IDLE_BOTTOM.name,
		]));
		this.STATES = states;
	}

	get name() {
		return this.#name;
	}

	#addStates(states) {
		Object.values(states).forEach((state) => {
			this.addAnimationState(state);
		})
	}

	/**
	 * Создает моба в точке карты
	 * @param x {Number}
	 * @param y {Number}
	 * @returns {Mob}
	 */
	static createOnPoint(x, y ) {
		const mob = new this();
		mob.moveTo(new Point(x * 32, y * 32))
		return mob;
	}

	/**
	 * Со
	 * @param points
	 * @returns {*}
	 */
	static createForEachPoint(points) {
		return points.map(({x, y}) => this.createOnPoint(x, y));
	}
}
