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

const PROJECT_PATH = path.join(__dirname, '../', 'TiledProject');
const config = {};

const rulesPath = 'rules.txt';
const watchedFormat = ['.tmx'];

function normalizeTileData(data) {
	return data;
}

async function parseTileSets(filename, tileSets) {
	if (tileSets === undefined || !tileSets?.length) return;
	const filePath = path.parse(filename);
	const tilePaths = tileSets.map((tile) => {
		const source = path.parse(tile.source);
		return path.join(
			PROJECT_PATH,
			filePath.dir,
			source.dir,
			[source.name, source.ext].join(''),
		);
	});

	await Promise.all(tilePaths.map(async pathToTileSets => {
		const tileSetPath = path.parse(pathToTileSets);
		const fileData = parser.parse((await readFile(pathToTileSets, 'utf8')));
		const {tileset, ...rest} = fileData;
		const imagePath = path.parse(tileset.image?.source || tileset?.tile?.image?.source || tileset?.tile?.[0]?.image?.source);
		const pathToSave = path.join(
			tileSetPath.dir,
			imagePath.dir,
			[tileset.name, '.json'].join(''),
		);
		await writeFile(pathToSave, JSON.stringify(normalizeTileData(fileData), null, 2));
	}));
}

async function syncProcess(filename) {
	const xmlData = await readFile(path.join(PROJECT_PATH, filename), 'utf8');
	const {map, tileset, ...rest} = parser.parse(xmlData);
	// Путь к сохранению файла
	const saveTo = ((map || tileset)?.editorsettings)?.export?.target;
	if (!config[filename] && !saveTo) {
		console.error(`No path in config to save this file: ${filename}`);
		return;
	}

	await parseTileSets(filename, map?.tileset);

	// Карта в формате tmx
	if (map) {
		map.layer = map.layer.map((layer) => {
			if (layer.data.encoding !== 'csv') {
				throw new Error('UNSUPPORTED_ENCODING_FORMAT');
			}
			layer.data = layer.data['#text'].split(',\n').map(row => row.split(',').map(id => parseInt(id, 10)));
			return layer;
		});
	}
	const date = new Date();

	await writeFile(path.join(__dirname, saveTo), JSON.stringify({
		tileset,
		map,
		...rest,
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
