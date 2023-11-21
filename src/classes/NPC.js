'use strict';

import {MobMicroTask} from "../../GameEngine";
import {Mob} from './Mob.js';
import {DEFAULT} from "../common";

export class NPC extends Mob {
	#name;
	#microTask;
  constructor(name, states) {
		super(name, states);
		this.#name = name;
		this.setType('NPC', );
		this.#microTask = null;

		this.setDefaultState(states.IDLE_BOTTOM);

		this.vision.resize(DEFAULT.VISION.radius);
		this.vision.delta.moveTo(DEFAULT.VISION.delta);
  }

	resetMicroTask() {
		this.#microTask = null;
	}

	setMicroTask(microTask) {
		if(!(microTask instanceof MobMicroTask)) throw new TypeError('microTask must be instance of MobMicroTask');
		this.#microTask = microTask;
	}

	runMicroTask(microtasksScope, context = {}) {
		if(this.#microTask === null) return;
		this.#microTask.run(microtasksScope, context);
		this.resetMicroTask(microtasksScope, context);
	}

	get name() {
		return this.#name;
	}
}
