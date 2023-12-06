'use strict';

import {GameObject, Rectangle} from "../../GameEngine";

export class Text extends GameObject {
	#text;
	#textAlign;
	#rect;
	#visible;
	#fillStyle;
	#lineHeight;
	#font;
	#fontSize;
	#fontFamily;
	#fontStyle;
	#words;
	#localCanvasContext; //
	/**
	 * @type {Object[]}
	 */
	#lines;

	constructor(options = {
		rect: new Rectangle(0, 0, 100, 100),
		text: '',
	}) {
		super();
		if(typeof options !== 'object') throw new TypeError('param must be a Object');
		const {text, rect, textAlign, fontSize} = options;
		this.text = text;
		this.rect = rect;
		this.#fillStyle = '#000';
		this.#lineHeight = 20;
		this.textAlign = textAlign || Text.ALIGN.LEFT;
		this.fontSize = fontSize || '15px';
		this.#fontFamily = 'Arial';
		this.#fontStyle = 'bold';
		this.#localCanvasContext = null;
		this.#visible = true;
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

	get bound() {
		return this.#rect;
	}

	set rect(value) {
		if(!(value instanceof Rectangle)) throw new TypeError('value must be a Rectangle');
		this.#rect = value;
	}

	get text() {
		return this.#text;
	}

	get fillStyle() {
		return this.#fillStyle;
	}

	get fontSize() {
		return this.#fontSize;
	}

	set fontSize(value) {
		this.#fontSize = value;
	}

	set fillStyle(value) {
		this.#fillStyle = value;
	}

	set text(value) {
		if (typeof value !== 'string') throw new Error('value must be a string');
		this.#words = value.split(' ');
		this.#text = value;
		this.#lines = [];
		this.#wrapText();
	}

	set textAlign(value) {
		const availableValue = Object.values(Text.ALIGN);
		if(!availableValue.includes(value)) throw Error(`textAlign unavailable value use Text.ALIGN or (${availableValue.join(', ')})`);

		this.#textAlign = value;
	}

	get textAlign() {
		return this.#textAlign;
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
		context.textAlign = this.#textAlign;
		context.fillStyle = this.#fillStyle;
		context.textBaseline = 'top';
	}

	show() {
		this.#visible = true;
	}

	hide() {
		this.#visible = false;
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
		this.#font = `${this.#fontStyle} ${this.#fontSize} ${this.#fontFamily}`;
	}

	render(canvasContext) {
		if(!this.#visible) return;
		if(!this.#localCanvasContext) {
			this.#localCanvasContext = canvasContext;
			this.text = this.#text; // инициализируем текст
			return;
		}
		// this.#rect.render(canvasContext);
		canvasContext.save();
		this.#style(canvasContext);
		this.#lines.forEach((line, index) => {
			let x = 0;
			switch (this.#textAlign) {
				case Text.ALIGN.CENTER:
					x = this.width / 2 - line.width / 2;
					break;
				case Text.ALIGN.RIGHT:
					x = this.width - line.width;
					break;
				case Text.ALIGN.LEFT:
					x = 0;
					break;
			}
			canvasContext.fillText(line.text, Math.round(this.x + x), Math.round(this.y + (this.#lineHeight * index)));
		});
		canvasContext.restore();
	}

	hasCollider() {
	}

	/**
	 * Доступные ориентации текста
	 * @returns {{CENTER: string<'center'>, LEFT: string<'left'>, RIGHT: string<'right'>}}
	 * @constructor
	 */
	static get ALIGN() {
		return {
			CENTER: 'center',
			RIGHT: 'right',
			LEFT: 'left',
		}
	}
}
