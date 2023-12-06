'use strict';

import mapData from "./mapData.json" assert {type: 'json'};

import {Level, Point} from "../../../GameEngine";
import {parseMap} from '../../common';
import {interfaceLayout, inventory, quest} from "../../interfaces";
import {
	Hero,
	Astof,
	Kirill,
	Creator,
	Yarik,
	Batman,
	SecurityGuard,
	Butterfly,
	Zombie,
	Cow,
	Cat,
	// Dog,
} from "../../characters";

const zombies = Zombie.createForEachPoint([
	{x: 15, y: 5},
	{x: 24, y: 12},
	{x: 35, y: 5},
	{x: 35, y: 14},
]);
const cows = Cow.createForEachPoint([
	{x: 7, y: 6},
	{x: 9, y: 7},
]);
const butterflyPink = Butterfly.createPinkOnPoint(17, 10);
const butterflyYellow = Butterfly.createYellowOnPoint(28, 3);
const cat = Cat.createOnPoint(28, 3);

const {
	layoutForward,
	layoutWalls,
	layoutBackground,
	layoutForward1,
	layoutBackward2,
	layoutBackward1
} = parseMap(mapData);

export const levelOne = new Level(
	layoutBackground,
	layoutBackward1,
	layoutBackward2,
	Level.charactersLayer(),
	layoutForward,
	layoutForward1,
	layoutWalls,
	interfaceLayout,
);

// levelOne.pathFinder.show();

levelOne.addCharacters(
	Hero,
	Astof,
	Kirill,
	Creator,
	Yarik,
	Batman,
	SecurityGuard,
	zombies,
	cows,
	butterflyPink,
	butterflyYellow,
	cat,
);


levelOne.pathFinder.resize(32, 4);
levelOne.setSortCharactersBeforeRender((a, b) => (a.bound.y + a.bound.height) - (b.bound.y + b.bound.height));

levelOne.addInitProcess(() => {
	Hero.moveTo(new Point(21 * 32, 14 * 32 + 10));
	Astof.setDefaultState(Astof.STATES.IDLE_LEFT);
	Astof.moveTo(new Point(22 * 32, 19 * 32 + 10))
	// TODO remove it;
	quest.set("");
	inventory.show();
	quest.show();
	quest.moveTo(new Point(inventory.point.x, inventory.point.y + inventory.height));
});




