'use strict';

import {Point, Vector2} from "../../../GameEngine";
import {NPC} from '../../classes';
import {GameLogic, sprites, microtasksScope} from "../../levels";

const {batman} = sprites;

export const states = GameLogic.getDefaultStates(batman, new Vector2(0, 0));

export const Batman = new NPC('Ярик', states); // Астоф

// TODO REMOVE
Batman.moveTo(new Point(21 * 32, 7 * 32));

Batman.autoWalk.speed = 60;
// Batman.setMicroTask(new MobMicroTask('_code.nps.farmerBob()'));

Batman.addUpdateProcess(() => {
	if(Batman.autoWalk.pathExists()) {
		GameLogic.turnToDirection(Batman);
		GameLogic.playAnimationDependOnVelocity(Batman, true);
	} else {
		GameLogic.npcLookAtPlayer(Batman);
	}
	// Игрок вошел в зону видимости
	GameLogic.npsRunMicroTaskIfExist(Batman, microtasksScope)

	Batman.move();
});
