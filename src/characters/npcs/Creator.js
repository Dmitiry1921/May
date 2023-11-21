'use strict';

import {Point, Vector2} from "../../../GameEngine";
import {NPC} from '../../classes';
import {GameLogic, sprites,  microtasksScope} from "../../levels";

const {nps1} = sprites;

export const states = GameLogic.getDefaultStates(nps1, new Vector2(10, 4));

export const Creator = new NPC('Создатель', states);

Creator.moveTo(new Point(2 * 32, 3 * 32));

Creator.autoWalk.speed = 60;
// Creator.setMicroTask(new MobMicroTask('_code.nps.ask()'));

Creator.addUpdateProcess(() => {
	if(Creator.autoWalk.pathExists()) {
		GameLogic.turnToDirection(Creator);
		GameLogic.playAnimationDependOnVelocity(Creator, true);
	} else {
		GameLogic.npcLookAtPlayer(Creator);
	}
	// Игрок вошел в зону видимости
	GameLogic.npsRunMicroTaskIfExist(Creator, microtasksScope)

	Creator.move();
});
