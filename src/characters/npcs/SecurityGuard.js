'use strict';

import {Point, Vector2} from "../../../GameEngine";
import {NPC} from '../../classes';
import {GameLogic, sprites, microtasksScope} from "../../levels";

const {children} = sprites;

export const states = GameLogic.getDefaultStates(children, new Vector2(0, 0));

export const SecurityGuard = new NPC('Смотритель', states);

SecurityGuard.moveTo(new Point(33 * 32, 16 * 32));

SecurityGuard.autoWalk.speed = 60;
// SecurityGuard.setMicroTask(new MobMicroTask('_code.nps.farmerBob()'));

SecurityGuard.addUpdateProcess(() => {
	if(SecurityGuard.autoWalk.pathExists()) {
		GameLogic.turnToDirection(SecurityGuard);
		GameLogic.playAnimationDependOnVelocity(SecurityGuard, true);
	} else {
		GameLogic.npcLookAtPlayer(SecurityGuard);
	}
	// Игрок вошел в зону видимости
	GameLogic.npsRunMicroTaskIfExist(SecurityGuard, microtasksScope)

	SecurityGuard.move();
});
