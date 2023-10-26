'use strict';

const logged = new Set();
const loggedInfo = new Set();
const loggedWarn = new Set();
const loggedErr = new Set();

export function logOnce(...args){
	const key = args.join('');
	if(logged.has(key)) return;
	logged.add(key);
	console.log(...args, new Error().stack);
}

logOnce.info = function (...args) {
	const key = args.join('');
	if(loggedInfo.has(key)) return;
	loggedInfo.add(key);
	console.info(...args, new Error().stack);
}

logOnce.warn = function (...args) {
	const key = args.join('');
	if(loggedWarn.has(key)) return;
	loggedWarn.add(key);
	console.warn(...args, new Error().stack);
}
logOnce.error = function (...args) {
	const key = args.join('');
	if(loggedErr.has(key)) return;
	loggedErr.add(key);
	console.error(...args, new Error().stack);
}
