'use strict';

import {fileURLToPath} from 'node:url';
import {watch, writeFile, readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {XMLParser} from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "",
});

const ROOT_PATH = path.join(__dirname, '../');
const PROJECT_PATH = path.join(__dirname, '../', 'TiledProject');
const config = {};

const rulesPath = 'levels/rules.txt';
const watchedFormat = ['.tmx'];

function asArray(data) {
	if(data === undefined) return [];
	return Array.isArray(data) ? data : [data];
}

function asRect(item) {
    return {
		...item,
		id: parseInt(item.id, 10),
		x: parseInt(item.x, 10),
		y: parseInt(item.y, 10),
		width: parseInt(item.width, 10),
		height: parseInt(item.height, 10),
	};
}

function normalizeTileData(data) {
	const {tileset} = data;
	// return data;
	const tileWidth = parseInt(tileset.tilewidth, 10);
	const tileHeight = parseInt(tileset.tileheight, 10);
	const columns = parseInt(tileset.columns, 10);
	return {
		...data.tileset,
		image: tileset.image || tileset?.tile?.image || tileset?.tile?.[0]?.image,
		tileCount: parseInt(tileset.tilecount, 10),
		tileWidth,
		tileHeight,
		columns,
		tilecount: undefined,
		tilewidth: undefined,
		tileheight: undefined,
		tiles: asArray(data.tileset.tile).map((tile) => {
			if((tile.x ?? tile.y ?? tile.width ?? tile.height) === undefined) {
				tile.x = (tile.id % columns) * tileWidth;
				tile.y = Math.floor(tile.id / columns) * tileHeight;
				tile.width = tileWidth;
				tile.height = tileHeight;
			}
			return {
				...asRect(tile),
				rigidBodies: asArray(tile.objectgroup?.object).map(asRect),
				objectgroup: undefined,
				image: undefined,
			}
		}),
		tile: undefined,
	};
}

async function parseTileSets(filename, tileSets, levelSaveToPath) {
	if (tileSets === undefined || !tileSets?.length) return;
	const filePath = path.parse(filename);
	return Promise.all(tileSets.map(async (tile) => {
		const source = path.parse(tile.source);
		const pathToTileSets = path.join(
			PROJECT_PATH,
			filePath.dir,
			source.dir,
			[source.name, source.ext].join(''),
		);
		const tileSetPath = path.parse(pathToTileSets);
		const fileData = parser.parse((await readFile(pathToTileSets, 'utf8')));
		const {tileset, ...rest} = fileData;
		const imagePath = path.parse(tileset.image?.source || tileset?.tile?.image?.source || tileset?.tile?.[0]?.image?.source);
		const pathToSave = path.join(
			tileSetPath.dir,
			imagePath.dir,
			[tileset.name, '.json'].join(''),
		);
		const {dir: sourceDir, ext: sourceExt} = path.parse(pathToSave);
		await writeFile(pathToSave, JSON.stringify(normalizeTileData(fileData), null, 2));
		return {
			...tile,
			name: tileset.name,
			firstGid: parseInt(tile.firstgid, 10),
			firstgid: undefined,
			source: path.join(sourceDir.replace(ROOT_PATH, ''), [tileset.name, sourceExt].join('')),
			image: path.join(sourceDir.replace(ROOT_PATH, ''), [tileset.name, imagePath.ext].join('')),
		}
	}));
}

async function syncProcess(filename) {
	const filePath = path.join(PROJECT_PATH, filename);
	const xmlData = await readFile(filePath, 'utf8');
	const parsedData = parser.parse(xmlData);
	const {map, ...rest} = parsedData;
	let {tileset} = parsedData;
	// Путь к сохранению файла
	let saveTo = ((map || tileset)?.editorsettings)?.export?.target;
	if (!config[filename] && !saveTo) {
		console.error(`No path in config to save this file: ${filename}`);
		return;
	}
	saveTo = path.join(__dirname, saveTo);

	// Парсим тайлсеты
	if(map?.tileset) {
		tileset = await parseTileSets(filename, map.tileset, saveTo);
	}

	// Карта в формате tmx
	if (map) {
		map.layer = map.layer.map((layer) => {
			if (layer.data.encoding !== 'csv') {
				throw new Error('UNSUPPORTED_ENCODING_FORMAT');
			}
			layer.data = layer.data['#text'].split(',\n').map(row => row.split(',').map(id => parseInt(id, 10)));
			return layer;
		});
		map.objectgroup = asArray(map.objectgroup).map((objGroup) => ({
			...objGroup,
			object: asArray(objGroup.object).map((obj) => ({
				...asRect(obj),
				gid: parseInt(obj.gid, 10),
			})),
		}));
	}



	const date = new Date();

	await writeFile(saveTo, JSON.stringify({
		...rest,
		map: {
			...map,
			tileset,
		},
	}, null, 2));

	console.log(filename, {
		saveTo, time: [
			date.getHours().toString().padStart(2, '0'),
			date.getMinutes().toString().padStart(2, '0'),
			date.getSeconds().toString().padStart(2, '0'),
		].join(':')
	});
}

(async () => {
	// Читаем файл правил чтобы исключить их из вотчера
	const rules = (await readFile(path.join(PROJECT_PATH, rulesPath), 'utf8'))
		.trim()
		.split('\n')
		.map(rulePath => path.parse(rulePath).base);
	const files = (await readdir(PROJECT_PATH, {recursive: true}))
		.filter(file => watchedFormat.includes(path.parse(file).ext))
		.filter(file => !rules.includes(path.parse(file).base));
	await Promise.all(files.map(async (file) => syncProcess(file)));

	try {
		const watcher = watch(PROJECT_PATH, {recursive: true});
		for await (const {filename, eventType} of watcher) {
			if (!watchedFormat.some(ext => filename.endsWith(ext))) continue;
			await syncProcess(filename);
		}
	} catch (err) {
		console.error(err);
		throw err;
	}
})();
