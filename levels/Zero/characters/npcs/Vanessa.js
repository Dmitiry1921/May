'use strict';

import {Face, NPC, Rectangle, Vector2, Point, Circle} from "../../../../GameEngine";
import {sprites, STATE, GameLogic} from "../../../../levels";

const {nps0, face26} = sprites;

const ANIMATION = GameLogic.getAnimations(nps0, new Vector2(0, 0));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Vanessa = new NPC('Ванесса'); // Ванесса

Vanessa.collider.shape = new Circle(0, 0, 32);
Vanessa.collider.delta.moveTo(new Point(Vanessa.bound.width / 2, Vanessa.bound.height));
// Vanessa.resize(32 * 8, 32 * 8);

Vanessa.addAnimationState(STATES.IDLE_BOTTOM);
Vanessa.addAnimationState(STATES.IDLE_TOP);
Vanessa.addAnimationState(STATES.IDLE_LEFT);
Vanessa.addAnimationState(STATES.IDLE_RIGHT);

Vanessa.setFace(new Face(face26, new Rectangle(0, 96, 96, 96)));
Vanessa.moveTo(new Point(21 * 32, 15 * 32 + 10));
Vanessa.setState(STATE.IDLE_BOTTOM);

Vanessa.addUpdateProcess(() => {
	GameLogic.npcLookAtPlayer(Vanessa, STATE.IDLE_BOTTOM);
});


