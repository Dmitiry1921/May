'use strict';

import {Vector2, getRandomInt} from "../../../GameEngine";
import {Mob} from '../../classes'
import {GameLogic, sprites} from "../../levels";

const {animal} = sprites;

// TODO при приближении игрока ускоряется и убегает ищя новый маршрут как можно дальше от игрока

/**
 * @extends Enemy
 */
export class Cat extends Mob {
	constructor() {

		const states = GameLogic.getDefaultStates(animal, new Vector2(0, 4), 1 / 5);

		super(Cat.constructor.name, states);

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
