'use strict';

import {sprites} from "../assets";
import {Progress} from "../classes/Progress.js";
import {Container, Point, Rectangle, Sprite, Text} from "../../GameEngine";
const {interfaceResources} = sprites;

export const healthPower= new class HealthPower extends Container {
	#rect;
	#text;
	#progress;
	#maxHealth;
	#background;
	#currentHealth;
	constructor() {
		super();
		this.#rect = new Rectangle(772, 48, 240, 11);
		this.#background = new Sprite(interfaceResources, this.#rect);
		this.#maxHealth = 5; // 5
		this.#currentHealth = 1; // 1
		this.#progress = new Progress(this.#currentHealth, this.#maxHealth, 2, 1, 206, 8);

		this.#text = new Text();
		this.#text.moveTo(new Point(0, 1));
		this.#text.fontSize = '9px'
		this.#text.fillStyle = '#fff';
		this.#text.textAlign = Text.ALIGN.CENTER;
		this.#text.resize(240, 11);

		this.addChild(this.#background);
		this.addChild(this.#progress);
		this.addChild(this.#text);

		// Перемещаем в правый верхний угол
		this.moveTo(new Point(0, 0));
	}

	get width() {
		return this.#rect.width;
	}
	get height() {
		return this.#rect.height;
	}

	get max() {
		return this.#progress.max;
	}
	get value() {
		return this.#progress.value;
	}
	set value(value) {
		this.#progress.value = value;
		this.#currentHealth = this.#progress.value;
	}
	set max(value) {
		this.#progress.max = value;
		this.#maxHealth = this.#progress.max;
	}

	update(deltaTime) {
		this.#text.text = `hp ${this.#currentHealth}/${this.#maxHealth}`;
		super.update(deltaTime);
	}

}
