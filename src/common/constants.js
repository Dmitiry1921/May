'use strict';

import {Point} from "../../GameEngine"

export const COLLIDER_TYPE = {
	NPC: 'NPC',
	PLAYER: 'Player',
	WALL: 'Wall',
	PATH_FINDER: 'PathFinder',
};

export const DEFAULT = {
	// Коллизия для персонажей по умолчанию
	COLLISION_BOX: {
		// new Point((Character.bound.width - Character.collider.width) / 2, Character.bound.height - Character.collider.height)
		delta: new Point((32 - 10) / 2, 32 - 10),
		width: 10,
		height: 10,
	},
	VISION: {
		// радиус видимости
		radius: 40,
		// new Point(Character.bound.width / 2, Character.bound.height)
		delta: new Point(32 / 2, 32),
	},
}
