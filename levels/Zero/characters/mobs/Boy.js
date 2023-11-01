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

// Boy.collider.visible = true;

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
Boy.addProcessInput((deltaTime) => {
	const mobPoint = Boy.collider.shape.bound().point.clone();
	mobPoint.moveBy(new Vector2(Boy.collider.shape.bound().width / 2, Boy.collider.shape.bound().height));
	const mobVector = new Vector2(mobPoint.x, mobPoint.y);
	// запускаем процесс поиска маршрутка в случае если его нет
	if (path.length === 0) {
		// код для поиска нового маршрута
		target = null;
		Boy.velocity.x = 0;
		Boy.velocity.y = 0;
		path = Boy.pathFinder.searchPath(mobPoint, Boy.pathFinder.getRandomAvailablePoint());
	} else if (target === null) {
		// код для получения следующей точки маршрута
		const cord = path.shift();
		target = new Vector2(cord.x + Boy.pathFinder.cellSize / 2, cord.y + Boy.pathFinder.cellSize / 2);
	} else if (target.distanceTo(mobPoint) < 1) {
		target = null;
	}
	// если точка маршрута есть, то двигаемся к ней
	if (target !== null) {
		const distance = mobVector.distanceTo(target);
		const timeToReach = distance / speed; // Время в секундах
		// На каждом кадре
		const progress = Math.min(deltaTime / timeToReach, 1); // Прогресс движения
		const directionVector = Vector2.diff(target, mobVector);
		// Интерполируем позицию
		Boy.velocity.x = directionVector.x * progress;
		Boy.velocity.y = directionVector.y * progress;
	}
});


Boy.addUpdateProcess(() => {
	const velocitySign = Boy.velocity.clampToRange(0.5);
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

Boy.addRenderProcess((canvasContext) => {
});

// Boy.pathFinder.autoWalk(true);
// Boy.pathFinder.walkMode(WALK_MODE.RANDOM);
// Boy.pathFinder.walkRadius(32 * 3);
// Boy.pathFinder.walkGrid(100, 100);
