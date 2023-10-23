'use strict';

import {ImageLoader} from "../../GameEngine/index.js";

const tile96x96 = {tileWidth: 96, tileHeight: 96};
const tile32x32 = {tileWidth: 32, tileHeight: 32};

export const sprites = {
	// sprites
	face17: new ImageLoader('img/sprite/face/17.png', {...tile96x96}),
	face21: new ImageLoader('img/sprite/face/21.png', {...tile96x96}),
	face24: new ImageLoader('img/sprite/face/24.png', {...tile96x96}),
	face26: new ImageLoader('img/sprite/face/26.png', {...tile96x96}),
	children: new ImageLoader('img/sprite/children.png', {...tile32x32}),
	nps0: new ImageLoader('img/sprite/nps0.png', {...tile32x32}),
	nps1: new ImageLoader('img/sprite/nps1.png', {...tile32x32}),
	hero0: new ImageLoader('img/sprite/hero.png', {...tile32x32}),
	hero1: new ImageLoader('img/sprite/hero1.png', {...tile32x32}),
	// tiles
	main: new ImageLoader('img/tiles/main.png', {...tile32x32}),
	plane: new ImageLoader('img/tiles/plane.png', {...tile32x32}),
	building: new ImageLoader('img/tiles/building.png', {...tile32x32}),
	tiled: new ImageLoader('img/tiles/tiled.png', {...tile32x32}),
}
