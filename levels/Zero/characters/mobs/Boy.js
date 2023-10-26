'use strict';

import {Mob, Vector2, Point, Circle} from "../../../../GameEngine";
import {GameLogic, sprites, STATE} from "../../../../levels";

const {children} = sprites;

const ANIMATION = GameLogic.getAnimations(children, new Vector2(3, 0))
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Boy = new Mob('Мальчик'); // Мальчик
// Boy.resize(32 * 8, 32 * 8);

Boy.collider.shape = new Circle(0, 0, 32 / 3);
Boy.collider.delta.moveTo(new Point(Boy.bound.width / 2, Boy.bound.height));

Boy.addAnimationState(STATES.WALK_TOP);
Boy.addAnimationState(STATES.WALK_LEFT);
Boy.addAnimationState(STATES.WALK_RIGHT);
Boy.addAnimationState(STATES.WALK_BOTTOM);
// Задаем позицию персонажа
Boy.moveTo(new Point(34 * 32, 12 * 32));
// Задаем начальное состояние
Boy.setState(STATE.WALK_BOTTOM);
