'use strict';

import {STATE} from "./states.js";
import {Vector2} from "../../GameEngine";

export const ANIMATION_FRAMES = {
	// Idle
	[STATE.IDLE_BOTTOM]: [
		new Vector2(1, 0),
	],
	[STATE.IDLE_LEFT]: [
		new Vector2(1, 1),
	],
	[STATE.IDLE_RIGHT]: [
		new Vector2(1, 2)
	],
	[STATE.IDLE_TOP]: [
		new Vector2(1, 3)
	],
	// Walk
	[STATE.WALK_BOTTOM]: [
		new Vector2(1, 0),
		new Vector2(0, 0),
		new Vector2(1, 0),
		new Vector2(2, 0),
	],
	[STATE.WALK_LEFT]: [
		new Vector2(1, 1),
		new Vector2(0, 1),
		new Vector2(1, 1),
		new Vector2(2, 1),
	],
	[STATE.WALK_RIGHT]: [
		new Vector2(1, 2),
		new Vector2(0, 2),
		new Vector2(1, 2),
		new Vector2(2, 2),
	],
	[STATE.WALK_TOP]: [
		new Vector2(1, 3),
		new Vector2(0, 3),
		new Vector2(1, 3),
		new Vector2(2, 3),
	],
}
