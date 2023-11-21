'use strict';

import {Mob} from "./Mob.js";
import {DEFAULT} from "../common";

/**
 * @extends Mob
 */
export class Enemy extends Mob {
  constructor(name, states) {
		super(name, states);
		this.setType('Enemy');

		this.vision.resize(DEFAULT.VISION.radius);
		this.vision.delta.moveTo(DEFAULT.VISION.delta);
	}
}
