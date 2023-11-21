'use strict';

import {Vector2, getRandomInt} from "../../../GameEngine";
import {Mob} from "../../classes";
import {GameLogic, sprites} from "../../levels";

const {animal} = sprites;

/**
 * @extends Mob
 */
export class Chicken extends Mob {
	constructor() {
		const states = GameLogic.getDefaultStates(animal, new Vector2(3, 4));

		super(Chicken.constructor.name, states);

		this.autoWalk.speed = 20;

		// Задаем начальное состояние
		this.setDefaultState(this.randomItemOfArray([
			states.IDLE_TOP,
			states.IDLE_LEFT,
			states.IDLE_RIGHT,
			states.IDLE_BOTTOM,
		]));

		this.addProcessInput(() => {
			if(!this.autoWalk.pathExists()) {
				this.autoWalk.awakeDelay = getRandomInt(300, 1000);
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
}
