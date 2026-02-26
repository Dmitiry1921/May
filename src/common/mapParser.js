'use strict';

import {LayerMap, Layer, SpriteAnimation, Point, Rectangle, Collider, COLLIDER_TYPE} from "../../GameEngine";
import {sprites, spritesConfiguration} from "../assets";

// const tileMap = {
// 	1: spritesConfiguration.main,
// 	2: spritesConfiguration.tiled,
// 	3: spritesConfiguration.building,
// 	11: spritesConfiguration.plane,
// };
// const tileResources = {
// 	1: sprites.main,
// 	2: sprites.tiled,
// 	3: sprites.building,
// 	11: sprites.plane,
// };

/**
 * @deprecated
 * @param mapData
 * @returns {{layoutWalls: Layer, layoutBackground: LayerMap, layoutForward1: LayerMap, layoutBackward1: LayerMap, layoutBackward2: LayerMap, layoutForward: LayerMap, layoutBackward3: LayerMap, layoutBackward4: LayerMap}}
 */
export function parseMap(mapData) {
	console.log('Map size: ', mapData.length, mapData[0].length);
	// Разделяем карту на слои для отрисовки
	const layoutBackground = new LayerMap();
	const layoutBackward1 = new LayerMap();
	const layoutBackward2 = new LayerMap();
	const layoutBackward3 = new LayerMap();
	const layoutBackward4 = new LayerMap();
	const layoutForward = new LayerMap();
	const layoutForward1 = new LayerMap();
	const layoutWalls = new Layer();

	mapData.forEach((xArr, x) => {
		xArr.forEach((yArr, y) => {
			yArr.forEach((item, index) => {
				if (item.tile === null && item.id === null) return;
				// if(parseInt(item.tile) !== 1) return;
				const resource = tileResources[item.tile];
				const properties = tileMap[item.tile][item.id];

				const animation = new SpriteAnimation(tileResources[item.tile], [
					resource.getTile(properties.x / resource.tileWidth, properties.y / resource.tileHeight),
				]);

				animation.moveTo(new Point(x * resource.tileWidth, y * resource.tileHeight));
				animation.resize(resource.tileWidth, resource.tileHeight);

				if (tileMap[item.tile][item.id].overlay) {
					if (!layoutForward.checkExist(x, y)) {
						layoutForward.addSpriteAnimation(x, y, animation);
					} else {
						layoutForward1.addSpriteAnimation(x, y, animation);
					}
					return;
				}
				if (tileMap[item.tile][item.id].walls) {
					tileMap[item.tile][item.id].walls.forEach((wallData) => {
						const rect = new Rectangle((x * resource.tileWidth) + wallData.x % resource.tileWidth, y * resource.tileHeight + wallData.y % resource.tileWidth, wallData.width, wallData.height);
						// rect.delta.moveTo();
						const wall = new Collider(COLLIDER_TYPE.WALL, rect);
						// wall.resize(wallData.width, wallData.height);
						layoutWalls.addChild(wall);
					})
				}
				if (index === 0) {
					layoutBackground.addSpriteAnimation(x, y, animation);
					return;
				}
				if (index === 1) {
					layoutBackward1.addSpriteAnimation(x, y, animation);
					return;
				}
				if (index === 2) {
					layoutBackward2.addSpriteAnimation(x, y, animation);
					return;
				}
				if (index === 3) {
					layoutBackward3.addSpriteAnimation(x, y, animation);
					return;
				}
				if (index === 4) {
					layoutBackward4.addSpriteAnimation(x, y, animation);
					return;
				}
				throw new Error(`unknown index ${index}`);
			});
		});
	});

	return {
		layoutBackground,
		layoutBackward1,
		layoutBackward2,
		layoutBackward3,
		layoutBackward4,
		layoutForward,
		layoutForward1,
		layoutWalls,
	};
}

export function parseTmxMap({map}) {
	const walls = new Layer();
	let result = {
		walls,
	};
	const {layer: layers, objectgroup, tileset, ...rest} = map;
	const sortedTileSets = tileset.sort((a, b) => b.firstGid - a.firstGid);

	layers.reduce((acc, layerData) => {
		const {data: xArr, name} = layerData;
		const layout = new LayerMap();
		xArr.forEach((yArr, y) => {
			yArr.forEach((tileGid, x) => {
				const tileSet = sortedTileSets.find((tileSet) => tileGid >= tileSet.firstGid);
				if (!tileSet) return;
				const tileId = tileGid - tileSet.firstGid;
				const resource = sprites[tileSet.name];
				const properties = spritesConfiguration[tileSet.name].tiles[tileId];
				const animation = new SpriteAnimation(resource, [
					resource.getTile(properties.x / resource.tileWidth, properties.y / resource.tileHeight),
				]);
				//
				animation.moveTo(new Point(x * resource.tileWidth, y * resource.tileHeight));
				animation.resize(resource.tileWidth, resource.tileHeight);
				// добавляем анимацию на слой
				layout.addSpriteAnimation(x, y, animation);

				properties.rigidBodies.forEach((rigidBody) => {
					const rect = new Rectangle((x * resource.tileWidth) + rigidBody.x % resource.tileWidth, y * resource.tileHeight + rigidBody.y % resource.tileWidth, rigidBody.width, rigidBody.height);
					// rect.delta.moveTo();
					const wall = new Collider(COLLIDER_TYPE.WALL, rect);
					// wall.resize(wallData.width, wallData.height);
					walls.addChild(wall);
				});
			});
		});

		acc[name] = layout;
		return acc;

	}, result);

	// // Создаем слои объектов
	return objectgroup.reduce((acc, layer) => {
		const layout = new LayerMap();
		const {object: objects, name} = layer;

		// TODO убрать
		// acc[name] = layout;
		// return acc;
		//
		objects.forEach((object) => {
			const {gid, x, y, width, height} = object;
			const tileSet = sortedTileSets.find((tileSet) => gid >= tileSet.firstGid);
			const index = gid - tileSet.firstGid;
			const resource = sprites[tileSet.name];
			const properties = spritesConfiguration[tileSet.name]?.tiles?.[index];
			if(!properties) {
				console.warn(`not found properties for gid: ${gid}`);
				return;
			}
			const animation = new SpriteAnimation(resource, [
				new Rectangle(properties.x, properties.y, properties.width, properties.height),
			]);
			//
			const point = new Point(x, y - height);
			animation.moveTo(point);
			animation.resize(width, height);
			// добавляем анимацию на слой
			layout.addSpriteAnimation(x, y, animation);
			properties.rigidBodies.forEach((rigidBody) => {
				const rect = new Rectangle(point.x + rigidBody.x, point.y + rigidBody.y, rigidBody.width, rigidBody.height);
				// rect.delta.moveTo();
				const wall = new Collider(COLLIDER_TYPE.WALL, rect);
				// wall.resize(wallData.width, wallData.height);
				walls.addChild(wall);
			})
		});
		acc[name] = layout;
		return acc;
	}, result);
}
