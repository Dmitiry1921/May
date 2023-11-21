'use strict';

import {Point, Vector2} from "../../../GameEngine";
import {NPC} from '../../classes';
import {GameLogic} from '../../common';
import { sprites} from "../../levels";

const {nps1} = sprites;

const states = GameLogic.getDefaultStates(nps1, new Vector2(0, 0));

export const Artaka = new NPC('Артака', states); // Артака

// Artaka.setFace(new Face(face21, new Rectangle(0, 96, 96, 96)));
Artaka.moveTo(new Point(24 * 32, 4 * 32 + 10));

Artaka.addUpdateProcess(() => {
	GameLogic.npcLookAtPlayer(Artaka);
})
