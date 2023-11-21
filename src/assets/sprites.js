'use strict';

import {ImageLoader} from "../../GameEngine";

const tile96x96 = {tileWidth: 96, tileHeight: 96};
const tile32x32 = {tileWidth: 32, tileHeight: 32};

export const sprites = {
	// faces
	face16: new ImageLoader('src/img/sprite/face/16.png', {...tile96x96}),
	face17: new ImageLoader('src/img/sprite/face/17.png', {...tile96x96}),
	face18: new ImageLoader('src/img/sprite/face/18.png', {...tile96x96}),
	face19: new ImageLoader('src/img/sprite/face/19.png', {...tile96x96}),
	face20: new ImageLoader('src/img/sprite/face/20.png', {...tile96x96}),
	face21: new ImageLoader('src/img/sprite/face/21.png', {...tile96x96}),
	face22: new ImageLoader('src/img/sprite/face/22.png', {...tile96x96}),
	face23: new ImageLoader('src/img/sprite/face/23.png', {...tile96x96}),
	astofFace: new ImageLoader('src/img/sprite/face/24.png', {...tile96x96}),
	face25: new ImageLoader('src/img/sprite/face/25.png', {...tile96x96}),
	vanessaFace: new ImageLoader('src/img/sprite/face/26.png', {...tile96x96}),
	face27: new ImageLoader('src/img/sprite/face/27.png', {...tile96x96}),
	heroFaceM: new ImageLoader('src/img/sprite/face/hero0.png', {...tile96x96}),
	heroFaceF: new ImageLoader('src/img/sprite/face/hero1.png', {...tile96x96}),
	// sprites
	animal: new ImageLoader('src/img/sprite/animal.png', {...tile32x32}),
	children: new ImageLoader('src/img/sprite/children.png', {...tile32x32}),
	nps0: new ImageLoader('src/img/sprite/nps0.png', {...tile32x32}),
	nps1: new ImageLoader('src/img/sprite/nps1.png', {...tile32x32}),
	hero0: new ImageLoader('src/img/sprite/hero.png', {...tile32x32}),
	hero1: new ImageLoader('src/img/sprite/hero1.png', {...tile32x32}),
	zombies: new ImageLoader('src/img/sprite/enemy2.png', {...tile32x32}),
	batman: new ImageLoader('src/img/sprite/batman.png', {...tile32x32}),
	// tiles
	main: new ImageLoader('src/img/tiles/main.png', {...tile32x32}),
	plane: new ImageLoader('src/img/tiles/plane.png', {...tile32x32}),
	building: new ImageLoader('src/img/tiles/building.png', {...tile32x32}),
	tiled: new ImageLoader('src/img/tiles/tiled.png', {...tile32x32}),
	// interface
	interfaceResources: new ImageLoader('src/img/sprite/interface.png'),
}
