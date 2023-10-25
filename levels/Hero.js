'use strict';

import {AnimationState, Rectangle, Player, SpriteAnimation, Vector2, InputManager} from "../GameEngine";
import {sprites, STATE, KEYS} from "../levels";

const {hero0} = sprites;
const ANIMATION = {
	// Walk
	[STATE.WALK_BOTTOM]: new SpriteAnimation(hero0, [
		hero0.getTile(7, 0),
		hero0.getTile(6, 0),
		hero0.getTile(7, 0),
		hero0.getTile(8, 0),
	]),
	[STATE.WALK_LEFT]: new SpriteAnimation(hero0, [
		hero0.getTile(7, 1),
		hero0.getTile(6, 1),
		hero0.getTile(7, 1),
		hero0.getTile(8, 1),
	]),
	[STATE.WALK_RIGHT]: new SpriteAnimation(hero0, [
		hero0.getTile(7, 2),
		hero0.getTile(6, 2),
		hero0.getTile(7, 2),
		hero0.getTile(8, 2),
	]),
	[STATE.WALK_TOP]: new SpriteAnimation(hero0, [
		hero0.getTile(7, 3),
		hero0.getTile(6, 3),
		hero0.getTile(7, 3),
		hero0.getTile(8, 3),
	]),
};

const STATES = {
	// Walk
	[STATE.WALK_TOP]: new AnimationState(STATE.WALK_TOP, ANIMATION.WALK_TOP, {
		enter() {
			// console.log(STATE.WALK_TOP, 'enter');
		},
		exit() {
			// console.log(STATE.WALK_TOP, 'exit');
		},
		handleEvent(event) {
			switch (event) {
				case STATE.WALK_BOTTOM:
				case STATE.WALK_LEFT:
				case STATE.WALK_RIGHT:
					Hero.setState(event);
					break;
			}
		},
	}),
	[STATE.WALK_LEFT]: new AnimationState(STATE.WALK_LEFT, ANIMATION.WALK_LEFT, {
		enter() {
			// console.log(STATE.WALK_LEFT, 'enter');
		},
		exit() {
			// console.log(STATE.WALK_LEFT, 'exit');
		},
		handleEvent(event) {
			switch (event) {
				case STATE.WALK_TOP:
				case STATE.WALK_BOTTOM:
				case STATE.WALK_RIGHT:
					Hero.setState(event);
					break;
			}
		},
	}),
	[STATE.WALK_RIGHT]: new AnimationState(STATE.WALK_RIGHT, ANIMATION.WALK_RIGHT, {
		enter() {
			// console.log(STATE.WALK_RIGHT, 'enter');
		},
		exit() {
			// console.log(STATE.WALK_RIGHT, 'exit');
		},
		handleEvent(event) {
			switch (event) {
				case STATE.WALK_TOP:
				case STATE.WALK_LEFT:
				case STATE.WALK_BOTTOM:
					Hero.setState(event);
					break;
			}
		},
	}),
	[STATE.WALK_BOTTOM]: new AnimationState(STATE.WALK_BOTTOM, ANIMATION.WALK_BOTTOM, {
		enter() {
			// console.log(STATE.WALK_BOTTOM, 'enter');
		},
		exit() {
			// console.log(STATE.WALK_BOTTOM, 'exit');
		},
		handleEvent(event) {
			switch (event) {
				case STATE.WALK_TOP:
				case STATE.WALK_LEFT:
				case STATE.WALK_RIGHT:
					Hero.setState(event);
					break;
			}
		},
	}),
};

export const Hero = new Player('Персонаж');

const speed = 3;

// Walk
Hero.addAnimationState(STATES.WALK_BOTTOM);
Hero.addAnimationState(STATES.WALK_TOP);
Hero.addAnimationState(STATES.WALK_LEFT);
Hero.addAnimationState(STATES.WALK_RIGHT);

Hero.setState(STATE.WALK_BOTTOM);

const collisionRect = {
	width: 10,
	height: 10,
};
const collisionBox = new Rectangle((Hero.bound.width - collisionRect.width) / 2, Hero.bound.height - (collisionRect.height), collisionRect.width, collisionRect.height);
Hero.collisionBox.resize(collisionBox.width, collisionBox.height);
Hero.collisionBox.delta.moveTo(collisionBox.point);

// Hero.resize(32 * 8, 32 * 8);

Hero.addProcessInput(() => {
	// сбрасываем вектор скорости
	Hero.velocity.x = 0;
	Hero.velocity.y = 0;
	// Обработка нажатий клавиш
	if(InputManager.isPressed(KEYS.UP)) {
		Hero.velocity.add(new Vector2(0, -speed));
	}
	if(InputManager.isPressed(KEYS.DOWN)) {
		Hero.velocity.add(new Vector2(0, speed));
	}
	if(InputManager.isPressed(KEYS.LEFT)) {
		Hero.velocity.add(new Vector2(-speed, 0));
	}
	if(InputManager.isPressed(KEYS.RIGHT)) {
		Hero.velocity.add(new Vector2(speed, 0));
	}
})
Hero.addUpdateProcess(() => {
	// знак вектора скорости
	const velocitySign = Hero.velocity.sign();

	const availableDirections = Hero.collisionBox.getAvailableDirections();
	// Если персонаж столкнулся со стеной, то
	if(Hero.collisionBox.hasIntersectedInNextFrameWithType('wall')) {
		const {x: projectX, y: projectY } = velocitySign.project();
		console.log(availableDirections);
		if(!availableDirections.has(projectX.toString())) {
			console.log('projectX', projectX.toString());
			Hero.velocity.x = 0; // останавливаем персонажа по оси X
		}
		if(!availableDirections.has(projectY.toString())) {
			console.log('projectY', projectY.toString());
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

Hero.collisionBox.handelType('wall');

