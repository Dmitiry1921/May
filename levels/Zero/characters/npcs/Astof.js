'use strict';

import {Face, NPC, Rectangle, Point, Circle, Vector2} from "../../../../GameEngine";
import {sprites, STATE, GameLogic, DEFAULT} from "../../../../levels";

const {nps0, face24} = sprites;

const ANIMATION = GameLogic.getAnimations(nps0, new Vector2(6, 0));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Astof = new NPC('Астоф'); // Астоф
// Astof.resize(32 * 8, 32 * 8);

Astof.collider.resize(DEFAULT.COLLISION_BOX.width, DEFAULT.COLLISION_BOX.height);
Astof.collider.delta.moveTo(DEFAULT.COLLISION_BOX.delta);

Astof.vision.resize(DEFAULT.VISION.radius);
Astof.vision.delta.moveTo(DEFAULT.VISION.delta);

Astof.addAnimationState(STATES.IDLE_BOTTOM);
Astof.addAnimationState(STATES.IDLE_LEFT);
Astof.addAnimationState(STATES.IDLE_RIGHT);
Astof.addAnimationState(STATES.IDLE_TOP);

Astof.setFace(new Face(face24, new Rectangle(0, 96, 96, 96)));
Astof.handleEvent(STATE.IDLE_RIGHT);
Astof.moveTo(new Point(4.7 * 32, 5 * 32));

Astof.addUpdateProcess(() => {
	GameLogic.npcLookAtPlayer(Astof, STATE.IDLE_RIGHT);
});
