'use strict';

import { Level, Point } from "../../GameEngine";
import {Hero} from '../Hero.js';
import {Vanessa, Hodgepodge, Astof, Artaka, Boy, Girl} from './characters';
import {layoutForward1, layoutBackground, layoutBackward1, layoutForward, layoutBackward2, layoutWalls} from './map';

// Скрываем слой стен
layoutWalls.hide();

// TODO есть что оптимизировать
const levelZero = new Level(
	layoutBackground,
	layoutBackward1,
	layoutBackward2,
	Level.charactersLayer(),
	layoutForward,
	layoutForward1,
	layoutWalls,
);

// Задаем сортировку отображения персонажей в зависимости от их координат и размера
levelZero.setSortCharactersBeforeRender((a, b) => (a.bound.y + a.bound.height) - (b.bound.y + b.bound.height));

// Добавляем персонажей на уровень
levelZero.addCharacter(Vanessa);
levelZero.addCharacter(Hodgepodge);
levelZero.addCharacter(Astof);
levelZero.addCharacter(Hero);
levelZero.addCharacter(Artaka);
levelZero.addCharacter(Boy);
levelZero.addCharacter(Girl);

// TODO раскоментить для финальной версии
// Hero.moveTo(new Point(5 * 32, 3 * 32));

Hero.moveTo(new Point(21 * 32, 13 * 32));

// Hero.resize(32 * 2, 32 * 2);

console.log('before loaders')
console.log(levelZero);
levelZero.init()
	.then(() => {
		console.log('after loaders', levelZero);
	})
	.catch((err) => {
		console.error('error after loaders', err);
	});

export {levelZero};
