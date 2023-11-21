'use strict';

import {Vector2, Point} from "../../../GameEngine"
import {NPC} from '../../classes';
import {GameLogic, sprites} from "../../levels";

const {nps0} = sprites;

const states = GameLogic.getDefaultStates(nps0, new Vector2(0, 4));

export const Her = new NPC('HerKringe', states);

Her.moveTo(new Point(12 * 32,14 * 32 + 10))

Her.addUpdateProcess(() => {
	GameLogic.npcLookAtPlayer(Her);
});

// TODO добавить для него взаимодействие
