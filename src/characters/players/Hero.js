'use strict';

import {Vector2, InputManager, COLLIDER_TYPE} from "../../../GameEngine";
import {Player} from '../../classes';
import {sprites, KEYS, GameLogic} from "../../levels";

const {hero0} = sprites;

const states = GameLogic.getDefaultStates(hero0, new Vector2(6, 0));

export const Hero = new Player('Персонаж', states);

Hero.collider.handelType(COLLIDER_TYPE.WALL);
Hero.collider.handelType(COLLIDER_TYPE.NPC);

const speed = 64;
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
	GameLogic.playAnimationDependOnVelocity(Hero);
	GameLogic.turnToDirection(Hero);
	// Двигаем персонажа
	Hero.move();
});

// Hero.pathFinder.walkRadius(30)


