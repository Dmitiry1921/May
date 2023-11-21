'use strict';

import {GameObject, Rectangle} from "../../GameEngine";

export class Text extends GameObject {
	#text;
	#rect;
	#fillStyle;
	#lineHeight;
	#font;
	#words;
	#localCanvasContext; //
	/**
	 * @type {Object[]}
	 */
	#lines;

	constructor(text = '') {
		super();
		this.text = text;
		this.#rect = new Rectangle(0, 0, 400, 300);
		this.#fillStyle = "#000";
		this.#lineHeight = 20;
		this.#font = 'bold 15px Arial';
		this.#localCanvasContext = null;
		this.#words = [];
		this.#lines = [];
	}

	#measureText(text) {
		if(this.#localCanvasContext === null) return;
		this.#localCanvasContext.save();
		this.#style(this.#localCanvasContext);
		const measureText = this.#localCanvasContext.measureText(text);
		this.#localCanvasContext.reset();
		return measureText;
	}

	get text() {
		return this.#text;
	}

	set text(value) {
		if (typeof value !== 'string') throw new Error('value must be a string');
		this.#words = value.split(' ');
		this.#text = value;
		this.#lines = [];
		this.#wrapText();
	}

	get x() {
		return this.#rect.x;
	}

	get y() {
		return this.#rect.y;
	}

	get width() {
		return this.#rect.width;
	}

	get height() {
		return this.#rect.height;
	}

	#wrapText() {
		if(!this.#localCanvasContext) return;
		if (this.#text === undefined) return
		let line = "";
		this.#words.forEach((word) => {
			const testLine = [line, word].join(' ').trim();
			const testWidth = this.#measureText(testLine).width;
			if (testWidth > this.width) {
				this.#lines.push({
					text: line,
					width: this.#measureText(line).width,
					height: this.#measureText(line).height,
				});
				line = "";
			} else {
				line = testLine;
			}
		});
		this.#lines.push({
			text: line,
			width: this.#measureText(line).width,
			height: this.#measureText(line).height,
		})
	}

	#style(context) {
		if(!context) return;
		context.font = this.#font;
		context.fillStyle = this.#fillStyle;
		context.textBaseline = 'top';
	}

	moveTo(point) {
		this.#rect.moveTo(point);
	}

	moveBy(vector) {
		this.#rect.moveBy(vector);
	}

	resize(width, height) {
		this.#rect.resize(width, height);
	}

	processInput() {
	}

	update(deltaTime) {
	}

	render(canvasContext) {
		if(!this.#localCanvasContext) {
			this.#localCanvasContext = canvasContext;
			this.text = this.#text; // инициализируем текст
			return;
		}
		// this.#rect.render(canvasContext);
		canvasContext.save();
		this.#lines.forEach((line, index) => {
			this.#style(canvasContext);
			canvasContext.fillText(line.text, Math.round(this.x), Math.round(this.y + (this.#lineHeight * index)));
		});
		canvasContext.restore();
	}

	hasCollider() {
	}

}
