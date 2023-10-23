import {Loader} from "./Loader.js";

export class AudioLoader extends Loader {
	constructor(url) {
		super(Audio, url);
	}

	static async all(urls) {
		const uniqUrls = [...new Set(urls)]
		return Promise.all(uniqUrls.map(async url => new AudioLoader(url).load()));
	}
}
