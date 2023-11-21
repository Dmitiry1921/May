'use strict';

import {Vector2, getRandomInt} from "../../../GameEngine";
import {Enemy} from '../../classes'
import {GameLogic, sprites} from "../../levels";

const {zombies} = sprites;

/**
 * @extends Enemy
 */
export class Zombie extends Enemy {
	constructor() {

		const ANIMATION = GameLogic.getAnimations(zombies, new Vector2(0, 0), 1 / 5);
		const states = GameLogic.getAnimationStates(ANIMATION);

		super(Zombie.constructor.name, states);

		this.autoWalk.speed = 20;

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
}
