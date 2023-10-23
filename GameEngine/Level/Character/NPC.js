import {Character} from "./Character.js";
import {Face} from "./Attributes";
import {Rectangle} from "../../GameObject/index.js";

export class NPC extends Character {
	#name;
	#face;
  constructor(name) {
		super(new Rectangle(0, 0, 32, 32));
		this.#name = name;
		this.setType('NPC');
  }

	setFace(face) {
		if(!(face instanceof Face)) throw new TypeError('face must be instance of Face');
		this.addResources(face.resources);
		this.#face = face;
	}

	get name() {
		return this.#name;
	}
}
