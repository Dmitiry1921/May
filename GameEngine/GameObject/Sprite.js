'use strict';

import {Rectangle, GameObject, Point, ImageLoader} from "../../GameEngine";

export class Sprite extends GameObject {
	#visible;
	// отображение по горизонтали и вертикали
	#flip;
	// изображение
	#image;
	// прямоугольник на спрайт карте
	#sourceRectangle;
	// прямоугольник на canvas
	#destinationRectangle;
	constructor(image, sourceRect) {
		if (!(image instanceof ImageLoader)) throw new TypeError('param image must be instance of Image');
		if (!(sourceRect instanceof Rectangle)) throw new TypeError('param rect must be instance of Rectangle');

		super();
		this.#visible = true;
		// Отображение по горизонтали и вертикали
		this.#flip = new Point(1, 1);
		// Инициализируем спрайт
		this.init(image, sourceRect);
	}

	/**
	 * Возвращает прямоугольник на canvas
	 * @return {Rectangle} - координаты и размеры прямоугольника
	 */
	get bound() {
		return this.#destinationRectangle;
	}

	get y() {
		return this.#destinationRectangle.y;
	}

	get x() {
		return this.#destinationRectangle.x;
	}

	get width() {
		return this.#destinationRectangle.width;
	}

	get height() {
		return this.#destinationRectangle.height;
	}

	show() {
		this.#visible = true;
	}
	hide() {
		this.#visible = false;
	}
	init(image, sourceRect) {
		// Добавляем ресурс в игровой объект без этого его не смогут загрузить корректно
		this.addResource(image);
		// Задаем изображение
		this.#image = image.resource;
		// Задаем прямоугольник на спрайт карте
		this.#sourceRectangle = sourceRect;
		//  Задаем прямоугольник на canvas по умолчанию
		this.#destinationRectangle = new Rectangle(0, 0, sourceRect.width, sourceRect.height);
	}

	/**
	 * Отображение по горизонтали и вертикали
	 * @param string {string| undefined} - horizontal | vertical
	 */
	flip(string) {
		if(string === undefined) {
			this.#flip = new Point(1, 1);
		}
		switch (string) {
			case Sprite.FLIP_NONE:
				this.#flip = new Point(1, 1);
				break;
			case Sprite.FLIP_HORIZONTAL:
				this.#flip = new Point(-1, 1);
				this.#destinationRectangle.delta.moveTo(new Point(this.#destinationRectangle.delta.x + this.#destinationRectangle.width, this.#destinationRectangle.delta.y));
				break;
			case Sprite.FLIP_VERTICAL:
				this.#flip = new Point(1, -1);
				this.#destinationRectangle.delta.moveTo(new Point(this.#destinationRectangle.delta.x, this.#destinationRectangle.delta.y + this.#destinationRectangle.height));
				break;
			default:
				throw new Error('unknown flip');
		}
	}

	setScale(value) {
		this.#destinationRectangle.setScale(value);
	}

	/**
	 * Изменяет размер спрайта
	 * @param width
	 * @param height
	 */
	resize(width, height) {
		this.#destinationRectangle.resize(width, height);
	}

	processInput() {
	}
	update(deltaTime) {
	}
	hasCollider() {
	}

	render(canvasContext) {
		if(!this.#visible) return;
		canvasContext.save();
		canvasContext.translate(Math.round(this.#destinationRectangle.x), Math.round(this.#destinationRectangle.y))
		canvasContext.scale(this.#flip.x, this.#flip.y);
		canvasContext.drawImage(
			this.#image,
			this.#sourceRectangle.x,
			this.#sourceRectangle.y,
			this.#sourceRectangle.width,
			this.#sourceRectangle.height,
			0,
			0,
			this.#destinationRectangle.width,
			this.#destinationRectangle.height,
		);
		canvasContext.restore();
	}

	/**
	 * Перемещает спрайт в указанную точку
	 * @param point {Point} - точка
	 */
	moveTo(point) {
		this.#destinationRectangle.moveTo(point);
	}

	/**
	 * Перемещает спрайт на указанный вектор
	 * @param vector2
	 */
	moveBy(vector2) {
		this.#destinationRectangle.moveBy(vector2);
	}

	/**
	 * @returns {string}
	 */
	static get FLIP_NONE() {
		return 'none';
	}

	/**
	 * @returns {string}
	 */
	static get FLIP_HORIZONTAL() {
		return 'horizontal';
	}

	/**
	 * @returns {string}
	 */
	static get FLIP_VERTICAL() {
		return 'vertical';
	}
}
