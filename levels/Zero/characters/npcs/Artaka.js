import {AnimationState, Face, NPC, Rectangle, SpriteAnimation, Point} from "../../../../GameEngine";
import {sprites} from "../../../assets";
import {STATE} from "../../../common";

const {nps1, face21} = sprites;

export const Artaka = new NPC('Артака'); // Артака

const ANIMATION = {
	[STATE.IDLE_BOTTOM]: new SpriteAnimation(nps1, [
		nps1.getTile(1, 0),
	]),
};

const STATES = {
	[STATE.IDLE_BOTTOM]: new AnimationState(STATE.IDLE_BOTTOM, ANIMATION.IDLE_BOTTOM, {
		enter() {
			console.log(STATE.IDLE_BOTTOM, 'enter');
		},
		exit() {
			console.log(STATE.IDLE_BOTTOM, 'exit');
		},
		handleEvent(event) {
			console.log(this.name, event);
		},
	}),
};

Artaka.addAnimationState(STATES.IDLE_BOTTOM);
Artaka.setFace(new Face(face21, new Rectangle(0, 96, 96, 96)));
Artaka.moveTo(new Point(24 * 32, 5 * 32));
Artaka.setState(STATE.IDLE_BOTTOM);
