'use strict';

import gameEngineConfig from "../../config/gameEngine.config.json" assert {type: "json"};
import {Container, Point, Rectangle, Sprite, Text} from "../../GameEngine";
import {sprites} from '../assets';

const {canvasWidth} = gameEngineConfig;
const {interfaceResources} = sprites;

class Quest extends Container {
	#text;
	#background;
	constructor() {
		super();
		this.#background = new Sprite(interfaceResources, new Rectangle(772, 30, 199, 18));
		this.#text = new Text();

		// правый верхний угол
		this.moveTo(new Point(canvasWidth - this.#background.width, 0));
		this.#text.moveTo(new Point(3, 2));

		this.addChild(this.#background);
		this.addChild(this.#text);
		this.hide();
	}

	set(text) {
		if(typeof text !== 'string') throw new TypeError('text must be string');
		this.#text.text = text;
		this.show();
	}
}

export const quest = new Quest();
