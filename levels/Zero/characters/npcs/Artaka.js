'use strict';

import {Face, NPC, Rectangle, Point, Circle, Vector2} from "../../../../GameEngine";
import {sprites} from "../../../assets";
import {GameLogic, STATE} from "../../../common";

const {nps1, face21} = sprites;

const ANIMATION = GameLogic.getAnimations(nps1, new Vector2(0, 0));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Artaka = new NPC('Артака'); // Артака

Artaka.collider.shape = new Circle(0, 0, 32);
Artaka.collider.delta.moveTo(new Point(Artaka.bound.width / 2, Artaka.bound.height));

Artaka.addAnimationState(STATES.IDLE_BOTTOM);
Artaka.addAnimationState(STATES.IDLE_LEFT);
Artaka.addAnimationState(STATES.IDLE_RIGHT);
Artaka.addAnimationState(STATES.IDLE_TOP);
Artaka.setFace(new Face(face21, new Rectangle(0, 96, 96, 96)));
Artaka.moveTo(new Point(24 * 32, 4 * 32 + 10));
Artaka.handleEvent(STATE.IDLE_BOTTOM);

Artaka.addUpdateProcess(() => {
	GameLogic.npcLookAtPlayer(Artaka, STATE.IDLE_BOTTOM);
})
