'use strict';

import mapData from "./mapData.json" assert {type: 'json'};

import {Level, Point} from "../../../GameEngine";
import {Astof, Butterfly, Hero, Zombie, Cow, Creator, Batman} from '../../characters';
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

export const levelTree = new Level(
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
	{x: 19, y: 8},
	{x: 26, y: 4},
	{x: 35, y: 7},
	{x: 20, y: 10},
	{x: 16, y: 10},
	{x: 15, y: 10},
	{x: 32, y: 15},
	{x: 30, y: 16},
	{x: 34, y: 17},
	{x: 18, y: 19},
	{x: 20, y: 18},
	{x: 21, y: 16},
	{x: 25, y: 16},
	{x: 34, y: 13},
]);

const butterflyPink = Butterfly.createPinkOnPoint(3, 9);
const butterflyYellow = Butterfly.createYellowOnPoint(7,7);
const cow = Cow.createOnPoint(10,5);

levelTree.addCharacters(
	zombies,
	Creator,
	Astof,
	Hero,
	Batman,
	butterflyYellow,
	butterflyPink,
	cow
);

levelTree.pathFinder.resize(32, 2);
levelTree.setSortCharactersBeforeRender((a, b) => (a.bound.y + a.bound.height) - (b.bound.y + b.bound.height));

Hero.moveTo(new Point(5 * 32, 13 * 32 + 10));
Astof.moveTo(new Point(6 * 32 + 16,13 * 32));
Astof.setDefaultState(Astof.STATES.IDLE_TOP);
Creator.moveTo(new Point(12 * 32, 7 * 32 + 10));
Batman.moveTo(new Point(32 * 32, 8 * 32));

