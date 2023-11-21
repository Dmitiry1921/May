'use strict';

import {Point, Vector2} from "../../../GameEngine";
import {NPC} from '../../classes';
import {GameLogic, sprites, microtasksScope} from "../../levels";

const {nps1} = sprites;

export const states = GameLogic.getDefaultStates(nps1, new Vector2(0, 4));

export const Yarik = new NPC('Ярик', states);

Yarik.moveTo(new Point(17 * 32, 10 * 32));

Yarik.autoWalk.speed = 60;
// Yarik.setMicroTask(new MobMicroTask('_code.nps.farmerBob()'));

Yarik.addUpdateProcess(() => {
	if(Yarik.autoWalk.pathExists()) {
		GameLogic.turnToDirection(Yarik);
		GameLogic.playAnimationDependOnVelocity(Yarik, true);
	} else {
		GameLogic.npcLookAtPlayer(Yarik);
	}
	// Игрок вошел в зону видимости
	GameLogic.npsRunMicroTaskIfExist(Yarik, microtasksScope)

	Yarik.move();
});
