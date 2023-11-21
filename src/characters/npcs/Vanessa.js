'use strict';

import {Vector2, Point, MobMicroTask} from "../../../GameEngine";
import {NPC} from '../../classes';
import {GameLogic, sprites, microtasksScope} from "../../levels";

const {nps0} = sprites;

const states = GameLogic.getDefaultStates(nps0, new Vector2(0, 0));

export const Vanessa = new NPC('Ванесса', states); // Ванесса

// Vanessa.setFace(new Face(face26, new Rectangle(0, 96, 96, 96)));
Vanessa.moveTo(new Point(21 * 32, 15 * 32 + 10));

Vanessa.autoWalk.speed = 70;

Vanessa.addProcessInput(() => {
	// Vanessa.autoWalk.searchPathOnce(new Point(35 * 32, 15 * 32));
});
Vanessa.setMicroTask(new MobMicroTask('_code.nps.vanessa()'));

Vanessa.addUpdateProcess(() => {
	if(Vanessa.autoWalk.pathExists()) {
		GameLogic.turnToDirection(Vanessa);
		GameLogic.playAnimationDependOnVelocity(Vanessa);
	} else {
		GameLogic.npcLookAtPlayer(Vanessa);
	}

	GameLogic.npsRunMicroTaskIfExist(Vanessa, microtasksScope)

	Vanessa.move();
});


