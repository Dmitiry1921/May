'use strict';

import {LayoutMap, Layout, SpriteAnimation, Point, Rectangle, Collider} from "../../GameEngine";
import {COLLIDER_TYPE} from "./constants.js";
import {sprites, spritesConfiguration} from "../assets";

const tileMap = {
	1: spritesConfiguration.main,
	2: spritesConfiguration.tiled,
	3: spritesConfiguration.building,
	11: spritesConfiguration.plane,
};
const tileResources = {
	1: sprites.main,
	2: sprites.tiled,
	3: sprites.building,
	11: sprites.plane,
};

export function parseMap(mapData) {
	// Разделяем карту на слои для отрисовки
	const layoutBackground = new LayoutMap();
	 const layoutBackward1 = new LayoutMap();
	 const layoutBackward2 = new LayoutMap();
	 const layoutBackward3 = new LayoutMap();
	 const layoutBackward4 = new LayoutMap();
	 const layoutForward = new LayoutMap();
	 const layoutForward1 = new LayoutMap();
	 const layoutWalls = new Layout();

	mapData.forEach((xArr, x) => {
		xArr.forEach((yArr, y) => {
			yArr.forEach((item, index) => {
				if (item.tile === null && item.id === null) return;

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
				if(item.id === 812) {
					console.log(properties);
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
