'use strict';

import {Point, Vector2} from "../../../GameEngine";
import {NPC} from '../../classes';
import {GameLogic, sprites, microtasksScope} from "../../levels";

const {nps1} = sprites;

const ANIMATION = GameLogic.getAnimations(nps1, new Vector2(6, 0));
export const states = GameLogic.getAnimationStates(ANIMATION);

export const Kirill = new NPC('Кирилл', states); // Астоф

Kirill.moveTo(new Point(33 * 32, 4 * 32));

Kirill.autoWalk.speed = 60;
// Kirill.setMicroTask(new MobMicroTask('_code.nps.farmerBob()'));

Kirill.addUpdateProcess(() => {
	if(Kirill.autoWalk.pathExists()) {
		GameLogic.turnToDirection(Kirill);
		GameLogic.playAnimationDependOnVelocity(Kirill, true);
	} else {
		GameLogic.npcLookAtPlayer(Kirill);
	}
	// Игрок вошел в зону видимости
	GameLogic.npsRunMicroTaskIfExist(Kirill, microtasksScope)

	Kirill.move();
});
