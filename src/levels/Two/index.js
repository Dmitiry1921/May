'use strict';

import mapData from "./mapData.json" assert {type: 'json'};

import {Level, Point} from "../../../GameEngine";
import {Astof, Butterfly, Cow, Hero, Zombie} from '../../characters';
import {parseMap} from '../../common';
import {interfaceLayout} from "../../interfaces";

const {
	layoutForward,
	layoutWalls,
	layoutBackground,
	layoutForward1,
	layoutBackward2,
	layoutBackward1,
	layoutBackward3,
	layoutBackward4
} = parseMap(mapData);

export const levelTwo = new Level(
	layoutBackground,
	layoutBackward1,
	layoutBackward2,
	layoutBackward3,
	layoutBackward4,
	Level.charactersLayer(),
	layoutForward,
	layoutForward1,
	layoutWalls,
	interfaceLayout,
);

const zombies = Zombie.createForEachPoint([
	{x: 4, y: 5},
	{x: 11, y: 7},
	{x: 19, y: 8},
	{x: 25, y: 9},
	{x: 5, y: 19},
	{x: 31, y: 16},
	{x: 29, y: 5},
]);
const cows = Cow.createForEachPoint([
	{x: 7, y: 14},
	{x: 8, y: 6},
	{x: 34, y: 14},
]);
const butterflyPink = Butterfly.createPinkOnPoint(14, 11);
const butterflyYellow = Butterfly.createYellowOnPoint(25, 17);

levelTwo.addCharacters(
	Hero,
	Astof,
	zombies,
	butterflyPink,
	butterflyYellow,
	cows,
);

levelTwo.pathFinder.resize(32, 2);
levelTwo.setSortCharactersBeforeRender((a, b) => (a.bound.y + a.bound.height) - (b.bound.y + b.bound.height));

Hero.moveTo(new Point(25 * 32, 19 * 32 + 10));
Astof.moveTo(new Point(27 * 32, 19 * 32 - 12));
Astof.setDefaultState(Astof.STATES.IDLE_BOTTOM);

