'use strict';

import {NPC, Vector2, Point} from "../../../../GameEngine"
import {DEFAULT, GameLogic, sprites, STATE} from "../../../../levels";

const {nps0} = sprites;

const ANIMATION = GameLogic.getAnimations(nps0, new Vector2(0, 4));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Her = new NPC('HerKringe');

Her.collider.resize(DEFAULT.COLLISION_BOX.width, DEFAULT.COLLISION_BOX.height);
Her.collider.delta.moveTo(DEFAULT.COLLISION_BOX.delta);

Her.vision.resize(DEFAULT.VISION.radius);
Her.vision.delta.moveTo(DEFAULT.VISION.delta);

Her.addAnimationState(STATES.IDLE_BOTTOM);
Her.addAnimationState(STATES.IDLE_LEFT);
Her.addAnimationState(STATES.IDLE_RIGHT);
Her.addAnimationState(STATES.IDLE_TOP);

Her.moveTo(new Point(12 * 32,14 * 32 + 10))

Her.addUpdateProcess(() => {
	GameLogic.npcLookAtPlayer(Her, STATE.IDLE_BOTTOM);
});

// TODO добавить для него взаимодействие
