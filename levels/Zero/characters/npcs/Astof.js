import {AnimationState, Face, NPC, Rectangle, SpriteAnimation, Point} from "../../../../GameEngine";
import {sprites} from "../../../assets";
import {STATE} from '../../../common';

const {nps0, face24} = sprites;

export const Astof = new NPC('Астоф'); // Астоф

// Astof.resize(32 * 8, 32 * 8);

const ANIMATION = {
	[STATE.IDLE_BOTTOM]: new SpriteAnimation(nps0, [
		nps0.getTile(7, 0),
	]),
}

const STATES = {
	[STATE.IDLE_BOTTOM]: new AnimationState(STATE.IDLE_BOTTOM, ANIMATION.IDLE_BOTTOM, {
		enter() {},
		exit() {},
		handleEvent(event) {},
	}),
}


Astof.addAnimationState(STATES.IDLE_BOTTOM);
Astof.setFace(new Face(face24, new Rectangle(0, 96, 96, 96)));
Astof.setState(STATE.IDLE_BOTTOM);
Astof.moveTo(new Point(5 * 32, 5 * 32));
