'use strict';

/**
 * Reverses the keys and values of an object
 * @param inputObject {Object}
 * @return {Object} - reversed object
 */
export function reverse(inputObject) {
	return Object.fromEntries(Object.entries(inputObject).map(([key, value]) => [value, key]));
}