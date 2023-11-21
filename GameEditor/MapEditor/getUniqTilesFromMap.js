'use strict';

const uniqTileMap = new Map();

import mapData from '../../src/levels/Zero/mapData.json' assert {type: 'json'};

const tileMap = {
	1: 'main.png',
	2: 'tiled.png',
	3: 'building.png',
	11: 'plane.png',
};

class Tile {
	constructor(tile, id) {
		this.tile = tileMap[tile];
		this.id = id;
	}

	toString() {
		return `[${this.tile}](${this.id})`;
	}
}

const counts = {};
mapData.flat(Infinity).forEach((item) => {
	if(item.tile === null && item.id === null) return;
	const collectionKey = tileMap[item.tile];
	if(!uniqTileMap.has(collectionKey)) {
		counts[collectionKey] = {};
		uniqTileMap.set(collectionKey, new Set());
	}
	counts[collectionKey][item.id] = counts[collectionKey][item.id] ? counts[collectionKey][item.id] + 1 : 1;
	uniqTileMap.get(collectionKey).add(new Tile(item.tile, item.id).toString());
})
console.log(counts);

// Сортируем по кол-ву использований того или иного тайла
for(const key in counts) {
	counts[key] = Object.entries(counts[key]).map(([id, count]) => ({
		id: parseInt(id),
		count,
	})).sort((a, b) => b.count - a.count);
}

let total = 0;
uniqTileMap.forEach((value) => {
	total += value.size;
});

console.table(counts['main.png']);


document.addEventListener("DOMContentLoaded", function() {
	const fileInput = document.getElementById("fileInput");
	const output = document.getElementById("output");

	fileInput.addEventListener("change", function(e) {
		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = function(e) {
				const image = new Image();
				image.src = e.target.result;

				image.onload = function() {
					const width = image.width;
					const height = image.height;
					const tileSize = 32;

					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");

					canvas.width = width;
					canvas.height = height;

					ctx.drawImage(image, 0, 0);

					let id = 0;
					for (let y = 0; y < height; y += tileSize) {
						for (let x = 0; x < width; x += tileSize) {
							const tileCanvas = document.createElement("canvas");
							tileCanvas.width = tileSize;
							tileCanvas.height = tileSize;

							const tileCtx = tileCanvas.getContext("2d");
							tileCtx.drawImage(canvas, -x, -y);

							const tileImage = new Image();

							tileImage.src = tileCanvas.toDataURL("image/png");
							const card = document.createElement('div');
							const cardBody = document.createElement('div');
							const cardTextLink = document.createElement('a');


							tileImage.classList.add('card-img-top');
							cardBody.classList.add('card-body');
							card.classList.add('card');
							card.classList.add('m-3');
							cardTextLink.classList.add('card-text');
							cardTextLink.classList.add('btn');
							cardTextLink.classList.add('btn-outline-dark');

							cardTextLink.innerText = id.toString();

							cardTextLink.href = tileImage.src;
							cardTextLink.download = `${id}.png`;

							card.style.width = '128px';
							tileImage.style.imageRendering = 'pixelated';

							card.appendChild(tileImage);
							card.appendChild(cardBody);
							cardBody.appendChild(cardTextLink);
							output.appendChild(card);

							id++;
						}
					}
				};
			};

			reader.readAsDataURL(file);
		}
	});
});


console.log(counts, total);
