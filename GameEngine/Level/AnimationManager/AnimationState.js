'use strict';

import { SpriteAnimation } from "./SpriteAnimation.js";
import { State } from "../../GameLogic";

export class AnimationState extends State {
	constructor(name, animation, {enter, exit, handleEvent}) {
		super(name, {enter, exit, handleEvent});

		if(!(animation instanceof SpriteAnimation)) throw new TypeError('animation must be instance of SpriteAnimation');
		this.animation = animation;
	}

	resize(width, height) {
		this.animation.resize(width, height);
	}

	get resources() {
		return this.animation.resources;
	}
}
