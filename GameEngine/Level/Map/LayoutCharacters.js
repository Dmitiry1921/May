'use strict';

import {Character, Layout} from "../../../GameEngine";

export class LayoutCharacters extends Layout {

	addCharacter(character) {
		if(!(character instanceof Character)) throw new TypeError('character must be instance of Character')
		this.addResources(character.resources);
		this.addChild(character);
	}
}
