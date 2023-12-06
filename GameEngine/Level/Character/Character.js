'use strict';

import {
	Point,
	Circle,
	Vector2,
	AutoWalk,
	Collider,
	Rectangle,
	PathFinder,
	GameObject,
	AnimationState,
	AnimationStateMachine, Level,
} from "../../../GameEngine";

/**
 * @extends GameObject
 */
export class Character extends GameObject {

	#type;
	#bound;
	#hitBox;
	#vision;
	#autoWalk;
	#velocity;
	#collider;
	#level;
	#pathFinder;
	#stateAnimation;
	#inputProcesses;
	#updateProcesses;
	#renderProcesses;

	constructor(rect) {
		super();
		if (!(rect instanceof Rectangle)) throw new TypeError('rect must be instance of Rectangle');
		this.#type = 'Character';
		this.#bound = new Rectangle(rect.x, rect.y, rect.width, rect.height); // по умолчанию
		this.#velocity = new Vector2(0, 0); // по умолчанию
		this.#vision = new Collider(this.#type, new Circle());
		this.#collider = new Collider(this.#type, new Rectangle());
		this.#pathFinder = new PathFinder(new Point(0, 0)); // Создаем болванку, все равно будет перезаписан в Level
		this.#autoWalk = new AutoWalk(this);
		this.#hitBox = new Collider(this.#type, new Circle()); // TODO поддержать
		this.#stateAnimation = new AnimationStateMachine();
		this.#updateProcesses = new Set();
		this.#inputProcesses = new Set();
		this.#renderProcesses = new Set();
		this.#level = null;

		this.#collider.setVelocity(this.#velocity);
		this.#vision.setVelocity(this.#velocity);
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

	get collider() {
		return this.#collider;
	}
	get vision() {
		return this.#vision;
	}

	get hitBox() {
		return this.#hitBox;
	}

	get pathFinder() {
		return this.#pathFinder;
	}

	get stateAnimation() {
		return this.#stateAnimation;
	}

	get autoWalk() {
		return this.#autoWalk;
	}

	setLevel(level) {
		if(!(level instanceof Level)) throw new TypeError('level must be instance of Level');
		this.#level = level;
		// сбрасываем коллайдер персонажа
		this.#collider.clear();
		this.#collider.addColliders([...this.#level.collider.colliders]);
	}

	setScale(value) {
		this.#bound.setScale(value);
		this.#stateAnimation.setScale(value);
	}

	setPathFinder(pathFinder) {
		if(!(pathFinder instanceof PathFinder)) throw new TypeError('pathFinder must be instance of PathFinder');
		this.#pathFinder = pathFinder;
	}

	hasCollider() {
		return this.#collider.hasCollider();
	}

	setType(type) {
		if (typeof type !== 'string') throw new TypeError('type must be string');
		this.#type = type;
		this.#collider.type = type;
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

	/**
	 * Перемещает персонажа на вектор его скорости;
	 */
	move() {
		this.#collider.moveBy(this.#velocity);
		this.#vision.moveBy(this.#velocity);
		this.#hitBox.moveBy(this.#velocity);
		this.#bound.moveBy(this.#velocity);
		this.#stateAnimation.moveBy(this.#velocity);
	}


	/**
	 * @param point {Point}
	 * @returns {Character}
	 */
	moveTo(point) {
		if (!(point instanceof Point)) throw new TypeError('point must be instance of Point');
		this.#collider.moveTo(point);
		this.#vision.moveTo(point);
		this.#hitBox.moveTo(point);
		this.#bound.moveTo(point);
		this.#stateAnimation.moveTo(point);

		return this;
	}

	/**
	 *
	 * @param vector2 {Vector2}
	 * @returns {Character}
	 */
	moveBy(vector2) {
		if (!(vector2 instanceof Vector2)) throw new TypeError('vector2 must be instance of Vector2');
		this.#collider.moveBy(vector2);
		this.#vision.moveBy(vector2);
		this.#hitBox.moveBy(vector2);
		this.#bound.moveBy(vector2);
		this.#stateAnimation.moveBy(vector2);

		return this;
	}

	resize(width, height) {
		this.#bound.resize(width, height);
		this.#stateAnimation.resize(width, height);
	}

	setState(stateName) {
		if (this.#stateAnimation)
			this.#stateAnimation.handleEvent(stateName);
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
		this.#autoWalk.processInput(deltaTime);
		this.#inputProcesses.forEach(func => func(deltaTime));
	}

	/**
	 * Обновление персонажа
	 * @param deltaTime
	 */
	update(deltaTime) {
		try {
			this.#collider.update(deltaTime);
			this.#vision.update(deltaTime);
			this.#stateAnimation.update(deltaTime);
			this.#updateProcesses.forEach(func => func(deltaTime));
		} catch (err) {
			console.info(this);
			throw err;
		}
	}

	render(canvasContext) {
		if (this.#stateAnimation.currentState === null) {
			console.warn(this.name, 'use setState() for draw Character', new Error().stack);
		}
		this.#stateAnimation.render(canvasContext);
		this.#hitBox.render(canvasContext);
		this.#collider.render(canvasContext);
		this.#vision.render(canvasContext);
		this.#renderProcesses.forEach(func => func(canvasContext));
	}

	addUpdateProcess(func) {
		if (typeof func !== 'function') throw new TypeError('func must be function');
		this.#updateProcesses.add(func);
	}

	addProcessInput(func) {
		if (typeof func !== 'function') throw new TypeError('func must be function');
		this.#inputProcesses.add(func);
	}

	addRenderProcess(func) {
		if (typeof func !== 'function') throw new TypeError('func must be function');
		this.#renderProcesses.add(func);
	}

	handleEvent(event) {
		this.#stateAnimation.handleEvent(event);
	}

	setDefaultState(state) {
		this.#stateAnimation.defaultState = state;
	}

	/**
	 * @returns {Collider}
	 */
	getCollider() {
		return this.#collider;
	}
}
