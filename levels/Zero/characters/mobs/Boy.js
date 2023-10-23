'use strict';

import {Mob, AnimationState, SpriteAnimation, Point} from "../../../../GameEngine";
import {sprites} from "../../../assets";
import {STATE} from "../../../common";

const {children} = sprites;

export const Boy = new Mob('Мальчик'); // Мальчик

// Boy.resize(32 * 8, 32 * 8);

const ANIMATION = {
	[STATE.WALK_BOTTOM]: new SpriteAnimation(children, [
		children.getTile(4, 0),
		children.getTile(3, 0),
		children.getTile(4, 0),
		children.getTile(5, 0),
	]),
	[STATE.WALK_LEFT]: new SpriteAnimation(children, [
		children.getTile(4, 1),
		children.getTile(3, 1),
		children.getTile(4, 1),
		children.getTile(5, 1),
	]),
	[STATE.WALK_RIGHT]: new SpriteAnimation(children, [
		children.getTile(4, 2),
		children.getTile(3, 2),
		children.getTile(4, 2),
		children.getTile(5, 2),
	]),
	[STATE.WALK_TOP]: new SpriteAnimation(children, [
		children.getTile(4, 3),
		children.getTile(3, 3),
		children.getTile(4, 3),
		children.getTile(5, 3),
	]),
}

// TODO Вынести в отдельный файл для разных типов персонажей
const STATES = {
	[STATE.WALK_TOP]: new AnimationState(STATE.WALK_TOP, ANIMATION.WALK_TOP, {
		enter() {
			console.log(STATE.WALK_TOP, 'enter');
		},
		exit() {
			console.log(STATE.WALK_TOP, 'exit');
		},
		handleEvent(event) {
			switch (event) {
				case STATE.WALK_BOTTOM:
				case STATE.WALK_LEFT:
				case STATE.WALK_RIGHT:
					// Осуществляем переход в другое состояние
					this.setState(event);
					break;
			}
		},
	}),
	[STATE.WALK_BOTTOM]: new AnimationState(STATE.WALK_BOTTOM, ANIMATION.WALK_BOTTOM, {
		enter() {
			console.log(STATE.WALK_BOTTOM, 'enter');
		},
		exit() {
			console.log(STATE.WALK_BOTTOM, 'exit');
		},
		handleEvent(event) {
			switch (event) {
				case STATE.WALK_TOP:
				case STATE.WALK_LEFT:
				case STATE.WALK_RIGHT:
					// Осуществляем переход в другое состояние
					this.setState(event);
					break;
			}
		},
	}),
	[STATE.WALK_LEFT]: new AnimationState(STATE.WALK_LEFT, ANIMATION.WALK_LEFT, {
		enter() {
			console.log(STATE.WALK_LEFT, 'enter');
		},
		exit() {
			console.log(STATE.WALK_LEFT, 'exit');
		},
		handleEvent(event) {
			switch (event) {
				case STATE.WALK_TOP:
				case STATE.WALK_BOTTOM:
				case STATE.WALK_RIGHT:
					// Осуществляем переход в другое состояние
					this.setState(event);
					break;
			}
		},
	}),
	[STATE.WALK_RIGHT]: new AnimationState(STATE.WALK_RIGHT, ANIMATION.WALK_RIGHT, {
		enter() {
			console.log(STATE.WALK_RIGHT, 'enter');
		},
		exit() {
			console.log(STATE.WALK_RIGHT, 'exit');
		},
		handleEvent(event) {
			switch (event) {
				case STATE.WALK_TOP:
				case STATE.WALK_BOTTOM:
				case STATE.WALK_LEFT:
					// Осуществляем переход в другое состояние
					this.setState(event);
					break;
			}
		},
	}),
};

Boy.addAnimationState(STATES.WALK_TOP);
Boy.addAnimationState(STATES.WALK_LEFT);
Boy.addAnimationState(STATES.WALK_RIGHT);
Boy.addAnimationState(STATES.WALK_BOTTOM);
// Задаем позицию персонажа
Boy.moveTo(new Point(34 * 32, 12 * 32));
// Задаем начальное состояние
Boy.setState(STATE.WALK_BOTTOM);


// Для изменения состояния используем handleEvent
// Boy.handleEvent(STATE.WALK_TOP);
