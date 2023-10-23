import {AnimationState, Face, NPC, Rectangle, SpriteAnimation, Point} from "../../../../GameEngine";
import {sprites} from "../../../assets";
import {STATE} from "../../../common";

const {nps0, face26} = sprites;

const ANIMATION = {
	[STATE.IDLE_BOTTOM]: new SpriteAnimation(nps0, [
		nps0.getTile(1, 0),
	]),
}

const STATES = {
	[STATE.IDLE_BOTTOM]: new AnimationState(STATE.IDLE_BOTTOM, ANIMATION.IDLE_BOTTOM, {
		enter() {
		},
		exit() {
		},
		handleEvent(event) {
		},
	}),
}

export const Vanessa = new NPC('Ванесса'); // Ванесса

// Vanessa.resize(32 * 8, 32 * 8);

Vanessa.addAnimationState(STATES.IDLE_BOTTOM);
Vanessa.setFace(new Face(face26, new Rectangle(0, 96, 96, 96)));
Vanessa.moveTo(new Point(21 * 32, 15 * 32));
Vanessa.setState(STATE.IDLE_BOTTOM);


