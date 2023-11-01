'use strict';

import {Point, Rectangle, create2DArray, Collider} from '../../GameEngine';
import {astar, Graph} from './astart.js';

export class PathFinder {

	// Параметры сетки
	#tileSize;
	#tileCounts;
	#sectionCount;
	// коллайдеры
	#colliders;
	// точка отрисовки сетки
	#point;
	// граф
	#graph;
	// сетка
	#grid;
	// координаты стен
	#walls;
	// координаты путей
	#pathways;
	//
	#path;

	constructor(tileCounts,  tileSize = 16, sectionCount = 1) {
		// размер ячейки сетки
		this.tileSize = tileSize;
		this.tileCounts = tileCounts;
		this.sectionCount = sectionCount;
		// Расположение сетки относительно карты
		this.#point = new Point(0, 0);
		this.#colliders = new Set();
		this.#walls = new Set();
		this.#pathways = new Set();
	}

	get tileSize() {
		return this.#tileSize;
	}
	get walls() {
		return this.#walls;
	}
	get pathways() {
		return this.#pathways;
	}
	set tileSize(value) {
		if(typeof value !== "number") throw new TypeError('value must be number');
		if(value < 0) throw new RangeError('value must be greater than 0');
		this.#tileSize = value;
	}
	set tileCounts(value) {
		if (!(value instanceof Point)) throw new TypeError('value must be instance of Point');
		if (value.x < 0) throw new RangeError('Point.x must be greater than 0');
		if (value.y < 0) throw new RangeError('Point.y must be greater than 0');
		this.#tileCounts = value;
	}
	set sectionCount(value) {
		if(typeof value !== "number") throw new TypeError('value must be number');
		if(value <= 0) throw new RangeError('value must be greater than 0');
		this.#sectionCount = value;
	}

	get #cellCountX() {
		return this.#tileCounts.x * this.#sectionCount;
	}
	get #cellCountY() {
		return this.#tileCounts.y * this.#sectionCount;
	}
	get cellSize() {
		return this.#tileSize / this.#sectionCount;
	}

	#createGrid() {
		const colliders = [...this.#colliders];
		const arr2d = create2DArray(this.#cellCountX, this.#cellCountY, 1);
		for (let x = 0; x < arr2d.length; x++) {
			for (let y = 0; y < arr2d[x].length; y++) {
				const rect = new Rectangle(
					x * this.cellSize + this.#point.x,
					y * this.cellSize + this.#point.y,
					this.cellSize,
					this.cellSize,
				);
				if(colliders.some(collider => {
					return Collider.Rectangle2Rectangle(rect, collider);
				})) {
					this.#walls.add(new Point(x, y));
					arr2d[x][y] = 0;
				} else {
					this.#pathways.add(new Point(x, y));
				}
			}
		}

		this.#graph = new Graph(arr2d);
		this.#grid = this.#graph.grid;
	}
	#getGridRect() {
		if (this.#grid.length === 0) return new Rectangle(0, 0, 0, 0);
		return new Rectangle(this.#point.x, this.#point.y, this.#grid.length * this.cellSize, this.#grid[0].length * this.cellSize);
	}
	#drawGrid(canvasContext) {
		if (!this.#grid?.length) return;
		// Задаем цвет и толщину линии
		canvasContext.lineWidth = .5;
		canvasContext.strokeStyle = "blue";
		const rect = this.#getGridRect();
		// Рисуем горизонтальные линии
		for (let i = 0; i < this.#grid[0].length; i++) {
			const y = i * this.cellSize + rect.y;
			canvasContext.beginPath();
			canvasContext.moveTo(rect.x, y);
			canvasContext.lineTo(rect.x + rect.width, y);
			canvasContext.stroke();
		}
		// Рисуем вертикальные линии
		for (let i = 0; i < this.#grid.length; i++) {
			const x = i * this.cellSize + rect.x;
			canvasContext.beginPath();
			canvasContext.moveTo(x, rect.y);
			canvasContext.lineTo(x, rect.y + rect.height);
			canvasContext.stroke();
		}
	}
	#drawWall(canvasContext) {
		if(!this.#graph?.nodes?.length) return;
		canvasContext.fillStyle = "black";
		this.#graph.nodes.forEach((node) => {
			if(!node.isWall()) return;
			const x = node.x * this.cellSize + this.#point.x;
			const y = node.y * this.cellSize + this.#point.y;

			canvasContext.fillRect(x, y, this.cellSize, this.cellSize);
		});
	}
	#drawPath(canvasContext) {
		if(!this.#path?.length) return;
		canvasContext.fillStyle = "red";
		this.#path.forEach(item => {
			const point = this.#getPointOnGrid(item);
			const x = point.x * this.cellSize + this.#point.x;
			const y = point.y * this.cellSize + this.#point.y;

			canvasContext.fillRect(x, y, this.cellSize, this.cellSize);
		});
	}
	#getPointOnGrid(point) {
		if(!(point instanceof Point)) throw new TypeError('point must be instance of Point');
		const x = Math.round((point.x - this.#point.x) / this.cellSize);
		const y = Math.round((point.y - this.#point.y) / this.cellSize);
		return new Point(x, y);
	}
	#getPointOnMap(point) {
		if(!(point instanceof Point)) throw new TypeError('point must be instance of Point');
		const x = point.x * this.cellSize + this.#point.x;
		const y = point.y * this.cellSize + this.#point.y;
		return new Point(x, y);
	}

	init() {
		this.#createGrid();
	}
	addColliders(colliders) {
		if(!(colliders instanceof Set)) throw new TypeError('colliders must be instance of Set');
		this.#colliders = colliders;
	}
	drawPath(path) {
		this.#path = path;
	}
	resize(tileSize, sectionCount = this.#sectionCount) {
		this.tileSize = tileSize;
		this.sectionCount = sectionCount;
	}
	processInput() {

	}
	update() {

	}
	render(canvasContext) {
		// this.#drawGrid(canvasContext);
		// this.#drawWall(canvasContext);
		this.#drawPath(canvasContext);
	}
	getRandomAvailablePoint() {
		const randomIndex = Math.floor(Math.random() * this.#pathways.size);
		const point = [...this.#pathways][randomIndex];
		return this.#getPointOnMap(point);
	}

	searchPath(start, end) {
		const startOnGrid = this.#getPointOnGrid(start);
		const endOnGrid = this.#getPointOnGrid(end);
		const startNode = this.#grid[startOnGrid.x][startOnGrid.y];
		const endNode = this.#grid[endOnGrid.x][endOnGrid.y];
		return astar.search(this.#graph, startNode, endNode)
			.map(item => this.#getPointOnMap(new Point(item.x, item.y)));
	}
}
