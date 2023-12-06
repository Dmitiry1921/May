'use strict';

import {Vector2, MobMicroTask} from "../../../GameEngine";
import {NPC} from '../../classes';
import {GameLogic, sprites, microtasksScope} from "../../levels";

const {nps0} = sprites;

export const states = GameLogic.getDefaultStates(nps0, new Vector2(6, 0));

export const Astof = new NPC('Астоф', states); // Астоф
// Astof.resize(32 * 8, 32 * 8);

Astof.autoWalk.speed = 60;
Astof.setMicroTask(new MobMicroTask('_code.nps.astof()'));

Astof.addUpdateProcess(() => {
	if(Astof.autoWalk.pathExists()) {
		GameLogic.turnToDirection(Astof);
		GameLogic.playAnimationDependOnVelocity(Astof, true);
	} else {
		GameLogic.npcLookAtPlayer(Astof);
	}
	// Игрок вошел в зону видимости
	GameLogic.npsRunMicroTaskIfExist(Astof, microtasksScope)

	Astof.move();
});
