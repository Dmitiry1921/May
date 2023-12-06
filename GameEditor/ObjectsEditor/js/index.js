'use strict';

import {
	Collider,
	GameEngine,
	ImageLoader,
	Point,
	Rectangle,
	Text,
	Sprite,
	storage,
	Vector2,
	InputManager,
} from "../../../GameEngine";
import {Entity} from "./Entity.js";
import {OBJECT_EDITOR_KEYS} from "./keys.js";

const ObjectsSelectionPreview = new GameEngine({
	canvasId: "ObjectsSelectionPreview",
	imageSmoothingEnabled: false,
	clearCanvasBeforeRender: true,
});
const WallEditor = new GameEngine({
	canvasId: "WallEditor",
	imageSmoothingEnabled: false,
	clearCanvasBeforeRender: true,
});
const screens = {
	imageLoading: document.getElementById('screen-01'),
	jsonDataLoading: document.getElementById('screen-02'),
	selectionOfObjects: document.getElementById('screen-03'),
	wallEditor: document.getElementById('screen-04'),
	exportJsonData: document.getElementById('screen-05'),
};
const engines = {
	imageLoading: [],
	jsonDataLoading: [],
	wallEditor: [WallEditor],
	selectionOfObjects: [ObjectsSelectionPreview],
	exportJsonData: [],
};
const markerSize = 10;
const markers = {
	topCenter: new Collider('marker', new Rectangle(0, 0, markerSize, markerSize)),
	bottomCenter: new Collider('marker', new Rectangle(0, 0, markerSize, markerSize)),
	leftCenter: new Collider('marker', new Rectangle(0, 0, markerSize, markerSize)),
	rightCenter: new Collider('marker', new Rectangle(0, 0, markerSize, markerSize)),
}
const wallEditorDelta = new Vector2(0, 0);
const previewDeltaGrid = new Vector2(0, 0);
const previewDelta = new Vector2(0, 0);
const chooseText = new Text({
	text: 'Choose an object',
	rect: new Rectangle(300, 300, 290, 40),
	textAlign: Text.ALIGN.CENTER,
	fontSize: '22px',
});
const cursor = new Collider('cursor', new Rectangle(0, 0, 1, 1));
const drawingStartPoint = new Point(0, 0);
const drawingRect = new Rectangle();
const wallDrawingRect = new Rectangle();
wallDrawingRect.diagonals = true;
const loader = new ImageLoader('');

let elEditorToolPencil;
let elEditorToolEraser;
let scale = storage.editorScale || 4;
let scaleCollection = storage.collectionScale || 2;
let scaleObjectsSelectionPreview = storage.objectsSelectionPreviewScale || 2;
let currentEntity = null;
let currentEntityIndex = null;
let currentWallIndex = null;
let objectsSelectionPreviewSprite = null;
let wallEditorPreviewSprite = null;
let dragStart = null;
let dragStop = null;
let dragDiff = new Vector2(0, 0);
let currentMarker = null;
let isMouseDown = false;

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
	console.log({id});
	storage.currentScreen = id;
	Object.values(engines)
		.flat()
		.forEach((engine) => engine.stopLoop());
	engines[id].forEach((engine) => engine.startLoop());
	resize(document.getElementById('ObjectsSelectionPreview'));
	resize(document.getElementById('WallEditor'));
}

function getFileNameWithoutExtension(fileName) {
	const lastDotIndex = fileName.lastIndexOf(".");
	return lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
}

function createJSON() {
	if (storage.entities.length !== 0) {
		if (!confirm('Это действие приведет к потере уже существующих данных. Продолжить?')) {
			return;
		}
	}
	storage.entities = [];

	showScreen('selectionOfObjects');
}

function downloadJSON() {
	// Преобразуем объект в строку JSON
	const jsonString = JSON.stringify({entities: storage.entities}, null, 2);
	// Создаем Blob объект с JSON данными
	const blob = new Blob([jsonString], {type: "application/json"});
	// Создаем ссылку для скачивания файла
	const url = URL.createObjectURL(blob);
	// Создаем элемент <a> для скачивания
	const a = document.createElement("a");
	a.href = url;
	a.download = `${storage.imageName}-objects.json`; // Указываем имя файла
	a.click();
}

function resize(canvas) {
	currentEntityIndex = null;
	canvas.width = canvas.parentNode.clientWidth;
	canvas.height = canvas.parentNode.clientHeight;
}

function drawMarkers(canvasContext, rect = drawingRect) {
	if (rect.width === 0 && rect.height === 0) return;
	Object.entries(markers).forEach(([key, marker]) => {
		marker.visible = true;
		marker.delta.moveTo(new Point(
			rect.x,
			rect.y,
		));
		switch (key) {
			case 'topCenter':
				marker.moveTo(new Point(
					rect.width / 2 - marker.width / 2,
					-marker.width / 2,
				));
				break;
			case 'bottomCenter':
				marker.moveTo(new Point(
					rect.width / 2 - marker.width / 2,
					rect.height - marker.height / 2,
				));
				break;
			case 'leftCenter':
				marker.moveTo(new Point(
					-marker.width / 2,
					rect.height / 2 - marker.height / 2,
				));
				break;
			case 'rightCenter':
				marker.moveTo(new Point(
					rect.width - marker.width / 2,
					rect.height / 2 - marker.height / 2,
				));
				break;
		}
		marker.shape.fill(canvasContext, {style: "white"});
		marker.shape.render(canvasContext, {width: 1});
	});
}

function createEntityFromObject(rect) {
	return new Entity(
		Math.round(rect.x * scaleObjectsSelectionPreview + objectsSelectionPreviewSprite.x),
		Math.round(rect.y * scaleObjectsSelectionPreview + objectsSelectionPreviewSprite.y),
		Math.round(rect.width * scaleObjectsSelectionPreview),
		Math.round(rect.height * scaleObjectsSelectionPreview),
	);
}

function getEntityForSave(rect) {
	return new Entity(
		Math.round((rect.x - objectsSelectionPreviewSprite.x) / scaleObjectsSelectionPreview),
		Math.round((rect.y - objectsSelectionPreviewSprite.y) / scaleObjectsSelectionPreview),
		Math.round(rect.width / scaleObjectsSelectionPreview),
		Math.round(rect.height / scaleObjectsSelectionPreview),
	);
}

function drawObjectsBounds(canvasContext, {style = "blue", width = 1} = {}) {
	// Задаем цвет и толщину линии
	canvasContext.lineWidth = width;
	canvasContext.strokeStyle = style;
	currentEntity = null;
	storage.entities.forEach((entity, index) => {
		const object = createEntityFromObject(entity);
		let style = 'blue';
		if (index === currentEntityIndex) {
			style = "red";
			currentEntity = object;
		}
		object.render(canvasContext, {style, width: 1});
	});
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

	if (id === 'previewScalePlus') {
		scaleObjectsSelectionPreview = storage.objectsSelectionPreviewScale = Math.min(storage.objectsSelectionPreviewScale + 1, 20);
	}
	if (id === 'previewScaleMinus') {
		scaleObjectsSelectionPreview = storage.objectsSelectionPreviewScale = Math.max(storage.objectsSelectionPreviewScale - 1, 1);
	}
}

function getRectBetweenPoints(point1, point2) {
	const minX = Math.min(point1.x, point2.x);
	const minY = Math.min(point1.y, point2.y);
	const maxX = Math.max(point1.x, point2.x);
	const maxY = Math.max(point1.y, point2.y);

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
	};
}

function checkCursorOnMarker() {
	currentMarker = null;
	Object.entries(markers).forEach(([key, marker]) => {
		if (marker.intersects(cursor)) {
			currentMarker = key;
		}
	});
	console.log({currentMarker});
	return currentMarker;
}

function deleteCurrentEntity() {
	if (currentEntityIndex === null) return;
	storage.entities.splice(currentEntityIndex, 1);
	currentEntityIndex = null;
	drawingRect.resize(0, 0);
	drawingRect.moveTo(new Point(0, 0));
}

function deleteCurrentWall() {
	if (currentEntityIndex === null) return;
	if (currentWallIndex === null) return;
	storage.entities[currentEntityIndex].rigidBodies.splice(currentWallIndex, 1);
	wallDrawingRect.moveTo(new Point(0, 0));
	wallDrawingRect.resize(0, 0);
	currentWallIndex = null;
}

function moveDrawingRect() {
	const currentEntity = storage.entities[currentEntityIndex];
	if (!currentEntity) return;
	const {width, height, x, y} = createEntityFromObject(currentEntity);
	drawingRect.resize(width, height);
	drawingRect.moveTo(new Point(x, y));
}

function clickOnCanvas(block, event) {
	[...block.querySelectorAll('canvas')].forEach((child) => {
		child.classList.remove('active');
	});
	currentEntityIndex = parseInt(event.target.dataset.index);
	currentWallIndex = null;
	wallDrawingRect.resize(0, 0);
	wallDrawingRect.moveTo(new Point(0, 0));
	const currentEntity = storage.entities[currentEntityIndex];
	event.target.classList.add('active');
	// Располагаем спрайт в центре
	previewDeltaGrid.x = currentEntity.x * scaleObjectsSelectionPreview * -1;
	previewDeltaGrid.y = currentEntity.y * scaleObjectsSelectionPreview * -1;

	objectsSelectionPreviewSprite.moveTo(new Point(
		(ObjectsSelectionPreview.canvas.width / 2) - (currentEntity.x * scaleObjectsSelectionPreview) - (currentEntity.width * scaleObjectsSelectionPreview / 2),
		(ObjectsSelectionPreview.canvas.height / 2) - (currentEntity.y * scaleObjectsSelectionPreview) - (currentEntity.height * scaleObjectsSelectionPreview / 2),
	));
	wallEditorDelta.x = 0;
	wallEditorDelta.y = 0;
	moveDrawingRect();
}

function createPreviewImages(block = document.getElementById('objectsPreview')) {
	[...block.childNodes].forEach((child) => {
		block.removeChild(child);
	});

	const source = new Rectangle();
	const sprite = new Sprite(loader, source);

	const canvases = [];

	storage.entities?.forEach((entity, index) => {
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d');

		canvas.width = entity.width;
		canvas.height = entity.height;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.imageSmoothingEnabled = false;

		source.resize(entity.width, entity.height);
		source.moveTo(new Point(entity.x, entity.y));
		sprite.resize(entity.width, entity.height);
		sprite.moveTo(new Point(0, 0));
		sprite.render(context);

		entity.rigidBodies.forEach((body) => {
			const rect = new Rectangle(body.x - entity.x, body.y - entity.y, body.width, body.height);
			rect.diagonals = true;
			rect.render(context);
		});

		canvas.dataset.index = index;

		if (index?.toString() === currentEntityIndex?.toString()) {
			canvas.classList.add('active');
		}
		canvas.addEventListener('click', (event) => clickOnCanvas(block, event));
		canvases.push(canvas);
	});

	canvases
		// TODO сделать кнопки мб ?
		// .sort((a, b) => a.height - b.height)
		// .sort((a, b) => a.width - b.width)
		.forEach((canvas) => block.appendChild(canvas));
}

function moveToCenter() {
	const center = new Point(
		(ObjectsSelectionPreview.canvas.width / 2 - objectsSelectionPreviewSprite.width / 2) + previewDeltaGrid.x,
		(ObjectsSelectionPreview.canvas.height / 2 - objectsSelectionPreviewSprite.height / 2) + previewDeltaGrid.y,
	);
	objectsSelectionPreviewSprite.moveTo(new Point(
		center.x + previewDelta.x,
		center.y + previewDelta.y,
	));
}

function getRigidBodyRect(rigidBody) {
	const currentEntity = storage.entities?.[currentEntityIndex];
	if (!currentEntity) return new Rectangle();
	return new Rectangle(
		wallEditorPreviewSprite.x + (rigidBody.x - currentEntity.x) * scale,
		wallEditorPreviewSprite.y + (rigidBody.y - currentEntity.y) * scale,
		rigidBody.width * scale,
		rigidBody.height * scale,
	)
}

function drawEntityWalls(canvasContext) {
	const currentEntity = storage.entities?.[currentEntityIndex];
	if (!currentEntity) return;
	currentEntity.rigidBodies.forEach((rigidBody, index) => {
		if(index === currentWallIndex) return;
		const rect = getRigidBodyRect(rigidBody);
		rect.diagonals = true;
		rect.render(canvasContext);
	});
}

resize(document.getElementById('ObjectsSelectionPreview'));
resize(document.getElementById('WallEditor'));// .load()
loader.onload = (image) => {
	objectsSelectionPreviewSprite = new Sprite(loader, new Rectangle(0, 0, image.width, image.height));
	wallEditorPreviewSprite = new Sprite(loader, new Rectangle(0, 0, image.width, image.height));
	moveToCenter();
	createPreviewImages();
	createPreviewImages(document.getElementById('wallPreview'));
};

if (!storage.entities) {
	showScreen('jsonDataLoading');
}
if (storage.currentScreen) {
	showScreen(storage.currentScreen);
} else {
	showScreen('selectionOfObjects');
}

ObjectsSelectionPreview.canvas.addEventListener('click', (event) => {
	isMouseDown = false;
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
});
ObjectsSelectionPreview.canvas.addEventListener('wheel', (event) => {
	event.preventDefault();
	event.stopPropagation();

	if (!objectsSelectionPreviewSprite) return;
	previewDelta.x = event.deltaX;
	previewDelta.y = event.deltaY;
	objectsSelectionPreviewSprite.moveBy(previewDelta.invert());
	previewDeltaGrid.add(previewDelta);
	drawingRect.moveBy(previewDelta);
});
ObjectsSelectionPreview.canvas.addEventListener('mousedown', (event) => {
	const {left, top} = ObjectsSelectionPreview.canvas.getBoundingClientRect();
	cursor.moveTo(new Point(event.offsetX - left, event.offsetY - top));
	isMouseDown = true;
	dragStart = new Vector2(cursor.x, cursor.y);
	// Проверяем находится ли курсор на маркере
	if (checkCursorOnMarker()) return;
	// Определяем на какой объект кликнули
	currentEntityIndex = storage.entities.findIndex((object) => {
		const entity = createEntityFromObject(object);
		const collider = new Collider('wall', entity.toRectangle());
		return collider.intersects(cursor);
	});
	if (currentEntityIndex === -1) {
		currentEntityIndex = null;
		drawingRect.resize(0, 0);
		drawingRect.moveTo(new Point(0, 0));
		return;
	}

	if (currentEntityIndex !== null) {
		ObjectsSelectionPreview.canvas.style.cursor = 'move';
		const currentEntity = createEntityFromObject(storage.entities[currentEntityIndex]);
		drawingRect.moveTo(currentEntity.point);
		drawingRect.resize(currentEntity.width, currentEntity.height);
	}
	drawingStartPoint.moveTo(cursor.point);
});
ObjectsSelectionPreview.canvas.addEventListener('mousemove', (event) => {
	const {left, top} = ObjectsSelectionPreview.canvas.getBoundingClientRect();
	cursor.moveTo(new Point(event.offsetX - left, event.offsetY - top));
	dragStop = new Vector2(cursor.x, cursor.y);
	if (!isMouseDown) {
		ObjectsSelectionPreview.canvas.style.cursor = 'default';
	}

	if (currentEntityIndex !== null) {
		Object.entries(markers).forEach(([key, marker]) => {
			if (marker.intersects(cursor)) {
				ObjectsSelectionPreview.canvas.style.cursor = ['topCenter', 'bottomCenter'].includes(key) ? 'ns-resize' : 'ew-resize';
			}
		});
	}

	if (isMouseDown) {
		dragDiff = Vector2.diff(dragStop, dragStart);
		dragDiff.x = Math.round(dragDiff.x);
		dragDiff.y = Math.round(dragDiff.y);
	} else {
		drawingStartPoint.moveTo(cursor.point);
	}

	const currentEntity = storage.entities[currentEntityIndex];

	if (!currentEntity) {
		let {x, y, width, height} = getRectBetweenPoints(
			cursor.point,
			drawingStartPoint,
		);
		drawingRect.moveTo(new Point(x, y));
		drawingRect.resize(width, height);

		return;
	}

	const rect = createEntityFromObject(currentEntity);
	let x = rect.x;
	let y = rect.y;
	let width = rect.width;
	let height = rect.height;
	switch (currentMarker) {
		case 'topCenter':
			y = rect.y + dragDiff.y;
			height = Math.max(rect.height - dragDiff.y, 1);
			break;
		case 'bottomCenter':
			height = Math.max(rect.height + dragDiff.y, 1);
			break;
		case 'leftCenter':
			x = rect.x + dragDiff.x;
			width = Math.max(rect.width - dragDiff.x, 1);
			break;
		case 'rightCenter':
			width = Math.max(rect.width + dragDiff.x, 1);
			break;
	}

	const widthRest = (width % scaleObjectsSelectionPreview);
	const heightRest = (height % scaleObjectsSelectionPreview);

	switch (currentMarker) {
		case 'topCenter':
			y += heightRest;
			break;
		case 'leftCenter':
			x += widthRest;
			break;
	}
	drawingRect.resize(width - widthRest, height - heightRest);
	drawingRect.moveTo(new Point(x, y));

	// Перемещение
	if (!currentMarker) {
		drawingRect.moveBy(new Vector2(dragDiff.x + widthRest, dragDiff.y + heightRest));
	}

});
ObjectsSelectionPreview.canvas.addEventListener('mouseup', () => {
	ObjectsSelectionPreview.canvas.style.cursor = 'default';
	// console.log('========================');
	dragDiff.x = 0;
	dragDiff.y = 0;
	isMouseDown = false;

	if (drawingRect.width === 0 || drawingRect.height === 0) return;
	const entity = getEntityForSave({
		x: drawingRect.x * scaleObjectsSelectionPreview + objectsSelectionPreviewSprite.x,
		y: drawingRect.y * scaleObjectsSelectionPreview + objectsSelectionPreviewSprite.y,
		width: drawingRect.width * scaleObjectsSelectionPreview,
		height: drawingRect.height * scaleObjectsSelectionPreview,
	});
	const savingEntity = getEntityForSave(entity);

	if (currentEntityIndex !== null) {
   // Сохраняем изменения
		storage.entities[currentEntityIndex] = savingEntity;
	} else {
		// Создание новых объектов
		storage.entities.push(savingEntity);
		currentEntityIndex = storage.entities.length - 1;
	}
	createPreviewImages();
});

WallEditor.canvas.addEventListener('click', (event) => {
	isMouseDown = false;
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
	console.log('click')
});
WallEditor.canvas.addEventListener('wheel', (event) => {
	event.preventDefault();
	event.stopPropagation();

	if (!wallEditorPreviewSprite) return;
	wallEditorDelta.x -= event.deltaX;
	wallEditorDelta.y -= event.deltaY;
	wallDrawingRect.moveBy(new Vector2(-event.deltaX, -event.deltaY));
});
WallEditor.canvas.addEventListener('mousedown', (event) => {
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
	drawingStartPoint.moveTo(cursor.point);
	dragStart = new Vector2(cursor.x, cursor.y);
	isMouseDown = true;
	// Проверяем находится ли курсор внутри какой-либо стены
	const currentEntity = storage.entities?.[currentEntityIndex];
	if (!currentEntity) return;
	// Проверяем находится ли курсор на маркере
	if (checkCursorOnMarker()) return;
	// Определяем на какую стену кликнули
	currentWallIndex = currentEntity.rigidBodies.findIndex((body) => {
		const entity = getRigidBodyRect(body);
		const collider = new Collider('wall', entity);
		return collider.intersects(cursor);
	});
	if (currentWallIndex === -1) {
		currentWallIndex = null;
		wallDrawingRect.resize(0, 0);
		wallDrawingRect.moveTo(new Point(0, 0));
	} else {
		const currentWall = getRigidBodyRect(currentEntity.rigidBodies[currentWallIndex]);
		wallDrawingRect.resize(currentWall.width, currentWall.height);
		wallDrawingRect.moveTo(new Point(currentWall.x, currentWall.y));
	}
});
WallEditor.canvas.addEventListener('mousemove', (event) => {
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
	dragStop = new Vector2(cursor.x, cursor.y);
	if (isMouseDown) {
		dragDiff = Vector2.diff(dragStop, dragStart);
		dragDiff.x = Math.round(dragDiff.x);
		dragDiff.y = Math.round(dragDiff.y);
	} else {
		WallEditor.canvas.style.cursor = 'default';
		drawingStartPoint.moveTo(cursor.point);
	}
	if (currentEntityIndex === null) return;
	Object.entries(markers).forEach(([key, marker]) => {
		if (marker.intersects(cursor)) {
			WallEditor.canvas.style.cursor = ['topCenter', 'bottomCenter'].includes(key) ? 'ns-resize' : 'ew-resize';
		}
	});

	let x;
	let y;
	let width;
	let height;
	let widthRest = 0;
	let heightRest = 0;
	if (currentWallIndex === null) {
		const rect = getRectBetweenPoints(
			cursor.point,
			drawingStartPoint,
		);
		x = rect.x;
		y = rect.y;
		width = rect.width;
		height = rect.height;
	}

	const rigidBody = storage.entities[currentEntityIndex].rigidBodies[currentWallIndex];
	if (rigidBody) {
		const rect = getRigidBodyRect(rigidBody);
		x = rect.x;
		y = rect.y;
		width = rect.width;
		height = rect.height;

		switch (currentMarker) {
			case 'topCenter':
				y = rect.y + dragDiff.y;
				height = Math.max(rect.height - dragDiff.y, 1);
				break;
			case 'bottomCenter':
				height = Math.max(rect.height + dragDiff.y, 1);
				break;
			case 'leftCenter':
				x = rect.x + dragDiff.x;
				width = Math.max(rect.width - dragDiff.x, 1);
				break;
			case 'rightCenter':
				width = Math.max(rect.width + dragDiff.x, 1);
				break;
		}

		widthRest = (width % scale);
		heightRest = (height % scale);

		switch (currentMarker) {
			case 'topCenter':
				y += heightRest;
				break;
			case 'leftCenter':
				x += widthRest;
				break;
		}
	}



	wallDrawingRect.moveTo(new Point(x, y));
	wallDrawingRect.resize(width - widthRest, height - heightRest);

	// Перемещение
	if (currentMarker === null && currentWallIndex !== null) {
		wallDrawingRect.moveBy(new Vector2(dragDiff.x + widthRest, dragDiff.y + heightRest));
	}
});
WallEditor.canvas.addEventListener('mouseup', (event) => {
	createPreviewImages(document.getElementById('wallPreview'));
	isMouseDown = false;
	dragDiff.x = 0;
	dragDiff.y = 0;
	cursor.moveTo(new Point(event.offsetX, event.offsetY));
	const currentEntity = storage.entities?.[currentEntityIndex];
	if (!currentEntity) return;

	const width = Math.round(wallDrawingRect.width / scale);
	const height = Math.round(wallDrawingRect.height / scale);
	if (width === 0 || height === 0) return;
	if (currentWallIndex === null) {
		// Создание новых стен
		currentEntity.rigidBodies.push({
			x: Math.round((wallDrawingRect.x - wallEditorPreviewSprite.x) / scale + currentEntity.x),
			y: Math.round((wallDrawingRect.y - wallEditorPreviewSprite.y) / scale + currentEntity.y),
			width: Math.round(wallDrawingRect.width / scale),
			height: Math.round(wallDrawingRect.height / scale),
		})
	} else {
		// Сохраняем изменения
		storage.entities[currentEntityIndex].rigidBodies[currentWallIndex] = {
			x: Math.round((wallDrawingRect.x - wallEditorPreviewSprite.x) / scale + currentEntity.x),
			y: Math.round((wallDrawingRect.y - wallEditorPreviewSprite.y) / scale + currentEntity.y),
			width: Math.round(wallDrawingRect.width / scale),
			height: Math.round(wallDrawingRect.height / scale),
		}
	}
});

ObjectsSelectionPreview.addProcessInput(() => {
	if (InputManager.isPressed(OBJECT_EDITOR_KEYS.BACKSPACE)) {
		deleteCurrentEntity();
		createPreviewImages();
	}
});
ObjectsSelectionPreview.addProcessUpdate(() => {
	if (!objectsSelectionPreviewSprite) return;
	objectsSelectionPreviewSprite.resize(parseInt(loader.resource.width) * scaleObjectsSelectionPreview, parseInt(loader.resource.height) * scaleObjectsSelectionPreview);
});
ObjectsSelectionPreview.addProcessRender((canvasContext) => {
	if (!objectsSelectionPreviewSprite) return;
	objectsSelectionPreviewSprite.render(canvasContext);
	objectsSelectionPreviewSprite.bound.render(canvasContext, {style: "grey"});
	drawObjectsBounds(canvasContext);
	drawingRect.render(canvasContext, {style: 'red'});
	if(!currentEntity) return;
	drawMarkers(canvasContext);
});

WallEditor.addProcessInput(() => {
	// Смещаем текст в центр canvas
	chooseText.moveTo(new Point(
		WallEditor.canvas.width / 2,
		WallEditor.canvas.height / 2,
	));
	if (InputManager.isPressed(OBJECT_EDITOR_KEYS.BACKSPACE)) {
		createPreviewImages(document.getElementById('wallPreview'));
		deleteCurrentWall();
	}
});
WallEditor.addProcessUpdate(() => {
	chooseText.update();
	if (currentEntityIndex === null) {
		chooseText.show();
	} else {
		chooseText.hide();
	}
	if (!wallEditorPreviewSprite) return;
	if (currentEntityIndex !== null) {
		wallEditorPreviewSprite.show();
	} else {
		wallEditorPreviewSprite.hide();
	}

	const currentEntity = storage.entities?.[currentEntityIndex];
	if (!currentEntity) return;
	wallEditorPreviewSprite.init(loader, new Rectangle(currentEntity.x, currentEntity.y, currentEntity.width, currentEntity.height));
	wallEditorPreviewSprite.resize(currentEntity.width * scale, currentEntity.height * scale);
	wallEditorPreviewSprite.moveTo(new Point(
		(WallEditor.canvas.width / 2 - wallEditorPreviewSprite.width / 2) + wallEditorDelta.x,
		(WallEditor.canvas.height / 2 - wallEditorPreviewSprite.height / 2) + wallEditorDelta.y,
	));
});
WallEditor.addProcessRender((canvasContext) => {
	chooseText.render(canvasContext);
	if (!wallEditorPreviewSprite || currentEntityIndex === null) return;
	wallEditorPreviewSprite.render(canvasContext);
	wallEditorPreviewSprite.bound.render(canvasContext, {style: "grey"});
	drawEntityWalls(canvasContext);
	wallDrawingRect.render(canvasContext, {style: 'red'});
	if (currentWallIndex === null) return;
	drawMarkers(canvasContext, wallDrawingRect);
});

document.addEventListener('DOMContentLoaded', () => {
	const elFileInputJson = document.getElementById('fileInputJson');
	const elFileInputImage = document.getElementById('fileInputImage');
	const elCreateJSON = document.getElementById('createJSON');
	const elDownloadJSON = document.getElementById('downloadJSON');
	const elEditorScalePlus = document.getElementById('editorScalePlus');
	const elEditorScaleMinus = document.getElementById('editorScaleMinus');
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
	elPreviewScalePlus.addEventListener('click', previewScaleHandler.bind(null, 'previewScalePlus'));
	elPreviewScaleMinus.addEventListener('click', previewScaleHandler.bind(null, 'previewScaleMinus'));
	elCreateJSON.addEventListener('click', () => createJSON());
	elDownloadJSON.addEventListener('click', () => downloadJSON());
	elFileInputImage.addEventListener('change', async (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				// Загружаем изображение после чтения файла
				storage.image = reader.result;
				storage.imageName = getFileNameWithoutExtension(file.name);
				loader.url = reader.result;
				loader.load().then(() => {
					console.log('Image loaded #1');
				});
				storage.json = undefined;
			};
		}
	});
	elFileInputJson.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function () {
				// Загружаем изображение после чтения файла
				const jsonRaw = JSON.parse(reader.result);

				if (jsonRaw?.meta?.app === 'https://www.aseprite.org/') {
					const {slices} = jsonRaw.meta;
					if (slices) {
						storage.entities = slices
							.flatMap(slice => slice.keys)
							.flatMap(key => key.bounds)
							.map(obj => new Entity(obj.x, obj.y, obj.w, obj.h));
					}
					showScreen('selectionOfObjects');
					return;
				}
				const {entities} = jsonRaw;
				storage.entities = entities.map((entity) => {
					const {x, y, width, height, rigidBodies} = entity;
					return new Entity(x, y, width, height, rigidBodies);
				});
				createPreviewImages();
				createPreviewImages(document.getElementById('wallPreview'));
				showScreen('selectionOfObjects');
			};
		}
	});

	// получаем данные из хранилища
	const {image} = storage;

	if (!image) {
		showScreen('imageLoading');
		return;
	}

	loader.url = image;
	loader.load()
		.then(() => console.log('Image loaded #2'))
		.catch(console.error)
	setTimeout(() => {
		resize(document.getElementById('ObjectsSelectionPreview'));
		resize(document.getElementById('WallEditor'));
	}, 5);
});

window.showScreen = showScreen;
window.addEventListener("resize", function () {
	resize(document.getElementById('ObjectsSelectionPreview'));
	resize(document.getElementById('WallEditor'));
});
window.reset = () => {
	storage.clearAll();
}
