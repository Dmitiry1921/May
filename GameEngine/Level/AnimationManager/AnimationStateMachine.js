'use strict';

import {AnimationState, StateMachine} from "../../../GameEngine";

export class AnimationStateMachine extends StateMachine {
	/**
	 * Добавляет состояние
	 * @param animationState {State}
	 */
	addState(animationState) {
		if(!(animationState instanceof AnimationState)) throw new TypeError('state must be instance of AnimationState');
		super.addState(animationState);
	}

	get #currentAnimation() {
		if(this.currentState === null) return;
		return this.states.get(this.currentState).animation;
	}

	get size() {
		return this.states.size;
	}

	playAnimation() {
		this.#currentAnimation.play();
	}

	pauseAnimation() {
		this.#currentAnimation.pause();
	}

	stopAnimation() {
		this.#currentAnimation.stop();
	}

	update(deltaTime) {
		this.#currentAnimation.update(deltaTime);
	}

	bound() {
		return this.#currentAnimation.bound;
	}

	moveTo(point) {
		this.states.forEach(state => state.animation.moveTo(point))
	}

	moveBy(vector2) {
		this.states.forEach(state => state.animation.moveBy(vector2))
	}

	resize(width, height) {
		this.states.forEach(state => state.animation.resize(width, height))
	}

	render(canvasContext) {
		if(this.currentState === null) return;
		this.#currentAnimation.render(canvasContext);
	}
}
