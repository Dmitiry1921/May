'use strict';

const TRANSFORM = {
	object: {
		from: 'object',
		to: 'objects',
	},
	tile: {
		from: 'tile',
		to: 'tiles',
	},
}

function parseNode(node) {
	return [...node.attributes].reduce((acc, attr) => {
		acc[attr.name] = attr.value;
		return acc;
	}, {});
}

function parseAsArray(parent, tagName) {
	return Array.from(parent.getElementsByTagName(tagName))
}

function object2xml(tagName, object) {
	const empty = () => ''
	empty.open = empty;
	empty.close = empty;
	empty.single = empty;

	if(object === undefined) return empty;

		const objString  = () => [
		tagName,
		Object.entries(object)
			.filter(([, value]) => typeof value !== 'object')
			.map(([key, value]) => `${key}="${value}"`).join(' '),
	].join(' ');
	const f = () => `<${objString()}/>`;
	f.open = () => `<${objString()}>`;
	f.close = () => `</${tagName}>`;
	f.single = () => f();

	return f;
}

object2xml.root = () => {
	return `<?xml version="1.0" encoding="UTF-8"?>`;
}


export function tsx2json(xmlData) {
	let parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xmlData, "text/xml");
	const tileset = xmlDoc.childNodes[0];

	return {
		tileset: {
			...parseNode(tileset),
			grid: parseNode(tileset.getElementsByTagName('grid')[0]),
			[TRANSFORM.tile.to]: parseAsArray(tileset, [TRANSFORM.tile.from]).reduce((acc, tile) => {
				acc[tile.id] = {
					...parseNode(tile),
					image: parseNode(tile.getElementsByTagName('image')[0]),
					objectgroup: {
						...parseNode(tile.getElementsByTagName('objectgroup')[0]),
						[TRANSFORM.object.to]: parseAsArray(tile, TRANSFORM.object.from).reduce((acc, object) => {
							acc[object.id] = {
								...parseNode(object),
							};
							return acc;
						}, []),
					},
				};
				return acc;
			}, []),
		},
	};
}

export function json2tsx(jsonData) {
	const tileSet = object2xml('tileset', jsonData.tileset);
	return [
		object2xml.root(),
		tileSet.open(),
		object2xml('image', jsonData.tileset?.image)(),
		object2xml('grid', jsonData.tileset.grid)(),
		...jsonData.tileset.tiles.map(tile => [
			object2xml('tile', tile).open(),
			object2xml('image', tile.image)(),
			object2xml('objectgroup', tile.objectgroup).open(),
			...tile.objectgroup.objects.map(object => object2xml('object', object).single()),
			object2xml('objectgroup', tile.objectgroup).close(),
			object2xml('tile', tile).close()
		].join('\n').replace('\n\n', '\n')),
		tileSet.close(),
	].join('\n').replace('\n\n', '\n');
}
