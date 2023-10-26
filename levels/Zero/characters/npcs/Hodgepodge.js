'use strict';

import {Face, NPC, Rectangle, Point, Circle, Vector2} from "../../../../GameEngine";
import {sprites} from "../../../assets";
import {GameLogic, STATE} from "../../../common";

const {nps0, face17} = sprites;

const ANIMATION = GameLogic.getAnimations(nps0, new Vector2(3, 4));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Hodgepodge = new NPC('Даздраперма'); // Даздраперма

Hodgepodge.collider.shape = new Circle(0, 0, 32);
Hodgepodge.collider.delta.moveTo(new Point(Hodgepodge.bound.width / 2, Hodgepodge.bound.height));

Hodgepodge.setFace(new Face(face17, new Rectangle(0, 96, 96, 96)));

Hodgepodge.addAnimationState(STATES.IDLE_BOTTOM);
Hodgepodge.addAnimationState(STATES.IDLE_RIGHT);
Hodgepodge.addAnimationState(STATES.IDLE_TOP);
Hodgepodge.addAnimationState(STATES.IDLE_LEFT);

Hodgepodge.setState(STATE.IDLE_BOTTOM);
Hodgepodge.moveTo(new Point(16 * 32, 4 * 32 + 10));

Hodgepodge.addUpdateProcess(() => {
	GameLogic.npcLookAtPlayer(Hodgepodge, STATE.IDLE_BOTTOM);
});
