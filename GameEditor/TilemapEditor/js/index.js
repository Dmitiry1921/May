'use strict';

import {
	Collider,
	GameEngine,
	ImageLoader,
	Point,
	Rectangle,
	Sprite,
	storage,
	Vector2
} from "../../../GameEngine";

const minTileSize = 16;
const Editor = new GameEngine({
	canvasId: "wallEditorCanvas",
	imageSmoothingEnabled: false,
	clearCanvasBeforeRender: true,
});
const TilesCollection = new GameEngine({
	canvasId: "tilesEditorCanvas",
	imageSmoothingEnabled: false,
	clearCanvasBeforeRender: true,
});
const TilePropertiesPreview = new GameEngine({
	canvasId: "tilePropertiesPreview",
	imageSmoothingEnabled: false,
	clearCanvasBeforeRender: true,
});
const screens = {
	imageLoading: document.getElementById('screen-01'),
	jsonDataLoading: document.getElementById('screen-02'),
	tileProperties: document.getElementById('screen-03'),
	wallEditor: document.getElementById('screen-04'),
	exportJsonData: document.getElementById('screen-05'),
};
const markerSize = 10;
const markers = {
	topCenter: new Rectangle(0, 0, markerSize, markerSize),
	bottomCenter: new Rectangle(0, 0, markerSize, markerSize),
	leftCenter: new Rectangle(0, 0, markerSize, markerSize),
	rightCenter: new Rectangle(0, 0, markerSize, markerSize),
}
const deltaGrid = new Vector2(0, 0);
const previewDeltaGrid = new Vector2(0, 0);
const delta = new Vector2(0, 0);
const previewDelta = new Vector2(0, 0);
const cursor = new Collider('cursor', new Rectangle(0, 0, 1, 1));

let elTileWidth;
let elTileHeight;
let elEditorToolPencil;
let elEditorToolEraser;
let tileWidth = 0;
let tileHeight = 0;
let scale = storage.editorScale || 14;
let scaleCollection = storage.collectionScale || 2;
let scaleTilePropertiesPreview = storage.tilePropertiesPreviewScale || 2;
let currentTileIndex = null;
let currentWall = null;
let currentWallIndex = null;
let sourceRect = new Rectangle();
let loader = null;
let editorSprite = null;
let collectionSprite = null;
let tilePropertiesPreviewSprite = null;
let cellPoint = storage.cellPoint || null;
let currentTile = null;
let dragStart = null;
let dragStop = null;
let currentMarker = null;


function showScreen(id) {
	Object.keys(screens).forEach((key) => {
		if (key === id) {
			screens[key].classList.remove('hide');
			return;
		}
		screens[key].classList.add('hide');
	});
	document.querySelectorAll('.nav-link').forEach((link) => {
		link.classList.add('link-secondary')
		if (link.dataset.target === id) {
			link.classList.add('active')
			link.classList.remove('link-secondary')
		} else {
			link.classList.remove('active')
		}
	});
	storage.currentScreen = id;
	resize();
}

function getFileNameWithoutExtension(fileName) {
	const lastDotIndex = fileName.lastIndexOf(".");
	return lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
}

function createJSON() {
	const jsonData = Array((imageTag.width / tileWidth) * (imageTag.height / tileHeight)).fill({
		x: 0,
		y: 0,
		width: tileWidth,
		height: tileHeight,
		walls: [],
	});

	storage.json = JSON.parse(JSON.stringify(jsonData)).map((item, index) => {
		item.x = (index % (imageTag.width / tileWidth)) * tileWidth;
		item.y = Math.floor(index / (imageTag.width / tileWidth)) * tileHeight;
		return item;
	});

	showScreen('wallEditor');
}

function downloadJSON() {
	// Преобразуем объект в строку JSON
	const jsonString = JSON.stringify(storage.json, null, 2);
	// Создаем Blob объект с JSON данными
	const blob = new Blob([jsonString], {type: "application/json"});
	// Создаем ссылку для скачивания файла
	const url = URL.createObjectURL(blob);
	// Создаем элемент <a> для скачивания
	const a = document.createElement("a");
	a.href = url;
	a.download = `${storage.imageName}.json`; // Указываем имя файла
	a.click();
}

function resize() {
	document.querySelectorAll('canvas').forEach((canvas) => {
		canvas.width = canvas.parentNode.clientWidth;
		canvas.height = canvas.parentNode.clientHeight;
	});
}

/**
 * Возвращает прямоугольник стены в координатах канваса
 * @param wall
 * @returns {Rectangle}
 */
function getWallRect(wall) {
	const rect = new Rectangle(wall.x * scale, wall.y * scale, wall.width, wall.height);
	rect.setScale(scale);
	rect.moveTo(new Point(
		editorSprite.bound.x + ((wall.x % tileWidth) * scale),
		editorSprite.bound.y + ((wall.y % tileHeight) * scale)
	));

	return rect;
}

function drawWall(canvasContext) {
	if (!currentTile) return;
	currentTile.walls.forEach((wall) => {
		const rect = getWallRect(wall);
		rect.render(canvasContext, {style: "red", width: 1});

		// Рисуем диагональные линии
		canvasContext.beginPath();
		canvasContext.moveTo(Math.round(rect.x) + .5, Math.round(rect.y) + .5);
		canvasContext.lineTo(Math.round(rect.x) + .5 + rect.width, Math.round(rect.y) + .5 + rect.height);
		canvasContext.stroke();

		// Рисуем диагональные линии
		canvasContext.beginPath();
		canvasContext.moveTo(Math.round(rect.x) + .5 + rect.width, Math.round(rect.y) + .5);
		canvasContext.lineTo(Math.round(rect.x) + .5, Math.round(rect.y) + .5 + rect.height);
		canvasContext.stroke();
	});
}

function drawMarkers(canvasContext) {
	if (currentTile === null || currentWall === null || currentWallIndex === null) return;
	const wall = getWallRect(currentWall);
	Object.entries(markers).forEach(([key, marker]) => {
		marker.delta.moveTo(new Point(
			editorSprite.bound.x + ((currentWall.x % tileWidth) * scale),
			editorSprite.bound.y + ((currentWall.y % tileHeight) * scale)
		));
		switch (key) {
			case 'topCenter':
				marker.moveTo(new Point(
					wall.width / 2 - marker.width / 2,
					-marker.width / 2,
				));
				break;
			case 'bottomCenter':
				marker.moveTo(new Point(
					wall.width / 2 - marker.width / 2,
					wall.height - marker.height / 2,
				));
				break;
			case 'leftCenter':
				marker.moveTo(new Point(
					-marker.width / 2,
					wall.height / 2 - marker.height / 2,
				));
				break;
			case 'rightCenter':
				marker.moveTo(new Point(
					wall.width - marker.width / 2,
					wall.height / 2 - marker.height / 2,
				));
				break;
		}
		marker.fill(canvasContext, {style: "white"});
		marker.render(canvasContext, {width: 1});
	});
}

function drawGridCollection(canvasContext, {style = "blue", width = 1} = {}) {
	if (!loader) return;
	// Задаем цвет и толщину линии
	canvasContext.lineWidth = width;
	canvasContext.strokeStyle = style;
	const cellSize = (parseInt(storage.tileWidth) * scaleCollection);
	const cellCountX = (loader.resource.width * scaleCollection) / cellSize;
	const cellCountY = (loader.resource.height * scaleCollection) / cellSize;
	// // Рисуем горизонтальные линии
	for (let i = 0; i <= cellCountY; i++) {
		const y = i * cellSize;
		canvasContext.beginPath();
		canvasContext.moveTo(deltaGrid.x, y + deltaGrid.y);
		canvasContext.lineTo(deltaGrid.x + (loader.resource.width * scaleCollection), y + deltaGrid.y);
		canvasContext.stroke();
	}
	// Рисуем вертикальные линии
	for (let i = 0; i <= cellCountX; i++) {
		const x = i * cellSize;
		canvasContext.beginPath();
		canvasContext.moveTo(x + deltaGrid.x, deltaGrid.y);
		canvasContext.lineTo(x + deltaGrid.x, (loader.resource.height * scaleCollection) + deltaGrid.y);
		canvasContext.stroke();
	}
}

function drawPreviewGrid(canvasContext, {style = "blue", width = 1} = {}) {
	const center = new Point(TilePropertiesPreview.canvas.width / 2 - tilePropertiesPreviewSprite.width / 2, TilePropertiesPreview.canvas.height / 2 - tilePropertiesPreviewSprite.height / 2);
	// Задаем цвет и толщину линии
	canvasContext.lineWidth = width;
	canvasContext.strokeStyle = style;
	const cellSize = (Math.max((parseInt(storage.tileWidth) || elTileWidth.value), 16) * scaleTilePropertiesPreview);
	const cellCountX = (loader.resource.width * scaleTilePropertiesPreview) / cellSize;
	const cellCountY = (loader.resource.height * scaleTilePropertiesPreview) / cellSize;
	// // Рисуем горизонтальные линии
	for (let i = 0; i <= cellCountY; i++) {
		const y = i * cellSize;
		canvasContext.beginPath();
		canvasContext.moveTo(center.x + previewDeltaGrid.x, center.y + y + previewDeltaGrid.y);
		canvasContext.lineTo(center.x + previewDeltaGrid.x + (loader.resource.height * scaleTilePropertiesPreview),  center.y + y + previewDeltaGrid.y);
		canvasContext.stroke();
	}
	// Рисуем вертикальные линии
	for (let i = 0; i <= cellCountX; i++) {
		const x = i * cellSize;
		canvasContext.beginPath();
		canvasContext.moveTo(center.x + x + previewDeltaGrid.x,  center.y + previewDeltaGrid.y);
		canvasContext.lineTo(center.x + x + previewDeltaGrid.x,  center.y + (loader.resource.height * scaleTilePropertiesPreview) + previewDeltaGrid.y);
		canvasContext.stroke();
	}
}

function drawWallCollection(canvasContext) {
	// Задаем цвет и толщину линии
	canvasContext.lineWidth = .5;
	canvasContext.strokeStyle = "red";
	storage?.json?.forEach((tile) => {
		tile.walls.forEach((wall) => {
			const rect = new Rectangle(wall.x * scaleCollection, wall.y * scaleCollection, wall.width, wall.height);
			rect.setScale(scaleCollection);
			rect.moveBy(deltaGrid);
			rect.render(canvasContext, {style: "red", width: 1});

			// // Рисуем диагональные линии
			canvasContext.beginPath();
			canvasContext.moveTo(Math.round(rect.x) + .5, Math.round(rect.y) + .5);
			canvasContext.lineTo(Math.round(rect.x) + .5 + rect.width, Math.round(rect.y) + .5 + rect.height);
			canvasContext.stroke();

			// Рисуем диагональные линии
			canvasContext.beginPath();
			canvasContext.moveTo(Math.round(rect.x) + .5 + rect.width, Math.round(rect.y) + .5);
			canvasContext.lineTo(Math.round(rect.x) + .5, Math.round(rect.y) + .5 + rect.height);
			canvasContext.stroke();
		});
	});
}

function drawSelectedTile(canvasContext) {
	if (!cellPoint) return;
	const width = parseInt(storage.tileWidth) * scaleCollection
	const height = parseInt(storage.tileHeight) * scaleCollection;
	const rect = new Rectangle(
		cellPoint.x * width,
		cellPoint.y * height,
		width,
		height,
	);
	rect.moveBy(deltaGrid);
	rect.render(canvasContext, {style: "blue", width: 4});
}

function editorScaleHandler(id) {
	if (id === 'editorScalePlus') {
		scale = storage.editorScale = Math.min(storage.editorScale + 1, 20);
	}
	if (id === 'editorScaleMinus') {
		scale = storage.editorScale = Math.max(storage.editorScale - 1, 1);
	}
}

function collectionScaleHandler(id) {
	if (id === 'collectionScalePlus') {
		scaleCollection = storage.collectionScale = Math.min(storage.collectionScale + 1, 20);
	}
	if (id === 'collectionScaleMinus') {
		scaleCollection = storage.collectionScale = Math.max(storage.collectionScale - 1, 1);
	}
}

function previewScaleHandler(id) {
	if(id === 'previewScalePlus') {
		scaleTilePropertiesPreview = storage.tilePropertiesPreviewScale = Math.min(storage.tilePropertiesPreviewScale + 1, 20);
	}
	if(id === 'previewScaleMinus') {
		scaleTilePropertiesPreview = storage.tilePropertiesPreviewScale = Math.max(storage.tilePropertiesPreviewScale - 1, 1);
	}
}
const imageTag = new Image();
imageTag.onload = function () {
	console.info('image loaded');
	resize();

	const loader = new ImageLoader(imageTag.src);
	TilesCollection.updateImage(loader);
	Editor.updateImage(loader);
	Editor.startLoop();
	TilesCollection.startLoop();
	TilePropertiesPreview.startLoop();


	if (!storage.json) {
		showScreen('tileProperties');
		return;
	}
	if(storage.currentScreen) {
		showScreen(storage.currentScreen);
		return;
	}
	showScreen('wallEditor');
}

Editor.canvas.addEventListener('click', (event) => {
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
	// Определяем на какую стену кликнули
	if (!currentTile) return;
	currentWallIndex = null;
	currentWall = null;
	currentTile.walls.find((wall, index) => {
		const rect = new Rectangle(wall.x * scale, wall.y * scale, wall.width, wall.height);
		rect.setScale(scale);
		const collider = new Collider('wall', rect);
		collider.moveTo(new Point(
			editorSprite.bound.x + ((wall.x % tileWidth) * scale),
			editorSprite.bound.y + ((wall.y % tileHeight) * scale)
		));
		if (collider.intersects(cursor)) {
			currentWallIndex = index;
			currentWall = wall;
			return true;
		}
	});
});
Editor.canvas.addEventListener('mousemove', (event) => {
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
	Editor.canvas.style.cursor = 'default';
	Object.entries(markers).forEach(([key, marker]) => {
		const markerCollider = new Collider(key, marker);
		if (markerCollider.intersects(cursor)) {
			Editor.canvas.style.cursor = ['topCenter', 'bottomCenter'].includes(key) ? 'ns-resize' : 'ew-resize';
		}
	});
	if (dragStart) {
		dragStop = new Vector2(event.offsetX, event.offsetY);
		const diff = Vector2.diff(dragStop, dragStart).divide(new Vector2(scale, scale));
		diff.x = Math.round(diff.x);
		diff.y = Math.round(diff.y);
		switch (currentMarker) {
			case 'topCenter':
				currentWall.y += diff.y;
				currentWall.height = Math.max(currentWall.height - diff.y, 1);
				break;
			case 'bottomCenter':
				currentWall.height = Math.max(currentWall.height + diff.y, 1);
				break;
			case 'leftCenter':
				currentWall.x += diff.x;
				currentWall.width = Math.max(currentWall.width - diff.x, 1);
				break;
			case 'rightCenter':
				currentWall.width = Math.max(currentWall.width + diff.x, 1);
				break;
		}
		if (diff.x !== 0 || diff.y !== 0) {
			dragStart.x = dragStop.x;
			dragStart.y = dragStop.y;
		}
	}
});
Editor.canvas.addEventListener('mousedown', (event) => {
	if (!currentTile) return;
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
	Object.entries(markers).forEach(([key, marker]) => {
		const markerCollider = new Collider(key, marker);
		if (markerCollider.intersects(cursor)) {
			dragStart = new Vector2(event.offsetX, event.offsetY);
			currentMarker = key;
		}
	});
});
Editor.canvas.addEventListener('mouseup', (event) => {
	Editor.canvas.style.cursor = 'default';
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
	currentMarker = null;
	dragStart = null;
	dragStop = null;

});

TilesCollection.canvas.addEventListener('wheel', (event) => {
	// Отменяем стандартное поведение скролла, чтобы предотвратить прокрутку страницы
	event.preventDefault();

	// Предотвращаем всплытие события колесика
	event.stopPropagation();

	if (!collectionSprite) return;
	delta.x = event.deltaX;
	delta.y = event.deltaY;
	collectionSprite.moveBy(delta.invert());
	deltaGrid.add(delta);
});
TilesCollection.canvas.addEventListener('click', (event) => {
	currentWallIndex = null;
	currentWall = null;
	// Отменяем стандартное поведение скролла, чтобы предотвратить прокрутку страницы
	event.preventDefault();
	// Предотвращаем всплытие события колесика
	event.stopPropagation();

	if (!collectionSprite) return;
	cellPoint = new Point(
		Math.floor((event.offsetX - deltaGrid.x) / (storage.tileWidth * scaleCollection)),
		Math.floor((event.offsetY - deltaGrid.y) / (storage.tileHeight * scaleCollection)),
	);
	storage.cellPoint = cellPoint;
});

TilePropertiesPreview.canvas.addEventListener('wheel', (event) => {
	event.preventDefault();
	event.stopPropagation();

	if (!tilePropertiesPreviewSprite) return;
	previewDelta.x = event.deltaX;
	previewDelta.y = event.deltaY;
	tilePropertiesPreviewSprite.moveBy(previewDelta.invert());
	previewDeltaGrid.add(previewDelta);
});


Editor.updateImage = function (loaderParam) {
	loader = loaderParam;
	loader.load().then((image) => {
		editorSprite = new Sprite(loader, sourceRect);
	});
};
Editor.addProcessInput(() => {
	tileWidth = parseInt(storage.tileWidth);
	tileHeight = parseInt(storage.tileHeight);
	if (!storage.json || !storage.cellPoint) return;
	currentTile = storage.json.find((item, index) => {
		if (item.x === storage.cellPoint.x * tileWidth && item.y === storage.cellPoint.y * tileHeight) {
			currentTileIndex = index;
			return true;
		}
	});
	// Активируем или деактивируем кнопку "Карандаш"
	elEditorToolPencil.disabled = !Boolean(currentTile);
	elEditorToolEraser.disabled = !Boolean(currentWall);

	sourceRect.resize(tileWidth, tileHeight);
	sourceRect.moveTo(new Point(storage.cellPoint.x * tileWidth, storage.cellPoint.y * tileHeight));
	if (!editorSprite) return;
	editorSprite.resize((tileWidth || editorSprite.width) * scale, (tileHeight || editorSprite.height) * scale);
	editorSprite.moveTo(new Point(Editor.canvas.width / 2 - editorSprite.width / 2, Editor.canvas.height / 2 - editorSprite.height / 2));
});
Editor.addProcessUpdate(() => {
});
Editor.addProcessRender((canvasContext) => {
	editorSprite.render(canvasContext);
	drawWall(canvasContext);
	drawMarkers(canvasContext);
	// Рисуем точку курсора
	// cursor.render(canvasContext);
});

TilesCollection.updateImage = function (loaderParam) {
	loader = loaderParam;
	loader.load().then((image) => {
		collectionSprite = new Sprite(loader, new Rectangle(0, 0, image.width, image.height));
		tilePropertiesPreviewSprite = new Sprite(loader, new Rectangle(0, 0, image.width, image.height));
	});
}
TilesCollection.addProcessInput(() => {
});
TilesCollection.addProcessRender((canvasContext) => {
	if (!collectionSprite) return;
	collectionSprite.resize(parseInt(loader.resource.width) * scaleCollection, parseInt(loader.resource.height) * scaleCollection);
	collectionSprite.render(canvasContext);
	drawGridCollection(canvasContext, {style: "#3b3b3b"});
	drawWallCollection(canvasContext);
	drawSelectedTile(canvasContext);
});

TilePropertiesPreview.addProcessUpdate(() => {
	if(!tilePropertiesPreviewSprite) return;
	const center = new Point(
		(TilePropertiesPreview.canvas.width / 2 - tilePropertiesPreviewSprite.width / 2) + previewDeltaGrid.x,
		(TilePropertiesPreview.canvas.height / 2 - tilePropertiesPreviewSprite.height / 2) + previewDeltaGrid.y,
	);
	tilePropertiesPreviewSprite.moveTo(center);
	tilePropertiesPreviewSprite.resize(parseInt(loader.resource.width) * scaleTilePropertiesPreview, parseInt(loader.resource.height) * scaleTilePropertiesPreview);
});
TilePropertiesPreview.addProcessRender((canvasContext) => {
	if (!tilePropertiesPreviewSprite) return;
	tilePropertiesPreviewSprite.render(canvasContext);
	drawPreviewGrid(canvasContext);
});

document.addEventListener('DOMContentLoaded', () => {
	elTileWidth = document.getElementById('tileWidth');
	elTileHeight = document.getElementById('tileHeight');
	const elFileInputJson = document.getElementById('fileInputJson');
	const elFileInputImage = document.getElementById('fileInputImage');
	const elCreateJSON = document.getElementById('createJSON');
	const elDownloadJSON = document.getElementById('downloadJSON');
	const elEditorScalePlus = document.getElementById('editorScalePlus');
	const elEditorScaleMinus = document.getElementById('editorScaleMinus');
	const elCollectionScalePlus = document.getElementById('collectionScalePlus');
	const elCollectionScaleMinus = document.getElementById('collectionScaleMinus');
	const elPreviewScalePlus = document.getElementById('previewScalePlus');
	const elPreviewScaleMinus = document.getElementById('previewScaleMinus');
	elEditorToolPencil = document.getElementById('editorToolPencil');
	elEditorToolEraser = document.getElementById('editorToolEraser');
	document.querySelectorAll('.nav-link').forEach((link) => {
		link.addEventListener("mouseover", function () {
			if (link.classList.contains('active')) return;
			link.classList.remove("link-secondary");
		});
		link.addEventListener("mouseout", function () {
			if (link.classList.contains('active')) return;
			link.classList.add("link-secondary");
		});
	});
	elEditorScalePlus.addEventListener('click', editorScaleHandler.bind(null, 'editorScalePlus'));
	elEditorScaleMinus.addEventListener('click', editorScaleHandler.bind(null, 'editorScaleMinus'));
	elCollectionScalePlus.addEventListener('click', collectionScaleHandler.bind(null, 'collectionScalePlus'));
	elCollectionScaleMinus.addEventListener('click', collectionScaleHandler.bind(null, 'collectionScaleMinus'));
	elPreviewScalePlus.addEventListener('click', previewScaleHandler.bind(null, 'previewScalePlus'));
	elPreviewScaleMinus.addEventListener('click', previewScaleHandler.bind(null, 'previewScaleMinus'));
	elEditorToolPencil.addEventListener('click', () => {
		if (!currentTile) return;
		// if (!currentTile.walls?.length) ;
		currentTile.walls.push(new Rectangle(currentTile.x, currentTile.y, 5, 5));
		currentWall = currentTile.walls[currentTile.walls.length - 1];
		currentWallIndex = currentTile.walls.length - 1;
	});
	elEditorToolEraser.addEventListener('click', () => {
		if (!currentTile?.walls) return;
		if (currentWallIndex === null) return;
		currentTile.walls.splice(currentWallIndex, 1);
		currentWallIndex = null;
	});
	elCreateJSON.addEventListener('click', () => createJSON());
	elDownloadJSON.addEventListener('click', () => downloadJSON());
	elFileInputImage.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				// Загружаем изображение после чтения файла
				storage.image = reader.result;
				storage.imageName = getFileNameWithoutExtension(file.name);
				imageTag.src = reader.result;
				storage.json = undefined;
			};
		}
	});
	elFileInputJson.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			// reader.readAsDataURL(file);
			reader.readAsText(file)
			reader.onload = function (e) {
				// Загружаем изображение после чтения файла
				const jsonRaw = JSON.parse(reader.result);
				storage.json = jsonRaw.map((item) => {
					const tileWidth = item.width || parseInt(storage.tileWidth);
					const tileHeight = item.height || parseInt(storage.tileHeight);
					if (!item.walls) {
						item.walls = [];
						if (item.wall === 1) {
							item.walls = [new Rectangle(item.x, item.y, tileWidth, tileHeight)];
						}
					}

					item.width = tileWidth;
					item.height = tileHeight;

					delete item.wall;

					return item;
				});
				showScreen('wallEditor');
			};
		}
	});
	elTileWidth.addEventListener('change', (event) => {
		const val = Math.max(event.target.value, minTileSize);
		storage.tileWidth = val;
		event.target.value = val;
	});
	elTileHeight.addEventListener('change', (event) => {
		const val = Math.max(event.target.value, minTileSize);
		storage.tileHeight =val;
		event.target.value = val;

	});
	// получаем данные из хранилища
	const {image, tileWidth, tileHeight} = storage;

	elTileWidth.value = tileWidth || elTileWidth.value;
	elTileHeight.value = tileHeight || elTileHeight.value;

	if (!image) {
		showScreen('imageLoading');
		return;
	}

	imageTag.src = image;
	setTimeout(() => {
		resize();
	}, 5);
});

window.showScreen = showScreen;
window.addEventListener("resize", function () {
	resize();
});
window.reset = () => {
	storage.clearAll();
}
