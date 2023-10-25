'use strict';

const logged = new Set();

export function logOnce(...args){
	const key = args.join('');
	if(logged.has(key)) return;
	logged.add(key);
	console.warn(...args, new Error().stack);
}
