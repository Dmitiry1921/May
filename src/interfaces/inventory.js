'use strict';

import gameEngineConfig from "../../config/gameEngine.config.json" assert {type: "json"};

import {sprites} from "../assets";
import {Container, Point, Rectangle, Sprite} from "../../GameEngine";
const {interfaceResources} = sprites;

const {canvasWidth} = gameEngineConfig;

class Inventory extends Container {
	#background;
	#rect;
	constructor() {
		super();
		this.#rect = new Rectangle(772, 0, 199, 30);
		this.#background =  new Sprite(interfaceResources, this.#rect);

		this.addChild(this.#background);

		// Перемещаем в правый верхний угол
		this.moveTo(new Point(canvasWidth - this.#background.width, 0));
		this.hide();
	}

	get width() {
		return this.#rect.width;
	}
	get height() {
		return this.#rect.height;
	}

}

export const inventory = new Inventory();
