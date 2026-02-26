'use strict';

import {Character, Layer} from "../../../GameEngine";

export class LayerCharacters extends Layer {

	addCharacter(character) {
		if(!(character instanceof Character)) throw new TypeError('character must be instance of Character')
		this.addResources(character.resources);
		this.addChild(character);
	}
}
