'use strict';

import {Rectangle, ImageLoader} from "../../GameEngine";

export class Tile extends Rectangle {
	#tileId; // id плитки
	#resource; // ресурс id
	constructor(resource, id, x, y, width, height) {
		if(typeof id !== 'number') throw new TypeError('id must be number');
		if(!(resource instanceof ImageLoader)) throw new TypeError('resource must be ImageLoader');
		super(x, y, width, height);
		this.#tileId = resource.name;
		this.#resource = resource;
	}
}
