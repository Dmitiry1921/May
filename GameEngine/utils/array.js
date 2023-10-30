'use strict';

export function create2DArray(rows, columns, initialValue) {
	return Array(rows).fill().map(() => Array(columns).fill(initialValue));
}
