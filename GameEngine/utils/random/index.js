'use strict';

/**
 * Возвращает случайное целое число в диапазоне от min до max
 * @param min {Number} - минимальное значение
 * @param max {Number} - максимальное значение
 * @return {Number} - случайное целое число
 */
export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


