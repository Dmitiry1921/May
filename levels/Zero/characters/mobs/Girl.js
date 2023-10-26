'use strict';

import {Circle, Mob, Point, Vector2} from "../../../../GameEngine";
import {sprites, STATE, GameLogic} from "../../../../levels";

const {children} = sprites;

const ANIMATION =  GameLogic.getAnimations(children, new Vector2(3, 4));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Girl = new Mob('Девочка'); // Девочка

Girl.collider.shape = new Circle(0, 0, 32 / 3);
Girl.collider.delta.moveTo(new Point(Girl.bound.width / 2, Girl.bound.height));

// Girl.resize(32 * 8, 32 * 8);
// WALK
Girl.addAnimationState(STATES.WALK_TOP);
Girl.addAnimationState(STATES.WALK_LEFT);
Girl.addAnimationState(STATES.WALK_RIGHT);
Girl.addAnimationState(STATES.WALK_BOTTOM);

Girl.moveTo(new Point(13 * 32, 3 * 32));
Girl.setState(STATE.WALK_BOTTOM); // задаем начальное состояние



