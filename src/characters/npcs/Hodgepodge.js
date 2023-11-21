'use strict';

import {Point, Vector2} from "../../../GameEngine";
import {NPC} from '../../classes';
import { GameLogic, sprites} from "../../levels";

const {nps0} = sprites;

const states = GameLogic.getDefaultStates(nps0, new Vector2(3, 4));

export const Hodgepodge = new NPC('Даздраперма', states); // Даздраперма

Hodgepodge.moveTo(new Point(16 * 32, 4 * 32 + 10));

Hodgepodge.addUpdateProcess(() => {
	GameLogic.npcLookAtPlayer(Hodgepodge);
});
