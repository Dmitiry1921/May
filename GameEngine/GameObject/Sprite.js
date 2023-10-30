'use strict';

import {Rectangle, GameObject, Point, ImageLoader} from "../../GameEngine";

export class Sprite extends GameObject {
	#image;
	// прямоугольник на спрайт карте
	#sourceRectangle;
	// прямоугольник на canvas
	#destinationRectangle;
	constructor(image, sourceRect) {
		if (!(image instanceof ImageLoader)) throw new TypeError('param image must be instance of Image');
		if (!(sourceRect instanceof Rectangle)) throw new TypeError('param rect must be instance of Rectangle');

		super();
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
	 * Возвращает прямоугольник на canvas
	 * @return {Rectangle} - координаты и размеры прямоугольника
	 */
	get bound() {
		return this.#destinationRectangle;
	}

	get y() {
		return this.#destinationRectangle.y;
	}

	get width() {
		return this.#destinationRectangle.width;
	}

	get height() {
		return this.#destinationRectangle.height;
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


	render(canvasContext) {
		canvasContext.drawImage(
			this.#image,
			Math.round(this.#sourceRectangle.x),
			Math.round(this.#sourceRectangle.y),
			Math.round(this.#sourceRectangle.width),
			Math.round(this.#sourceRectangle.height),
			Math.round(this.#destinationRectangle.x),
			Math.round(this.#destinationRectangle.y),
			Math.round(this.#destinationRectangle.width),
			Math.round(this.#destinationRectangle.height)
		);
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
}
