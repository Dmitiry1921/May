'use strict';

import {Vector2, Point, getRandomInt} from "../../../GameEngine";
import {Mob} from "../../classes";
import {GameLogic, sprites} from "../../levels";

const {children} = sprites;

const states = GameLogic.getDefaultStates(children, new Vector2(3, 0));

export const Boy = new Mob('Мальчик', states); // Мальчик
// Boy.resize(32 * 8, 32 * 8);

// Boy.collider.visible = true;

// Задаем позицию персонажа
Boy.moveTo(new Point(34 * 32, 12 * 32));

// Задаем начальное состояние
// Boy.setState(STATE.WALK_BOTTOM);

Boy.autoWalk.speed = 69;
Boy.addProcessInput(() => {
	if(!Boy.autoWalk.pathExists()) {
		Boy.autoWalk.awakeDelay = getRandomInt(300, 1500);
		Boy.autoWalk.searchPath(Boy.pathFinder.getRandomAvailablePoint())
	}
});

Boy.addUpdateProcess(() => {
	 GameLogic.turnToDirection(Boy);
	 GameLogic.playAnimationDependOnVelocity(Boy);
	// Двигаем персонажа
	Boy.move();
});
