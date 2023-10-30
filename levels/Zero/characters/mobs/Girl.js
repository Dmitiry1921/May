'use strict';

import {Mob, Point, Vector2} from "../../../../GameEngine";
import {sprites, STATE, GameLogic, DEFAULT} from "../../../../levels";

const {children} = sprites;

const ANIMATION =  GameLogic.getAnimations(children, new Vector2(3, 4));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Girl = new Mob('Девочка'); // Девочка

Girl.collider.resize(DEFAULT.COLLISION_BOX.width, DEFAULT.COLLISION_BOX.height);
Girl.collider.delta.moveTo(DEFAULT.COLLISION_BOX.delta);

// Girl.resize(32 * 8, 32 * 8);
// WALK
Girl.addAnimationState(STATES.WALK_TOP);
Girl.addAnimationState(STATES.WALK_LEFT);
Girl.addAnimationState(STATES.WALK_RIGHT);
Girl.addAnimationState(STATES.WALK_BOTTOM);

Girl.moveTo(new Point(13 * 32, 3 * 32));
Girl.setState(STATE.WALK_BOTTOM); // задаем начальное состояние



