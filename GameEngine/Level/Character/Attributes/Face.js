'use strict';

import {Rectangle, Sprite} from "../../../GameObject";

export class Face extends Sprite {
	constructor(image, sourceRect) {
		if(!(image.resource instanceof Image)) throw new TypeError('param image must be instance of Image');
		if(!(sourceRect instanceof Rectangle)) throw new TypeError('param rect must be instance of Rectangle');
		super(image, sourceRect);

	}
}
