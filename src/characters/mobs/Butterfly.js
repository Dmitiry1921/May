'use strict';

import {Vector2, Point, getRandomInt} from "../../../GameEngine";
import {Mob} from '../../classes'
import {GameLogic, sprites} from "../../levels";

const {animal} = sprites;

/**
 * @extends Mob
 */
export class Butterfly extends Mob {
	constructor(startVector = new Vector2(6, 4)) {

		const states = GameLogic.getDefaultStates(animal, startVector, 1 / 5);

		super(Butterfly.constructor.name, states);

		this.autoWalk.speed = 50;

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
	 * @returns {Butterfly}
	 */
	static createPinkOnPoint(x, y) {
		const butterfly = new Butterfly(new Vector2(9, 4));
		butterfly.moveTo(new Point(x * 32, y * 32))
		return butterfly;
	}
	static createYellowOnPoint(x, y) {
		const butterfly = new Butterfly(new Vector2(6, 4));
		butterfly.moveTo(new Point(x * 32, y * 32))
		return butterfly;

	}
}
