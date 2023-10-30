'use strict';

import {Face, NPC, Rectangle, Vector2, Point} from "../../../../GameEngine";
import {sprites, STATE, GameLogic, DEFAULT} from "../../../../levels";

const {nps0, face26} = sprites;

const ANIMATION = GameLogic.getAnimations(nps0, new Vector2(0, 0));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Vanessa = new NPC('Ванесса'); // Ванесса

Vanessa.collider.resize(DEFAULT.COLLISION_BOX.width, DEFAULT.COLLISION_BOX.height);
Vanessa.collider.delta.moveTo(DEFAULT.COLLISION_BOX.delta);

Vanessa.vision.resize(DEFAULT.VISION.radius);
Vanessa.vision.delta.moveTo(DEFAULT.VISION.delta);

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


