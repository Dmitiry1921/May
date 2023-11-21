'use strict';

import {Level, Point} from "../../../GameEngine";
import {Hero, Vanessa, Hodgepodge, Astof, Artaka, Boy, Girl, Her, Cow, Butterfly, Cat, Chicken} from '../../characters';
import {interfaceLayout} from '../../interfaces';
import {parseMap} from "../../common";
import mapData from "./mapData.json" assert {type: 'json'};

const {
	layoutForward,
	layoutWalls,
	layoutBackground,
	layoutForward1,
	layoutBackward2,
	layoutBackward1
} = parseMap(mapData);

// TODO есть что оптимизировать как минимум кол-во слоев как максимум не подвижные элементы имеет смысл объеденять в большие пачки
const levelZero = new Level(
	layoutBackground,
	layoutBackward1,
	layoutBackward2,
	Level.charactersLayer(),
	layoutForward,
	layoutForward1,
	layoutWalls,
	interfaceLayout,
);

levelZero.pathFinder.resize(32, 2);
// levelZero.pathFinder.show();

// Задаем сортировку отображения персонажей в зависимости от их координат и размера
levelZero.setSortCharactersBeforeRender((a, b) => (a.bound.y + a.bound.height) - (b.bound.y + b.bound.height));

const butterflyPink = Butterfly.createPinkOnPoint(28,1);
const butterflyYellow = Butterfly.createYellowOnPoint(17,10);
const cat = Cat.createOnPoint(37,10);
const cows = Cow.createForEachPoint([
	{x: 1, y: 11},
	{x: 4, y: 13},
]);
const chickens = Chicken.createForEachPoint([
	{x: 26, y: 16},
	{x: 27, y: 14},
	{x: 31, y: 18},
	{x: 25, y: 18},
	{x: 27, y: 18},
]);


// Добавляем персонажей на уровень
levelZero.addCharacters(
	Vanessa,
	Hodgepodge,
	Astof,
	Hero,
	Artaka,
	Boy,
	Girl,
	Her,
	cows,
	butterflyPink,
	butterflyYellow,
	cat,
	chickens);

Hero.moveTo(new Point(5 * 32, 3 * 32));
Hero.setState(Hero.STATES.IDLE_BOTTOM.name);
// Hero.moveTo(new Point(21 * 32, 19 * 32 + 10));

// Hero.moveTo(new Point(21 * 32, 13 * 32));
// Hero.resize(32 * 2, 32 * 2);

export {levelZero};
