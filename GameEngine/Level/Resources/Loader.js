export class Loader {
	resource;
	resourceId;
	loaded;
	constructor(element, url, id = null) {
		this.resource = new element();
		this.url = url;
		this.resourceId = id || url;
		this.loaded = false;
		// будет удален после загрузки

		return this;
	}

	load() {
		return new Promise((resolve, reject) => {
			this.resource.onload = () => {
				this.loaded = true;
				return resolve(this.resource);
			};
			this.resource.onerror = reject;
			this.resource.src = this.url;
			// Удаляем метод load, чтобы не было возможности повторно загрузить ресурс
			this.load = () => {
				console.error('Resource already loaded', new Error().stack);
			};
		});
	}

	static async all(urls) {};
}
