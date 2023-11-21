'use strict';

import {Vector2, Point, getRandomInt} from "../../../GameEngine";
import {Mob} from '../../classes'
import {GameLogic, sprites} from "../../levels";

const {animal} = sprites;

/**
 * @extends Mob
 */
export class Dog extends Mob {
	constructor() {

		const states = GameLogic.getDefaultStates(animal, new Vector2(0, 0), 1 / 5);

		super(Dog.constructor.name, states);

		this.autoWalk.speed = 30;

		this.addProcessInput(() => {
			if(!this.autoWalk.pathExists()) {
				this.autoWalk.awakeDelay = getRandomInt(300, 1500);
				this.autoWalk.searchPath(this.pathFinder.getRandomAvailablePoint())
			}
		});

		this.addUpdateProcess(() => {
			GameLogic.turnToDirection(this);
			GameLogic.playAnimationDependOnVelocity(this);
			// Двигаем персонажа
			this.move();
		});
	}

	/**
	 * @param x {Number}
	 * @param y {Number}
	 * @returns {Dog}
	 */
	static createOnPoint(x, y) {
		const mob = new Dog();
		mob.moveTo(new Point(x * 32, y * 32))
		return mob;
	}
}
