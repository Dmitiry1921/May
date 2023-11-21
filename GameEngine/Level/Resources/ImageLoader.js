'use strict';

import {Loader, Point, Tile} from "../../../GameEngine";

export class ImageLoader extends Loader {

	#tiles;
	#tileWidth;
	#tileHeight;
	#usedTiles;
	#tileIndex;
	#usedTilesByIndex;

	/**
	 * Загружает изображение
	 * @param url {string} - путь к изображению
	 * @param [options] {object} - опции
	 * @param [options.tileWidth] {number} - ширина плитки
	 * @param[ options.tileHeight] {number} - высота плитки
	 */
  constructor(url, options = {})  {
		super(Image, url);
		this.#usedTiles = new Map();
		this.#usedTilesByIndex = new Map();
		this.#tileIndex = 0;
		this.#tiles = [[]];
		const {tileWidth, tileHeight} = options;
		if(tileWidth && tileHeight) {
			if((typeof tileWidth !== 'number'  || typeof tileHeight !== 'number')) throw new TypeError('tileHeight must be number');
			this.#tileWidth = tileWidth;
			this.#tileHeight = tileHeight;
		}
  }

	get tileWidth() {
		return this.#tileWidth;
	}
	get tileHeight() {
		return this.#tileHeight;
	}

	/**
	 * Загружает переданный ресурсы и возвращает Promise
	 * @param urls {string[]} - массив путей к ресурсам
	 * @return {Promise<Image[]>} - массив изображений
	 */
	static async all(urls) {
		const uniqUrls = [...new Set(urls)];
		return Promise.all(uniqUrls.map(async url => new ImageLoader(url).load()));
	}

	/**
	 * Разбивает изображение на плитки
	 * @param [tileWidth] - ширина плитки
	 * @param [tileHeight] - высота плитки
	 */
	sliceIntoTiles(tileWidth, tileHeight) {
		if(tileWidth && tileHeight) {
			if (typeof tileWidth !== 'number') throw new TypeError('tileWidth must be number');
			if (typeof tileHeight !== 'number') throw new TypeError('tileHeight must be number');
		}
		const width = tileWidth || this.#tileWidth;
		const height = tileHeight || this.#tileHeight;
		if(typeof width !== 'number' || typeof height !== 'number') return;
		if(width < 0 || height < 0) throw new RangeError('tileWidth and tileHeight must be greater than or equal to 0');

		for (let x = 0; x < this.resource.width / width; x++) {
			for (let y = 0; y < this.resource.height / height; y++) {
				const point = new Point(x, y);
				if(!this.#tiles[x]) {
					this.#tiles.push([]);
				}
				const rect = !this.#usedTiles.has(point.toString())
					? new Tile(this, this.#tileIndex)
					: this.#usedTiles.get(point.toString());
				this.#tileIndex++;
				rect.resize(width, height);
				rect.moveTo(new Point(x * width, y * height));
				this.#tiles[x][y] = rect;
			}
		}
	}

	/**
	 * Возвращает прямоугольник на спрайт карте не дожидаясь загрузки изображения
	 * @param x {number} - координата x на спрайт карте
	 * @param y {number} - координата y на спрайт карте
	 */
	getTile(x, y) {
		if(typeof x !== "number" || typeof y !== "number") throw new TypeError('x and y must be number');
		if(x < 0 || y < 0) throw new RangeError('x and y must be greater than or equal to 0');
		const point = new Point(x, y);
		// Если прямоугольник уже был создан, то возвращаем его
		if(this.#usedTiles.has(point.toString())) {
			return this.#usedTiles.get(point.toString());
		}
		const rect = this.#tiles?.[x]?.[y] || new Tile(this, this.#tileIndex, x, y);
		this.#tileIndex++;
		this.#usedTiles.set(point.toString(), rect);
		return rect;
	}

	async load() {
		const result = await super.load();
		this.sliceIntoTiles();
		return result;
	}
}
