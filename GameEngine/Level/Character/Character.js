'use strict';

import {
	GameObject,
	Point,
	AnimationStateMachine,
	AnimationState,
	Vector2,
	Rectangle,
	Collider,
	Circle
} from "../../../GameEngine";

export class Character extends GameObject {

	#type;
	#bound;
	#hitBox;
	#velocity;
	#collisionBox;
	#inputProcesses;
	#stateAnimation;
	#updateProcesses;

	constructor(rect) {
		if (!(rect instanceof Rectangle)) throw new TypeError('rect must be instance of Rectangle');
		super();
		this.#type = 'Character';
		this.#bound = new Rectangle(rect.x, rect.y, rect.width, rect.height); // по умолчанию
		this.#velocity = new Vector2(0, 0); // по умолчанию
		this.#collisionBox = new Collider(this.#type, new Rectangle());
		this.#hitBox = new Collider(this.#type, new Circle()); // TODO поддержать
		this.#stateAnimation = new AnimationStateMachine();
		this.#updateProcesses = new Set();
		this.#inputProcesses = new Set();

		this.#collisionBox.setVelocity(this.#velocity);
		this.#hitBox.setVelocity(this.#velocity);
	}

	get type() {
		return this.#type;
	}

	get bound() {
		return this.#bound;
	}

	get velocity() {
		return this.#velocity;
	}

	get collisionBox() {
		return this.#collisionBox;
	}

	get hitBox() {
		return this.#hitBox;
	}

	hasCollider() {
		return this.#collisionBox.hasCollider();
	}

	setType(type) {
		if (typeof type !== 'string') throw new TypeError('type must be string');
		this.#type = type;
		this.#collisionBox.type = type;
		this.#hitBox.type = type;
	}

	/**
	 * Добавляет animationState в stateAnimationMachine
	 * @param animationState {AnimationState}
	 */
	addAnimationState(animationState) {
		if (!(animationState instanceof AnimationState)) throw new TypeError('animationState must be instance of AnimationState');
		this.addResources(animationState.resources);
		animationState.resize(this.#bound.width, this.#bound.height);
		this.#stateAnimation.addState(animationState);
		this.#bound.resize(animationState.animation.bound);
	}

	#getNextPosition() {
		this.#collisionBox.getNextPosition(this.#velocity);
		this.#hitBox.getNextPosition(this.#velocity);
		this.#bound.getNextPosition(this.#velocity);
		this.#stateAnimation.getNextPosition(this.#velocity);

		return this;
	}

	/**
	 * Перемещает персонажа на вектор его скорости;
	 */
	move() {
		this.#collisionBox.moveBy(this.#velocity);
		this.#hitBox.moveBy(this.#velocity);
		this.#bound.moveBy(this.#velocity);
		this.#stateAnimation.moveBy(this.#velocity);
	}

	moveTo(point) {
		if (!(point instanceof Point)) throw new TypeError('point must be instance of Point');
		this.#collisionBox.moveTo(point);
		this.#hitBox.moveTo(point);
		this.#bound.moveTo(point);
		this.#stateAnimation.moveTo(point);
	}

	moveBy(vector2) {
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		this.#collisionBox.moveBy(vector2);
		this.#hitBox.moveBy(vector2);
		this.#bound.moveBy(vector2);
		this.#stateAnimation.moveBy(vector2);
	}

	resize(width, height) {
		this.#bound.resize(width, height);
		this.#stateAnimation.resize(width, height);
	}

	setState(stateName) {
		if (this.#stateAnimation)
			this.#stateAnimation.setState(stateName);
	}

	playAnimation() {
		this.#stateAnimation.playAnimation();
	}

	pauseAnimation() {
		this.#stateAnimation.pauseAnimation();
	}

	stopAnimation() {
		this.#stateAnimation.stopAnimation();
	}


	/**
	 * Обработка ввода
	 */
	processInput(deltaTime) {
		this.#inputProcesses.forEach(func => func(deltaTime));
		this.#getNextPosition();
	}

	/**
	 * Обновление персонажа
	 * @param deltaTime
	 */
	update(deltaTime) {
		this.#collisionBox.update(deltaTime);
		this.#stateAnimation.update(deltaTime);
		this.#updateProcesses.forEach(func => func(deltaTime));
	}

	render(canvasContext) {
		if (this.#stateAnimation.currentState === null) {
			console.warn(this.name, 'use setState() for draw Character', new Error().stack);
		}
		this.#stateAnimation.render(canvasContext);
		this.#hitBox.render(canvasContext);
		this.#collisionBox.render(canvasContext);
	}

	addUpdateProcess(func) {
		if (typeof func !== 'function') throw new TypeError('func must be function');
		this.#updateProcesses.add(func);
	}

	addProcessInput(func) {
		if (typeof func !== 'function') throw new TypeError('func must be function');
		this.#inputProcesses.add(func);
	}

	handleEvent(event) {
		this.#stateAnimation.handleEvent(event);
	}
}
