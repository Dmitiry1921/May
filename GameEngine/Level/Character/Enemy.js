import {Character} from "./Character.js";
import {Rectangle} from "../../GameObject/index.js";

export class Enemy extends Character {
  constructor() {
		super(new Rectangle(0, 0, 32, 32));
		this.setType('Enemy');
	}
}
