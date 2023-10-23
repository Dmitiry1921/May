import {Face, NPC, Rectangle, SpriteAnimation, AnimationState, Point} from "../../../../GameEngine";
import {sprites} from "../../../assets";
import {STATE} from "../../../common";

const {nps0, face17} = sprites;

export const Hodgepodge = new NPC('Даздраперма'); // Даздраперма

const ANIMATION = {
	[STATE.IDLE_BOTTOM]: new SpriteAnimation(nps0, [
		nps0.getTile(4, 4),
	]),
};
const STATES = {
	[STATE.IDLE_BOTTOM]: new AnimationState(STATE.IDLE_BOTTOM, ANIMATION.IDLE_BOTTOM, {
		enter() {
		},
		exit() {
		},
		handleEvent(event) {
		},
	}),
};
Hodgepodge.setFace(new Face(face17, new Rectangle(0, 96, 96, 96)));
Hodgepodge.addAnimationState(STATES.IDLE_BOTTOM);
Hodgepodge.setState(STATE.IDLE_BOTTOM);
Hodgepodge.moveTo(new Point(16 * 32, 4 * 32));
