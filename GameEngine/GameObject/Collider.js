'use strict';

const Shapes = [
	'Circle',
	'Rectangle',
];

export class Collider {
	#shape;
	constructor(shape) {
		if(!Shapes.some(name => shape.constructor.name === name)) throw new TypeError(`shape must be instance of Shape [${Shapes.join(', ')}]`);
		this.#shape = shape;
	}

	get shape() {
		return this.#shape.constructor.name;
	}
	get x() {
		return this.#shape.x;
	}
	get y() {
		return this.#shape.y;
	}
	get width() {
		return this.#shape.width;
	}
	get height() {
		return this.#shape.height;
	}
	get rotation() {
		return this.#shape.rotation;
	}
	get visible() {
		return this.#shape.visible;
	}

	get delta() {
		return this.#shape.delta;
	}

	moveTo(point) {
		this.#shape.moveTo(point);
	}
	moveBy(vector2) {
		this.#shape.moveBy(vector2);
	}
	resize(width, height) {
		this.#shape.resize(width, height);
	}
	render(canvasContext) {
		this.#shape.render(canvasContext);
	}

	detectCollision(collider) {
		if(!(collider instanceof Collider)) throw new TypeError('collider must be instance of Collider');
		const collisionKey = [this.shape, '2', collider.shape];
		const collision = Collider[collisionKey.join('')] || Collider[collisionKey.reverse().join('')];
		if(typeof collision !== "function") throw new Error(`Collision method ${collisionKey.join(', ')} not implemented`);
		collision(this, collider);
	}

	static Circle2Circle(collider1, collider2) {
		const dx = collider1.x - collider2.x;
		const dy = collider1.y - collider2.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < collider1.width / 2 + collider2.width / 2;
	}

	static Rectangle2Rectangle(collider1, collider2) {
		return collider1.x < collider2.x + collider2.width &&
			collider1.x + collider1.width > collider2.x &&
			collider1.y < collider2.y + collider2.height &&
			collider1.y + collider1.height > collider2.y;
	}

	static Circle2Rectangle(collider1, collider2) {
		const circleDistanceX = Math.abs(collider1.x - collider2.x);
		const circleDistanceY = Math.abs(collider1.y - collider2.y);
		if (circleDistanceX > (collider2.width / 2 + collider1.width / 2)) { return false; }
		if (circleDistanceY > (collider2.height / 2 + collider1.width / 2)) { return false; }
		if (circleDistanceX <= (collider2.width / 2)) { return true; }
		if (circleDistanceY <= (collider2.height / 2)) { return true; }
		const cornerDistance_sq = (circleDistanceX - collider2.width / 2) ** 2 +
			(circleDistanceY - collider2.height / 2) ** 2;
		return (cornerDistance_sq <= (collider1.width / 2) ** 2);
	}
}
