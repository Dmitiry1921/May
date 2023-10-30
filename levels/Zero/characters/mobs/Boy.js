'use strict';

import {Mob, Vector2, Point} from "../../../../GameEngine";
import {DEFAULT, GameLogic, sprites, STATE} from "../../../../levels";

const {children} = sprites;

const ANIMATION = GameLogic.getAnimations(children, new Vector2(3, 0))
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Boy = new Mob('Мальчик'); // Мальчик
// Boy.resize(32 * 8, 32 * 8);

Boy.collider.resize(DEFAULT.COLLISION_BOX.width, DEFAULT.COLLISION_BOX.height);
Boy.collider.delta.moveTo(DEFAULT.COLLISION_BOX.delta);

Boy.addAnimationState(STATES.WALK_TOP);
Boy.addAnimationState(STATES.WALK_LEFT);
Boy.addAnimationState(STATES.WALK_RIGHT);
Boy.addAnimationState(STATES.WALK_BOTTOM);
// Задаем позицию персонажа
Boy.moveTo(new Point(34 * 32, 12 * 32));
// Задаем начальное состояние
Boy.setState(STATE.WALK_BOTTOM);

const speed = 70; // 80 оптимально
let path = [];
let target = null;
let distance;
let timeToReach; // Время в секундах
Boy.addProcessInput((deltaTime) => {
	const collider = Boy.collider;
	const mobPoint = collider.shape.bound().point.clone();
	mobPoint.moveBy(new Vector2(collider.shape.bound().width, collider.shape.bound().height));
	const mobVector = new Vector2(mobPoint.x, mobPoint.y);
	// запускаем процесс поиска маршрутка в случае если его нет
	if (path.length === 0) {
		target = null;
		Boy.velocity.x = 0;
		Boy.velocity.y = 0;
		path = Boy.pathFinder.searchPath(mobPoint, Boy.pathFinder.getRandomAvailablePoint());
		Boy.pathFinder.drawPath(path);
	}
	// получаем следующую точку маршрута
	if (path.length !== 0 && target === null) {
		const point = path.shift();
		target = new Vector2(point.x, point.y);
	}
	// если точка маршрута достигнута, то сбрасываем ее
	if (target !== null && target.distanceTo(mobPoint) < 10) {
		target = null;
		// throw new Error('STOP');
	}
	// если точка маршрута есть, то двигаемся к ней
	if (target !== null) {
		distance = mobVector.distanceTo(target);
		timeToReach = distance / speed; // Время в секундах
		// На каждом кадре
		const progress = Math.min(deltaTime / timeToReach, 1); // Прогресс движения
		const directionVector = Vector2.diff(target, mobVector);
		// Интерполируем позицию
		Boy.velocity.x = directionVector.x * progress;
		Boy.velocity.y = directionVector.y * progress;
	}
});


Boy.addUpdateProcess(() => {
	const velocitySign = Boy.velocity.sign();
	// console.log('asdasds', target, Boy.velocity);
	// Если персонаж не двигается, то останавливаем анимацию
	if (velocitySign.x === 0 && velocitySign.y === 0) {
		Boy.stopAnimation();
		// выходим если персонаж не двигается
		return;
	}
	// Задаем направление анимации в зависимости от вектора скорости
	if (velocitySign.x === 1) {
		// Идем вправо
		Boy.handleEvent(STATE.WALK_RIGHT);
	}
	if (velocitySign.x === -1) {
		// Идем влево
		Boy.handleEvent(STATE.WALK_LEFT);
	}

	if (velocitySign.y === 1) {
		// Идем вниз
		Boy.handleEvent(STATE.WALK_BOTTOM);
	}
	if (velocitySign.y === -1) {
		// Идем вверх
		Boy.handleEvent(STATE.WALK_TOP);
	}
	// Иначе воспроизводим анимацию
	Boy.playAnimation();

	// Двигаем персонажа
	Boy.move();
});

// Boy.pathFinder.autoWalk(true);
// Boy.pathFinder.walkMode(WALK_MODE.RANDOM);
// Boy.pathFinder.walkRadius(32 * 3);
// Boy.pathFinder.walkGrid(100, 100);
