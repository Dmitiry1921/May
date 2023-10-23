import {AnimationState, Mob, Point, SpriteAnimation} from "../../../../GameEngine";
import {sprites} from "../../../assets";
import {STATE} from "../../../common";

const {children} = sprites;

export const Girl = new Mob('Девочка'); // Девочка

// Girl.resize(32 * 8, 32 * 8);

const ANIMATION = {
	// WALK
	[STATE.WALK_BOTTOM]: new SpriteAnimation(children, [
		children.getTile(4, 4),
		children.getTile(3, 4),
		children.getTile(4, 4),
		children.getTile(5, 4),
	]),
	[STATE.WALK_LEFT]: new SpriteAnimation(children, [
		children.getTile(4, 5),
		children.getTile(3, 5),
		children.getTile(4, 5),
		children.getTile(5, 5),
	]),
	[STATE.WALK_RIGHT]: new SpriteAnimation(children, [
		children.getTile(4, 6),
		children.getTile(3, 6),
		children.getTile(4, 6),
		children.getTile(5, 6),
	]),
	[STATE.WALK_TOP]: new SpriteAnimation(children, [
		children.getTile(4, 7),
		children.getTile(3, 7),
		children.getTile(4, 7),
		children.getTile(5, 7),
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

// WALK
Girl.addAnimationState(STATES.WALK_TOP);
Girl.addAnimationState(STATES.WALK_LEFT);
Girl.addAnimationState(STATES.WALK_RIGHT);
Girl.addAnimationState(STATES.WALK_BOTTOM);

Girl.moveTo(new Point(13 * 32, 3 * 32));
Girl.setState(STATE.WALK_BOTTOM); // задаем начальное состояние



