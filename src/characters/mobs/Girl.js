'use strict';

import {getRandomInt, Point, Vector2} from "../../../GameEngine";
import {Mob} from '../../classes';
import {GameLogic, sprites} from "../../levels";

const {children} = sprites;

const states = GameLogic.getDefaultStates(children, new Vector2(3, 4));

export const Girl = new Mob('Девочка', states); // Девочка

Girl.moveTo(new Point(13 * 32, 3 * 32));
// Girl.setState(STATE.WALK_BOTTOM); // задаем начальное состояние

Girl.autoWalk.speed = 70;
Girl.addProcessInput(() => {
	if(!Girl.autoWalk.pathExists()) {
		Girl.autoWalk.awakeDelay = getRandomInt(300, 1500);
		Girl.autoWalk.searchPath(Girl.pathFinder.getRandomAvailablePoint())
	}
});

Girl.addUpdateProcess(() => {
	GameLogic.turnToDirection(Girl);
	GameLogic.playAnimationDependOnVelocity(Girl);
	// Двигаем персонажа
	Girl.move();
});



