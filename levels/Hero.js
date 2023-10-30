'use strict';

import { Player, Vector2, Point, InputManager} from "../GameEngine";
import {sprites, STATE, KEYS, COLLIDER_TYPE, GameLogic} from "../levels";

const {hero0} = sprites;

const ANIMATION = GameLogic.getAnimations(hero0, new Vector2(6, 0));
const STATES = GameLogic.getAnimationStates(ANIMATION);

export const Hero = new Player('Персонаж');

const speed = 64;

// Walk
Hero.addAnimationState(STATES.WALK_BOTTOM);
Hero.addAnimationState(STATES.WALK_TOP);
Hero.addAnimationState(STATES.WALK_LEFT);
Hero.addAnimationState(STATES.WALK_RIGHT);

Hero.setState(STATE.WALK_BOTTOM);

Hero.collider.resize(10, 10);
Hero.collider.delta.moveTo(new Point((Hero.bound.width - Hero.collider.width) / 2, Hero.bound.height - Hero.collider.height));

// Hero.setScale(8);

Hero.addProcessInput((deltaTime) => {
	// сбрасываем вектор скорости
	Hero.velocity.x = 0;
	Hero.velocity.y = 0;
	// Обработка нажатий клавиш
	if(InputManager.isPressed(KEYS.UP)) {
		Hero.velocity.add(new Vector2(0, -speed * deltaTime));
	}
	if(InputManager.isPressed(KEYS.DOWN)) {
		Hero.velocity.add(new Vector2(0, speed * deltaTime));
	}
	if(InputManager.isPressed(KEYS.LEFT)) {
		Hero.velocity.add(new Vector2(-speed * deltaTime, 0));
	}
	if(InputManager.isPressed(KEYS.RIGHT)) {
		Hero.velocity.add(new Vector2(speed * deltaTime, 0));
	}
})
Hero.addUpdateProcess(() => {
	// знак вектора скорости
	const velocitySign = Hero.velocity.sign();

	const availableDirections = Hero.collider.getAvailableDirections();
	// Если персонаж столкнулся со стеной, то
	if(Hero.collider.hasIntersectedInNextFrameWithType(COLLIDER_TYPE.WALL)) {
		const {x: projectX, y: projectY } = velocitySign.project();
		if(!availableDirections.has(projectX.toString())) {
			Hero.velocity.x = 0; // останавливаем персонажа по оси X
		}
		if(!availableDirections.has(projectY.toString())) {
			Hero.velocity.y = 0; // останавливаем персонажа по оси Y
		}
	}

	// Если персонаж не двигается, то останавливаем анимацию
	if(velocitySign.x === 0 && velocitySign.y === 0) {
		Hero.stopAnimation();
		// выходим если персонаж не двигается
		return;
	}
	// Задаем направление анимации в зависимости от вектора скорости
	if(velocitySign.y === 1) {
		// Идем вниз
		Hero.handleEvent(STATE.WALK_BOTTOM);
	}
	if(velocitySign.y === -1) {
		// Идем вверх
		Hero.handleEvent(STATE.WALK_TOP);
	}
	if(velocitySign.x === 1) {
		// Идем вправо
		Hero.handleEvent(STATE.WALK_RIGHT);
	}
	if(velocitySign.x === -1) {
		// Идем влево
		Hero.handleEvent(STATE.WALK_LEFT);
	}
	// Иначе воспроизводим анимацию
	Hero.playAnimation();

	// Двигаем персонажа
	Hero.move();
});

Hero.collider.handelType(COLLIDER_TYPE.WALL);
Hero.collider.handelType(COLLIDER_TYPE.NPC);

// Hero.pathFinder.walkRadius(30)


