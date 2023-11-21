'use strict';

import gameEngineConfig from '../../config/gameEngine.config.json' assert {type: "json"};

import {Point, Rectangle, Sprite, Face, Text, Container, InputManager} from "../../GameEngine";
import {sprites} from '../assets';
import {KEYS} from "../common";

const {interfaceResources} = sprites;
const {canvasWidth, canvasHeight} = gameEngineConfig;

export class Dialog extends Container {

	#textObject;
	#leftFace;
	#rightFace;
	#dialogData;
	#dialogIndex;
	#dialogBackground;
	#keyWasPressed;
	#finish;
	#isReady;

	constructor() {
		super();
		this.#textObject = new Text();
		this.#leftFace = null;
		this.#rightFace = null;
		this.#dialogData = [];
		this.#dialogIndex = 0;
		this.#isReady = false;
		this.#finish = null;
		this.#keyWasPressed = false;
		this.#dialogBackground = new Sprite(interfaceResources, new Rectangle(0, 0, 772, 97));

		this.hide();
		this.addChild(this.#dialogBackground);

		this.#textObject.moveTo(new Point(114, 11));
		this.#textObject.resize(544, 75);

		this.moveTo(new Point(
			canvasWidth / 2 - this.#dialogBackground.width / 2,
			canvasHeight - this.#dialogBackground.height,
		));

		this.addChild(this.#textObject);
	}

	get finish() {
		if(typeof this.#finish !== 'function') return () => {};
		const finish = this.#finish;
		this.#finish = null;
		return finish;
	}

	get currentPhrase() {
		return this.#dialogData[this.#dialogIndex];
	}

	#initCurrentPhrase() {
		if (this.#dialogData.length > 0) {
			this.setText(this.currentPhrase.text);
			if(this.currentPhrase.faceLeft) {
				this.setLeftFace(...this.currentPhrase.faceLeft);
			}
			if(this.currentPhrase.faceRight) {
				this.setRightFace(...this.currentPhrase.faceRight);
			}
		}
	}

	#dialogFinish() {
		this.#dialogIndex = 0;
		this.hide();
		this.finish();
		this.#isReady = false;
	}

	setLeftFace(image, rect, flip = Face.FLIP_NONE) {
		if (!(this.#leftFace instanceof Face)) {
			this.#leftFace = new Face(image, rect);
			this.addChild(this.#leftFace);
		}
		this.#leftFace.init(image, rect);
		this.#leftFace.resources.forEach(resource => resource.load());
		this.#leftFace.flip(flip);
	}

	setRightFace(image, rect, flip = Face.FLIP_NONE) {
		if (!(this.#rightFace instanceof Face)) {
			this.#rightFace = new Face(image, rect);
			this.addChild(this.#rightFace);
		}
		this.#rightFace.init(image, rect);
		this.#rightFace.moveTo(new Point(this.#dialogBackground.width - rect.width, 0));
		this.#rightFace.resources.forEach(resource => resource.load());
		this.#rightFace.flip(flip); // поворачиваем изображение если нужно
	}

	setText(text) {
		this.#textObject.text = text;
	}

	/**
	 * @param data
	 * @returns
	 */
	set(data) {
		if (!Array.isArray(data)) throw new TypeError('data must be array');
		if (this.#isReady) return;
		this.#isReady = true;
		this.#dialogIndex = 0;
		this.#dialogData = data;
		this.#initCurrentPhrase();
		this.show();
	}

	randomPhrase(arrayPhrases) {
		this.set([this.randomItemOfArray(arrayPhrases)])
	}

	/**
	 * Когда диалог закончится, то вызовется эта функция
	 * @param func
	 */
	then(func) {
		if(typeof func !== 'function') throw new TypeError('func must be a function');
		this.#finish = func;
	}

	processInput(deltaTime) {
		if (InputManager.isPressed(KEYS.ACTION)) {
			if (this.#keyWasPressed) return;
			this.#keyWasPressed = true;
			this.#dialogIndex++;
			if (this.#dialogIndex >= this.#dialogData.length) {
				this.#dialogFinish();
			}
		} else {
			this.#keyWasPressed = false;
		}

		this.#initCurrentPhrase();
	}

	static setFace(image, rect, flip) {
		return [image, rect, flip];
	}
}

export const dialog = new Dialog();
