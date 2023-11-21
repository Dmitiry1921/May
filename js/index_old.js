/**
 * Created by Dima101 on 24.04.2016.
 * Updated by Dima101 on 05.06.2023.
 */

import gameEngineConfig from '../config/gameEngine.config.json' assert {type: "json"};

import {KEYS, microtasksScope} from "../src/common";
import {levelZero} from "../src/levels/Zero"

import _spt from './spt.js';
import _itms from './itms.js';
import _lvl from './lvl.js';
import _tile from './tile.js';
import storage from "../GameEngine/Storage/Storage.js";
import {ImageLoader, InputManager, GameEngine, MobMicroTask} from "../GameEngine";
import {getRandomInt} from "../GameEngine/utils";

const gameEngine = new GameEngine(gameEngineConfig);
// TODO Добавляем manager ввода в движок
// gameEngine.addProcessInput(InputManager.processInput);


//Позиция персонажа (боком, лицом, спиной..)
const _com = {top: 3, left: 1, right: 2, bottom: 0};
let _Hero;
let _Interface;
const _Mobs = []; //Объявляем переменные.

async function SpriteLoader() {
	// const alUrls = Object.values(_spt).flatMap((item) => item.url);
	// const images = await ImageLoader.all(alUrls);
	// images.forEach((image) => {
	// 	Object.keys(_spt).forEach(key => {
	// 		const item = _spt[key];
	// 		if (!item.url.some(url => image.src.includes(url))) return;
	// 		const index = item.url.findIndex((url) => image.src.includes(url))
	// 		item.dom[index] = image;
	// 	});
	// });
}

// TODO Class Hook
function addHookAfterLoadMob(hook) {
	if (typeof hook !== 'string') {
		throw new Error('Hook must be a string')
	}
	storage.afterLoadMobHooks = storage.afterLoadMobHooks || [];
	storage.afterLoadMobHooks.push(hook);
}

function runHookAfterLoadMob() {
	(storage.afterLoadMobHooks || []).forEach(hook => {
		const microTask = new MobMicroTask(hook);
		microTask.run(microtasksScope, getContextForMicrotask());
	})
	storage.afterLoadMobHooks = [];
}

/**
 * Created by Dima101 on 22.04.2016.
 */
var _Map = {
	setting: {
		map: {
			count: {
				x: 40,
				y: 22
			} //Размеры карты.
		},
		tile: {
			count: 0 //Количество тайлов в массиве.
		}, //Параметры тайлов
		canvas: {
			dom: null //Наш canvas.
		},
		elem: {
			canvasID: "myCanvas"
		},
		flag: {
			start: true
		},
		overlay: [] //Массив с перекрытиями
	},
	//TODO Level.render() -> Map.render() -> Layer.render()
	overlay: function () {
		var sett = this.setting,
			map = sett.overlay;
		for (var i in map) {
			var itm = map[i];
			sett.canvas.dom.drawImage(itm[0], itm[1], itm[2], itm[3], itm[4], itm[5], itm[6], itm[7], itm[8]);
		}
	}, //Функция рисования поверх персонажа.
	//TODO Level.tileLoader
	// TODO Level.tileLoader
	async tileLoader() {
		const alUrls = Object.entries(_tile)
			.filter(([key]) => !['defMap', 'default', 'param'].includes(key))
			.map(([, value]) => value.url);
		const images = await ImageLoader.all(alUrls);
		// images.forEach((image) => {
			// const tileKey = Object.keys(_tile).find((key) => image.src.includes(_tile[key].url));
			// _tile[tileKey].dom = image;
		// });
	},//Функция загружает тайл карты.
	//TODO GameEngine.canvasSetting
	canvasSetting: function () {
		var el = this.setting.elem,
			// map = this.setting.map,
			ctx = this.setting.canvas;
		// width, height;
		ctx.dom = document.getElementById(el.canvasID).getContext('2d');
		// width = _tile.param.w * map.count.x;
		// height = _tile.param.h * map.count.y;
	},
	//TODO Level.draw() -> Map.draw() -> Layer.draw()
	draw: function () {
		var map = _lvl[storage._lvl].map, //Игровая карта
			cns = this.setting.canvas.dom,
			tile = _tile;

		this.saveStat(); //Сохраняем пользовательские данные и уровень в целом.
		this.setting.overlay = []; //Записываем данные для отрисовки поверх персонажа.

		for (var x in map) {
			for (var y in map[x]) {
				for (var l in map[x][y]) {
					var j = map[x][y][l],
						dx = x * tile.param.w,
						dy = y * tile.param.h,
						itm, id, ti;
					if (j !== undefined) {
						id = j.id;
						ti = j.tile;
						if (ti !== tile.defMap && ti !== undefined) {
							itm = tile[ti].map[id];
							if (id !== tile.default && itm !== undefined) {
								if (itm.overlay === 1) {
									this.setting.overlay.push([tile[ti].dom, itm.x, itm.y, tile.param.w, tile.param.h, dx, dy, tile.param.w, tile.param.h]);
								} else cns.drawImage(tile[ti].dom, itm.x, itm.y, tile.param.w, tile.param.h, dx, dy, tile.param.w, tile.param.h);
							}
						}
					}
				}
			}
		}
	},
	// TODO
	saveStat: function () {
		//Сохраняем состояние уровня каждый раз когда вызвана функция.
		storage[storage._lvl] = {_mobs: JSON.parse(JSON.stringify(_Mobs)), _map: _lvl[storage._lvl].map};
		storage._hero = _Hero;
	},
	// TODO CharacterArray.findCharacter
	searchNPS: function (name) {
		//выполняем поиск НПС по его имени
		return Object.values(_Mobs).find((mob) => mob.type === "nps" && mob.options.name === name);
	},
	// TODO Level.load()
	levelSet: function (lvl) {
		storage.stopAutoSave();
		gameEngine.stopLoop(); //останавливаем игровой процесс
		_Mobs.length = 0;

		//Загружаем всех персонажей, NPS и противников, которые есть на карте.
		_Interface = !_Interface ? new Interface() : _Interface;

		Promise.all([
			_Map.tileLoader(), //Загружаем спрайт карты.
			SpriteLoader(), // Загружаем спрайты персонажей
		])
			.then(() => {
				createMobs(lvl);
				// if (storage[lvl] === null) {
				//   createMobs(lvl);
				// } else {
				//   mapInit(lvl);
				//   mobInit(lvl);
				//   heroInit(lvl);
				// }
				_Map.canvasSetting(); //Настраиваем canvas.
				// _Map.tileLoader().then(_gameSet.bind(this, loop));
				gameEngine.setLoop(loop);
				runHookAfterLoadMob();
			})
			.catch(console.error)
			.finally(() => {
				storage.startAutoSave();
				storage._lvl = lvl;
			});
	},
	// CharacterArray.getLengthByType
	countEnemy: function () {
		var j = 0;
		for (var id in _Mobs) {
			var mob = _Mobs[id];
			if (mob.type !== 'enemy') continue;
			j++
		}
		return j;
	}
};

var Enemy = function (type, sid, sx, sy, x, y, option) {
	/**
	 * @x - клетка по оси X
	 * @y - клетка по оси Y
	 * @sy - координата на спрайт карте Y
	 * @sx - координата на спрайт карте X
	 * @sid - !!!!СПРАЙТ ID в зависимости от этого спрайта у нас и будет противник.
	 * @type  enemy || nps || animal
	 */
	this.type = 'enemy'; //Тип спрайта
	this.doit = true; //Флаг какого либо действия персонажа.
	this.actFlag = false; //Флаг говорящий о том действие будет выполняться..
	this.sid = null; //Спрайт id присваиваться при создании персонажа.
	this.sx = null; //Координата на спрайт карте.
	this.sy = null; //Координата на спрайт карте.
	this.cell = {
		x: null,
		y: null
	}; //Координата на карте.
	this.x = null;  //Координата в игровом пространстве.
	this.y = null; //Координата в игровом пространстве.
	this.width = null; //Габариты персонажа.
	this.height = null; //Габариты персонажа.
	this.memory = {
		x: null,
		y: null,
		pos: 'bottom'
	};//Память противника.
	this.frame = {
		map: [0, 1, 2, 1],//Показывать кадры в порядке.
		msp: 0,//Счетчик задержки
		speed: 3,//Задержка показа кадров.
		im: 0, //Кадр отображаемый в текущий момент.
		status: {
			pos: {
				x: 3,
				y: -6
			}, //положение статуса относительно персонажа.
			w: 26,
			h: 4
		} //кол-во жизней персонажа
	}; //Параметры кадров.
	this.path = {
		mem: {
			x: null,
			y: null
		}, //Храним тут координату предыдущей клетки.
		wait: false, //Ожидание.
		timer: true, //Доступность таймера.
		delay: 10000, //Максимальное время остановки персонажа на одном месте.
		cell: 0, //яЯчейка на маршруте.
		step: 0, //текущий шаг на этой ячейке.
		arr: [], //Путь по которому будет двигаться персонаж.
		callback: null //Эта функция персонаж выполнить после того как дошел до места.
	}; //Точка куда персонаж идет в этот момент.
	this.options = {
		life: true, //Этот персонаж обрабатываем события связанные с ним Да\Нет
		visibility: true, //Рисовать персонажа на карте или нет.
		name: null, //Имя персонажа.
		code: null,
		type: 'enemy', //Определяем тип в зависимости от типа. Персонаж ведет себя по-разному.
		face: null, //Аватарка персонажа если это например NPS
		max: {
			health: 4 //Очки жизни
		}, //максимумы.
		speed: 1,//скорость
		health: 4, //Очки жизни
		radius: 1, //Радиус.
		damage: 1 //Урон по игроку..
	};
	this.actions = function () {
		if (this.actFlag && this.options.code != null) {
			_Hero.can.walk = false;
			const microTask = new MobMicroTask(this.options.code);
			microTask.run(microtasksScope, getContextForMicrotask());
		}
	}; //Выполняем заданное действие.
	this.init = function (type, sid, sx, sy, x, y, option) {
		this.sid = sid;
		this.type = type;
		this.sx = sx;
		this.sy = sy;
		this.cell.x = x;
		this.cell.y = y;
		this.x = x * _tile.param.w;
		this.y = y * _tile.param.h;
		this.width = _spt[type].frame.w;
		this.height = _spt[type].frame.h;
		for (var id in option) {
			this.options[id] = option[id];
		}
	};
	this.life = function () {
		this.movePath(); //Перемещение перса.
		this.actions(); //Запрограмирование действие.
		this.attack(); //Нападаем на игрока если наш персонаж типа enemy
	};
	this.attack = function () {
		if (this.type === 'enemy' && _Hero.nps === null) { //Если персонаж не взаимодействует с НПС тогда может его атаковать.
			var e = {w: this.width, h: this.height, x: this.x, y: this.y}, //enemy
				h = {w: _spt.hero.frame.w, h: _spt.hero.frame.h, x: _Hero.memory.x, y: _Hero.memory.y}; //hero
			//Проверяем столкнулся ли я с игроком
			if (_Hero.isCollision(e.x, e.y, e.w, e.h, h.x, h.y, h.w, h.h)) {
				var $this = this;
				//Наносим игроку какое-то кол-во урона.
				if ($this.doit) {
					// TODO доделать вибрацию геймпада
					// InputManager.getGamePad(0)?.vibrate();
					$this.doit = false;
					_Hero.nps = null;
					_Hero.options.health = _Hero.options.health > 0 ? _Hero.options.health - this.options.damage : 0;

					setTimeout(function () {
						$this.doit = true;
					}, 700);
				}

			}
		}
	};
	this.findPath = function (world, pathStart, pathEnd) {
		// A* Pathfinding for HTML5 Canvas Tutorial
		// by Christer (McFunkypants) Kaitila
		// http://www.mcfunkypants.com
		// http://twitter.com/McFunkypants
		// Based on Edsger Dijkstra's 1959 algorithm and work by:
		// Andrea Giammarchi, Alessandro Crugnola, Jeroen Beckers,
		// Peter Hart, Nils Nilsson, Bertram Raphael
		// Permission is granted to use this source in any
		// way you like, commercial or otherwise. Enjoy!
		// world is a 2d array of integers (eg world[10][15] = 0)
		// pathStart and pathEnd are arrays like [5,10]
		// Эта функция взята мной из интернета и не много изменена. Права на нее я не заявляю она является доступной всем на сайте: http://www.websketches.ru/blog/algoritm-poiska-pitu-v-brauzernih-igrax
		var abs = Math.abs;
		var max = Math.max;
		var pow = Math.pow;
		var sqrt = Math.sqrt;
		var maxWalkableTileNum = 0; //Значение wall проходимости на карте.

		var worldWidth = world.length;
		var worldHeight = world[0].length;
		var worldSize = worldWidth * worldHeight;

		var distanceFunction = ManhattanDistance;
		var findNeighbours = function () {
		}; // empty

		function ManhattanDistance(Point, Goal) {
			return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
		}

		function Neighbours(x, y) {
			var N = y - 1,
				S = y + 1,
				E = x + 1,
				W = x - 1,
				myN = N > -1 && canWalkHere(x, N),
				myS = S < worldHeight && canWalkHere(x, S),
				myE = E < worldWidth && canWalkHere(E, y),
				myW = W > -1 && canWalkHere(W, y),
				result = [];
			if (myN)
				result.push({x: x, y: N});
			if (myE)
				result.push({x: E, y: y});
			if (myS)
				result.push({x: x, y: S});
			if (myW)
				result.push({x: W, y: y});
			findNeighbours(myN, myS, myE, myW, N, S, E, W, result);
			return result;
		}

		function canWalkHere(x, y) {
			var world = _lvl[storage._lvl].map,
				bool = false;
			if (world[x] != null && world[x] !== undefined) {
				if (world[x][y] != null && world[x][y] !== undefined) {
					for (var l in world[x][y]) {
						var itm = world[x][y][l];
						if (itm.id == null) continue;
						if (itm.tile == null) continue;
						var tile = _tile[itm.tile].map[itm.id];
						if (tile.wall === maxWalkableTileNum) {
							//Столкновение.
							bool = true;
						} else {
							bool = false;
							break;
						}
					}
				}
			}
			return bool;
		}

		// function canWalkHere(x, y) {
		//   const world = _lvl[storage._lvl].map;
		//
		//   if (world[x]?.[y]) {
		//     return Object.values(world[x][y]).some(itm => {
		//       if (!itm.id || !itm.tile) return false;
		//       const tile = _tile[itm.tile].map[itm.id];
		//       return tile.wall === maxWalkableTileNum;
		//     });
		//   }
		//
		//   return false;
		// }

		function Node(Parent, Point) {
			return {
				Parent: Parent,
				value: Point.x + (Point.y * worldWidth),
				x: Point.x,
				y: Point.y,
				f: 0,
				g: 0
			};
		}

		function calculatePath() {
			var mypathStart = Node(null, {x: pathStart[0], y: pathStart[1]});
			var mypathEnd = Node(null, {x: pathEnd[0], y: pathEnd[1]});
			var AStar = new Array(worldSize);
			var Open = [mypathStart];
			var Closed = [];
			var result = [];
			var myNeighbours;
			var myNode;
			var myPath;
			var length, max, min, i, j;
			while (length = Open.length) {
				max = worldSize;
				min = -1;
				for (i = 0; i < length; i++) {
					if (Open[i].f < max) {
						max = Open[i].f;
						min = i;
					}
				}
				myNode = Open.splice(min, 1)[0];

				if (myNode.value === mypathEnd.value) {
					myPath = Closed[Closed.push(myNode) - 1];
					do {
						result.push([myPath.x, myPath.y]);
					}
					while (myPath = myPath.Parent);
					AStar = Closed = Open = [];
					result.reverse();
				} else {
					myNeighbours = Neighbours(myNode.x, myNode.y);
					for (i = 0, j = myNeighbours.length; i < j; i++) {
						myPath = Node(myNode, myNeighbours[i]);
						if (!AStar[myPath.value]) {
							myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
							myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
							Open.push(myPath);
							AStar[myPath.value] = true;
						}
					}
					Closed.push(myNode);
				}
			}
			return result;
		}

		return calculatePath();
	};
	this.movePath = function (x, y, callback) {
		var $this = this,
			path = this.path,
			c = this.cell,
			t = this.type,
			tile = _tile.param;
		if (t !== 'nps') this.getPath();
		if (x !== undefined && y !== undefined) this.getPath(x, y);
		if (this.path.arr.length) {//Путь найден, Проходим его..

			if (typeof callback === "function") path.callback = callback; //Запоминаем функцию которую нужно выполнить по прохождению пути
			if (path.arr.length !== path.cell) {
				var itm = path.arr[path.cell];
				if (path.arr[path.cell + 1] !== undefined) {
					var next = path.arr[path.cell + 1];
					//---------------------
					this.x = tile.w * itm[0];
					this.y = tile.h * itm[1];
					//---------------------
					if (itm[0] !== path.mem.x) {
						if (itm[0] < next[0]) {
							if (path.mem.x < itm[0] && path.mem.x != null) {
								this.x += path.step;
							}
						} else if (itm[1] < next[1]) this.y += path.step;
						if (itm[0] > next[0]) {
							if (path.mem.x > itm[0] && path.mem.x != null) {
								this.x -= path.step;
							}
						} else if (itm[1] > next[1]) this.y -= path.step;
					}
					if (itm[1] != path.mem.y) {
						if (itm[1] < next[1]) {
							if (path.mem.y < itm[1] && path.mem.x != null) {
								this.y += path.step;
							}
						} else if (itm[0] < next[0]) this.x += path.step;
						if (itm[1] > next[1]) {
							if (path.mem.y > itm[1] && path.mem.x != null) {
								this.y -= path.step;
							}
						} else if (itm[0] > next[0]) this.x -= path.step;
					}
				}
				path.step++;
				if (tile.w == path.step) {
					path.step = 0;

					path.mem.x = c.x = itm[0];
					path.mem.y = c.y = itm[1];

					path.cell++
				}
				//---------------------
			} else {
				//Путь пройден.
				path.mem.x = null;
				path.mem.y = null;
				path.count += 1;
				path.arr = [];
				path.cell = 0;
				path.step = 0;

				if (path.callback != null) path.callback();


				if (this.path.timer) {
					var random = getRandomInt(1000, this.path.delay);
					this.path.timer = false;
					setTimeout(function () {
						$this.path.timer = true;
						$this.path.wait = false;
					}, random);
				}
			}
		}
	};
	this.getPath = function (b1, b2) {
		var m = _Map,
			c = this.cell,
			x1, y1, path;

		if (_lvl[storage._lvl]['accessibly'] === undefined) {
			var arr = _lvl[storage._lvl].map;
			_lvl[storage._lvl]['accessibly'] = []; //Создаем массив.
			for (var x in arr) {
				for (var y in arr[x]) {
					for (var l in arr[x][y]) {
						var i = arr[x][y][l];

						if (i.tile === _tile.defMap || i.id === _tile.default) continue;
						var itm = _tile[i.tile].map[i.id];

						//Это стена
						if (itm.wall === 0) {
							_lvl[storage._lvl]['accessibly'].push({x: parseInt(x), y: parseInt(y)});
						}
					}
				}
			}
		}
		if (!this.path.arr.length && !this.path.wait) {
			//генерируем случайные клетки по x, y b Проверяем доступность маршрута.
			if (b1 !== undefined && b2 !== undefined) {
				x1 = b1;
				y1 = b2;
			} else {
				const random = getRandomInt(0, _lvl[storage._lvl]['accessibly'].length - 1),
					point = _lvl[storage._lvl]['accessibly'][random];

				x1 = point.x;
				y1 = point.y;
			}
			path = this.findPath(_lvl[storage._lvl].map, [c.x, c.y], [x1, y1]);
			//Путь туда доступен ?
			if (path.length > 0) {

				this.path.wait = true;
				this.path.arr = path;
			}
		}

	};
	this.draw = function () {
		if (this.options.visibility) {
			const mem = this.memory;
			const sell = _spt[this.type];
			const c = this.frame;
			const map = c.map;
			const arr = sell.map[this.sx][this.sy];
			const img = sell.dom[this.sid];
			const ctx = _Map.setting.canvas.dom;

			if (this.x !== mem.x || this.y !== mem.y) {
				c.msp = c.msp <= c.speed ? c.msp += 1 : c.msp = 0;
				if (c.msp === 0) {
					c.im = c.im >= map.length - 1 ? 0 : c.im += 1;
				}
			} else c.im = 1;
			if (this.x || this.y) {
				if (mem.x != this.x) {
					if (mem.x < this.x) mem.pos = 'right';
					if (mem.x > this.x) mem.pos = 'left';
				}
				if (mem.y != this.y) {
					if (mem.y < this.y) mem.pos = 'bottom';
					if (mem.y > this.y) mem.pos = 'top';
				}
			}
			ctx.drawImage(img, arr.x + this.width * map[c.im], arr.y + this.height * _com[mem.pos], this.width, this.height, this.x, this.y, this.width, this.height);
			//Рисуем полоску жизней у персонажа.
			const pst = this.options.health / this.options.max.health; //Процент от чиста
			ctx.fillStyle = '#610101';
			x = mem.x + c.status.pos.x;
			y = mem.y + c.status.pos.y;
			if (pst !== 1) {
				ctx.fillRect(x, y, c.status.w, c.status.h);
				ctx.fillStyle = '#e11e26';
				ctx.fillRect(x + 1, y + 1, (c.status.w - 2) * pst, c.status.h - 2);
			}//Скрываем показатель жизней если он равен 100%
			mem.x = this.x;
			mem.y = this.y;
			//----------------------------
		}
		if (this.options.life) this.life();
	};

	if (arguments.length > 0) this.init(type, sid, sx, sy, x, y, option);
};

function getContextForMicrotask() {
	return {
		...(_Mobs[_Hero.nps]),
		_Map,
		_Mobs,
		_Hero,
		Enemy,
		// TODO удалить внутри _code _gameSet заменить на GameEngine
		_gameSet: gameEngine.stopLoop,
		Interface: _Interface,
		addHookAfterLoadMob,
	}
}

function createMobs(level) {
	let j = 0;
	const mp = _lvl[level];
	Object.keys(mp).forEach((type) => {
		if (type === "map") return;
		if (type === "hero") {
			// Mob №1 is the character.
			_Mobs.push(new _Person(mp[type].x, mp[type].y));
			if (storage._hero !== null) {
				_Mobs[j].sprite = storage._hero.sprite;
				_Mobs[j].options = storage._hero.options;
			}
			_Hero = _Mobs[j];
		} else {
			Object.values(mp[type]).forEach((i) => {
				_Mobs.push(new Enemy(type, i[0], i[1], i[2], i[3], i[4], i[5]));
				_Mobs[j].type = type;
				j++;
			});
		}
	});
}

function heroInit(level) {
	const mp = _lvl[level].hero;
	const x = mp.x * _tile.param.w;
	const y = mp.y * _tile.param.h;
	_Hero = new _Person();

	for (var m in storage._hero) {
		_Hero[m] = storage._hero[m];
	}
	_Hero.memory.dump = {};
	_Hero.options.tool = storage._inventory.tool;
	_Hero.memory.dump.x = x;
	_Hero.memory.dump.y = y;
	_Hero.memory.x = x;
	_Hero.memory.y = y;
	_Hero.memory.pos = 'bottom';
	_Hero.can.walk = true;
	_Hero.nps = null;
	_Mobs.push(_Hero);
}

function mobInit(lvl) {
	storage[lvl]._mobs.forEach((item) => {
		if (["hero", "accessibly"].includes(item.type)) return;
		const mob = new Enemy()
		console.log('mobInit', {item});
		Object.keys(item).forEach((key) => {
			mob[key] = item[key];
		});

		mob.path.wait = false; //Убираем флаг ожидания у объекта. Что бы он продолжал перемещения по карте.
		mob.path.timer = true;
		mob.actFlag = false;
		mob.doit = true;
		mob.timer = true; //Таймер.

		_Mobs.push(mob);
	});
}

function mapInit(lvl) {
	_lvl[lvl].map = storage[lvl]._map;
}

function drawMobs() {
	for (var id in _Mobs) {
		var im = _Mobs[id];
		im.draw();
	}
}

var Interface = function () {
	this.dialog = {
		doit: true, //Флаг доступности чего-либо..
		flag: false, //Отображать диалог
		param: {
			x: 0, //Координаты текстового поля.
			y: 0, //Координаты текстового поля.
			main: {
				w: 772,
				h: 97,
				x: 0,
				y: 0
			}, //Главный блок диалогов.
			say: {
				w: 553,
				h: 86,
				x: 0,
				y: 97
			} //Блок, где персонажи общаются.
		}, //Параметры диалога на игровом пространстве.
		face: {
			left: {
				sid: 0,
				x: 0,
				y: 0
			},
			right: {
				sid: 2,
				x: 0,
				y: 0
			}
		},
		textid: 0, //id реплики в диалоге.
		text: [], //текс который мы будем выводить.
		callback: undefined, //Функция выполнимая после завершения диалога.
		mob: undefined, //персонаж, который вызвал диалог.
		wrapText: function (context, text, marginLeft, marginTop, maxWidth, lineHeight) {
			if (text != undefined) {
				var words = text.split(" ");
				var countWords = words.length;
				var line = "";
				for (var n = 0; n < countWords; n++) {
					var testLine = line + words[n] + " ";
					var testWidth = context.measureText(testLine).width;
					if (testWidth > maxWidth) {
						context.fillText(line, marginLeft, marginTop);
						line = words[n] + " ";
						marginTop += lineHeight;
					} else {
						line = testLine;
					}
				}
				context.fillText(line, marginLeft, marginTop);
			}
		},
		setFace: function (pos, id, x1, y1) {
			/**
			 * Положение: right || left
			 * tid - Спрайт ID
			 * x - Координата по X на спрайте
			 * y - Координата по Y на спрайте
			 */
			if (pos == "left" || pos == "right") {
				if (pos == "left") {
					this.face.left.sid = id;
					this.face.left.x = x1;
					this.face.left.y = y1;
				} else {
					this.face.right.sid = id;
					this.face.right.x = x1;
					this.face.right.y = y1;
				}
			}

		},
		set: function (arr, callback) {
			//Отображаем диалог
			this.show();
			//Записываем диалог в Интерфейс.
			this.text = arr;
			this.callback = callback;
		},
		next: function () {
			var $im = _Mobs[_Hero.nps]; //Активный моб.
			//Меняем индекс текста.
			this.textid = this.text.length - 1 > this.textid ? this.textid + 1 : "next";
			//------
			if (this.textid == "next") {//Диалог окончен.
				this.textid = 0;
				_Hero.nps = null; //Делаем игрока уязвимым для врагов.
				_Hero.can.walk = true; //Разрешаем игроку ходить..
				if ($im != undefined) $im.actFlag = false; //Убираем интерфейс.
				if (typeof this.callback == 'function') this.callback();
				_Interface.dialog.hide(); //Прячем диалог.
			}
		},
		show: function () {
			this.flag = true;
		},
		hide: function () {
			this.flag = false
		},
		draw: function () {
			if (this.flag) {
				var ctx = _Map.setting.canvas.dom,
					p = this.param,
					l = this.face.left,
					r = this.face.right,
					img = _spt['interface'].dom[0],
					face = _spt['face'].frame,
					m = _spt['face'].map,
					left = _spt['face'].dom[l.sid],
					right = _spt['face'].dom[r.sid],
					x, y, dx, dy,
					map = _Map.setting.map; //Размеры холста в клетках.
				x = ((map.count.x * _tile.param.w) - p.main.w) / 2; //Координата диалога.
				y = ((map.count.y * _tile.param.h) - p.main.h); //Координата диалога.
				dx = p.x = (p.main.w - p.say.w) / 2 + x;
				dy = p.y = (p.main.h - p.say.h) / 2 + y;

				var arr = this.text[this.textid],
					a = undefined;
				//Назначаем лица для диалогов.
				if (arr != undefined) {
					if (arr.length > 1) {
						//Больше одного.
						if (arr[1] != a && arr[2] != a && arr[3] != a && arr[4] != a) {
							this.setFace(arr[1], arr[2], arr[3], arr[4]);
						}
						if (arr[5] != a && arr[6] != a && arr[7] != a && arr[8] != a) {
							this.setFace(arr[5], arr[6], arr[7], arr[8]);
						}
					}
				}


				ctx.drawImage(img, p.main.x, p.main.y, p.main.w, p.main.h, x, y, p.main.w, p.main.h);
				ctx.drawImage(left, m[l.x][l.y].x, m[l.x][l.y].y, face.w, face.h, x, y, face.w, face.h);
				ctx.drawImage(right, m[r.x][r.y].x, m[r.x][r.y].y, face.w, face.h, x + p.main.w - face.w, y, face.w, face.h);

				ctx.font = 'bold 15px Arial';
				ctx.fillStyle = "#000";
				var text = this.text[this.textid] != undefined ? this.text[this.textid][0] : "";

				this.wrapText(ctx, text, dx + 5, dy + 20, p.say.w, 20);
				if (InputManager.isPressed(KEYS.ACTION) && this.doit) {
					this.doit = false;
					_Interface.dialog.next();
					var $this = this;
					setTimeout(function () {
						$this.doit = true;
					}, 500);
				}
			}
		},
		randomDialog(dialogArray) {
			return dialogArray[Math.floor(Math.random() * dialogArray.length)];
		}
	}; //Функция отображает диалоги..
	this.inventory = {
		pos: {
			x: 0, //положение инвентаря на карте.
			y: 0
		},
		param: {
			w: 199,//Габариты
			h: 30,
			x: 772, // положение на спрайт карте
			y: 0
		},//Рисуем инвентарь..
		lastSearch: null, //тут храним результат последнего найденного элемента в инвентаре..
		add: function (itm, count) {
			var inv = storage._inventory, //инвентарь игрока
				zero = [], //массив с пустыми ячейками.
				search = null; //Ячейка поиска.
			//Функция добавляем в инвентарь игрока, что-то определенного кол-ва.
			//Проверяем есть ли в инвентаре у игрока уже предмет этого типа ?
			for (var id in inv.itms) {
				var cell = inv.itms[id];
				if (cell === null) {
					//ячейка пуста записываем ее id что бы потом использовать.
					zero.push(id);
				} else {
					if (cell.itm === itm) {
						//такой предмет уже есть в инвентаре, увеличиваем кол-во таких предметов в инвентаре игрока.
						search = id; //Записываем найденную ячейку, чтобы потом увеличить кол-во.
					}//если предмет не найден тогда search == null и нужно создать такой предмет в инвентаре.
				}
			}
			//поиск окончен, смотрим результаты поиска.
			if (search === null) {
				//не чего не найдено, создаем предмет в инвентаре.
				inv.itms[zero[0]] = {
					itm: itm,
					count: count
				}
			} else {
				//Найдена ячейка хранения такого предмета, увеличиваем ко-во этих предметов в инвентаре.
				inv.itms[search].count += count;
			}
			//Записываем инвентарь в хранилище..
			storage._inventory = inv;
		},
		delete: function (itm, count) {
			//Удаляем предмет в кол-ве из инвентаря.
			var inv = storage._inventory;
			if (this.isset(itm, count)) {
				var last = this.lastSearch;
				//Предмет найден отнимаем от существующего ко-ва наше.
				inv.itms[last].count -= count;
				if (inv.itms[last].count <= 0) {
					inv.itms[last] = null;
				}
			}
			storage._inventory = inv;
		},
		show: function () {
			storage._invShow = true;
		},
		isset: function (itm, count) {
			var inv = storage._inventory.itms,
				bool = false;
			//проверяем существует ли в инвентаре, что-то определенного кол-ва.
			for (var i in inv) {
				var cell = inv[i];
				if (cell !== null) {
					if (cell.itm === itm && cell.count >= count) {
						this.lastSearch = i; //Записываем результат поиска
						bool = true;
						break;
					}
				}
			}
			return bool;
		},
		hide: function () {
			storage._invShow = false;
		},
		drawItms: function () {
			var ctx = _Map.setting.canvas.dom;
			//получаем инвентарь персонажа.
			var inv = storage._inventory.itms; //только предметы.
			for (var id in inv) {
				var itm = inv[id];
				if (itm !== null) {
					//получаем параметры предмета.
					var param = _itms[itm.itm].map,
						im = _tile[param.tile].map[param.id],
						tile = {x: im.x + 3, y: im.y + 3, w: 26, h: 26},
						pos = {x: this.pos.x + 2 + (28 * 2) + (tile.w * id + (id * 2)), y: this.pos.y, w: 26, h: 26};//положение предметов в инвентаре.

					ctx.drawImage(_tile[param.tile].dom, tile.x, tile.y, tile.w, tile.w, pos.x, pos.y, pos.w, pos.h);
					//Рисуем кол-во предметов в инвентаре..
					ctx.font = 'bold 11px Arial';
					ctx.fillStyle = "#000"; //Черный
					ctx.fillText(itm.count, pos.x + 18, pos.y + 26, 26);
				}
			}
		},//Функция отрисовки предметов в инвентаре персонажа.
		drawTool: function () {
			var ctx = _Map.setting.canvas.dom,
				img = _spt.hero.dom[_Hero.face],
				map = _spt.hero.map[_Hero.tool.x][_Hero.tool.y];

			//получаем id предмета
			var tool = _Hero.options.tool;
			if (tool !== null) {
				var s = {x: map.x + (32 * 2) + 3, y: map.y + (32 * _com[_Hero.tool.s[_Hero.options.tool].pos]), w: 26, h: 26};
				var d = {x: this.pos.x + 2 + 28, y: this.pos.y, w: 26, h: 26};
				//Рисуем предмет в инвентаре..
				ctx.drawImage(img, s.x, s.y, s.w, s.h, d.x, d.y, d.w, d.h);
			}
		}, //Рисуем инструмент который у нас в руке или доступен для использования.
		draw: function () {
			if (storage._invShow) {
				var ctx = _Map.setting.canvas.dom,
					img = _spt['interface'].dom[0];
				this.pos.x = _Map.setting.map.count.x * _tile.param.w - this.param.w - 2;
				this.pos.y = 2;

				ctx.drawImage(img, this.param.x, this.param.y, this.param.w, this.param.h, this.pos.x, this.pos.y, this.param.w, this.param.h);
				this.drawItms(); //Рисуем предметы в инвентаре.
				this.drawTool(); //Рисуем предмет который в руке у персонажа.
			}
		}
	};
	this.quest = {
		param: {
			w: 199,
			h: 17,
			x: 772,
			y: 30,
			inv: {
				w: 199,
				h: 30
			} //Габариты инвентaря.
		},
		text: undefined, //Короткий текст который будет помогать игроку выполнить задание..
		set: function (text) {
			storage._quest = text;
		}, //Устанавливаем текст задания.
		draw: function () {
			var text = storage._quest,
				ctx = _Map.setting.canvas.dom,
				p = this.param,
				img = _spt['interface'].dom[0],
				x = _Map.setting.map.count.x * _tile.param.w - p.w - 2,
				y = storage._invShow ? p.inv.h + 2 : 2;
			if (text != null) {
				ctx.drawImage(img, p.x, p.y, p.w, p.h, x, y, p.w, p.h);
				ctx.font = 'bold 13px Arial';
				ctx.fillStyle = "#000";
				ctx.fillText(text, x + 2, y + 13, p.w - 4);
			}
		}
	};
	this.hp = {
		param: {
			w: 210,
			h: 12,
			x: 772,
			y: 47
		},
		draw: function () {
			var ctx = _Map.setting.canvas.dom,
				p = this.param,
				img = _spt['interface'].dom[0],
				x = 3,
				y = 3,
				max = _Hero.options.max.health,
				hp = _Hero.options.health, pst = hp / max;

			ctx.drawImage(img, p.x, p.y, p.w, p.h, x, y, p.w, p.h);

			ctx.fillStyle = '#e11e26';
			ctx.fillRect(x + 2, y + 2, (p.w - 4) * pst, p.h - 4);

			ctx.fillStyle = '#fff';
			ctx.font = 'bold 10px Arial';
			ctx.fillText('hp ' + hp + "/" + max, x + (p.w - 70) / 2, y + 9, 100);
		}
	};
	this.draw = function () {
		this.hp.draw();
		this.dialog.draw();
		this.inventory.draw();
		this.quest.draw();
	};
};

var _Person = function (x, y) {
	var ctx, sell, arr, c, map, mem, img;
	this.nps = null; //id nps с которым я взаимодействую.
	this.type = "hero";
	this.face = 0; //Пол персонажа парень 0 девушка 1. !!!!!(Не проверялось..)!!!!!!!!!
	this.sprite = {
		x: 2, //Положение персонажа на спрайт карте
		y: 0 //Положение персонажа на спрайт карте
	};
	this.status = {
		pos: {
			x: 3,
			y: -6
		}, //положение статуса относительно персонажа.
		w: 26,
		h: 4
	};
	this.tool = {
		s: {
			0: {name: 'Топор', pos: 'top'},
			1: {name: 'Тесак', pos: 'right'},
			2: {name: 'Сабля', pos: 'left'},
			3: {name: 'Мачете', pos: 'bottom'}
		}, //Предметы доступные персонажу.
		frame: {
			speed: 5, //задержка отображение следующего кадра
			msp: 0, //Ячейка памяти задержки отображение следующего кадра
			im: 0, //Кадр с которого начнется воспроизведение.
			map: [0, 1, 2, 1], //Порядок воспроизведения кадров.
			width: 32,
			height: 32,
			x: 5, //Положение топора относительно персонажа
			y: -38 //Положение топора относительно персонажа
		},//Параметры кадров.
		x: 3, //Положение топора на спрайт карте
		y: 1 //Положение топора на спрайт карте
	};
	this.can = {
		attack: false, //Можем ли мы атаковать ?
		walk: true //Флаг говорящий о том что персонаж может перемещаться..
	};
	this.memory = {
		dump: {
			x: null, //точка персонажа на холсте
			y: null, //точка персонажа на холсте
			cell: undefined //точка x, y на карте, где находиться персонаж.
		},
		x: null, //точка персонажа на холсте
		y: null, //точка персонажа на холсте
		pos: 'bottom', //положение в пространстве
		cell: undefined, //точка x, y на карте, где находиться персонаж.
		digger: 0 //счетчик выполнения действия.
	};
	this.options = {
		quest: null, //текущее задание.
		digger: 200, //время пока персонаж добывает что-либо..
		tool: null, //Активный предмет.
		max: {
			health: 5 //Очки жизни
		}, //максимумы.
		radios: 5, //Радиус атаки игрока..
		speed: 2,//скорость
		damage: 1, //Урон, который может нанести персонаж.
		health: 1 //Очки жизни
	}; // Статистика персонажа.
	this.canTakeIt = function () {
		//Проверяем если действие происходит в координате, есть ли там объект который я могу получить ?
		var h = {w: _tile.param.w, h: _tile.param.h, x: this.memory.x, y: this.memory.y, s: this.status},//Персонаж.
			dx, dy, bool = false;
		//Получаем ячейку на которой стоит персонаж сходя из его размеров
		dx = Math.floor((h.x + h.w / 2) / h.w);
		dy = Math.floor((h.y + h.h) / h.h);
		//Смотрим ячейку на которой стоим и проверяем можем ли мы ее взять.
		var cell = _lvl[storage._lvl].map[dx][dy], stop = false;
		//Проверяем каждый слой карты на наличие на нем предметов.
		for (var l in cell) {
			var c = cell[l];
			for (var itm in _itms) {
				var i = _itms[itm].map;
				if (c.id === i.id && c.tile === i.tile) {
					stop = true;
					bool = true;
					break;
				}
			}
			if (stop) break;
		}
		if (bool) {
			const i = this.memory,
				max = this.options,
				ps = i.digger / max.digger,
				w = (h.s.w - 2) * ps;
			//рисуем статус бар..
			ctx.fillStyle = "#054807";
			ctx.fillRect(h.x + h.s.pos.x, h.y + h.s.pos.y - 5, h.s.w, h.s.h);
			ctx.fillStyle = "#2AFF10";
			ctx.fillRect(h.x + h.s.pos.x + 1, h.y + h.s.pos.y - 4, w, h.s.h - 2);
			//предмет найден запускаем таймер для того что бы получить его.
			i.digger = i.digger + 1 < max.digger ? i.digger + 1 : max.digger; //Увеличиваем счетчик.
			if (i.digger === max.digger) {
				//удаляем этот элемент с карты
				_lvl[storage._lvl].map[dx][dy][l] = {tile: null, id: null};
				_Interface.inventory.add(parseInt(itm), parseInt(1)); //Добавляем 1 элемент в инвентарь игрока.
				//Выкапываем на этом участке карты предмет который нас интересует.
				i.digger = 0;//Обнуляем счетчик..
			}
		}
	};
	this.setTool = function (id) {
		this.options.tool = id;
		storage._inventory.tool = id; //Записываем..
	};
	this.setQuest = function (obj) {
		/**
		 * @type {obj} - Объект типа {itm: @id, count,callback: function(){}}
		 * функция устанавливаем ивент, для персонажа.
		 */
		this.options.quest = obj;
	}; //Устанавливаем тот или другой квест.
	this.questComplete = function () {
		var q = this.options.quest; //квест.
		if (q != null) {
			//определяем что это за квест.
			if (q.itm !== undefined && q.count !== undefined) {
				if (_Interface.inventory.isset(q.itm, q.count)) {
					const microtask = new MobMicroTask(q.callback)
					microtask.run(microtasksScope, getContextForMicrotask());
					this.options.quest = null;
				}
			} else {
				//Задание убить всех мобов
				if (q.lvl === storage._lvl && _Map.countEnemy() === 0) {
					//Убиты все враги..
					const microtask = new MobMicroTask(q.callback)
					microtask.run(microtasksScope, getContextForMicrotask());
					this.options.quest = null;
				}
			}
		}

	};//Проверяем квест на завершение.
	this.attack = function () {
		if (this.options.tool !== null && this.can.attack) {//В руке имеется что-то чем можно бить по башке
			//Проверяем на столкновение в радиусе..
			for (var i = 0; i < _Mobs.length; i++) {
				var mob = _Mobs[i];
				if (mob.type != "enemy") continue;
				//И так это враг, получаем его координату. и радиус..
				var enemy = {x: mob.x - (mob.width / 2), y: mob.y - (mob.height / 2), r: mob.options.radius + mob.width};
				var hero = {x: this.memory.x - 16, y: this.memory.y - 16, r: this.options.radios + 32};

				var dx = enemy.x - hero.x;
				var dy = enemy.y - hero.y;
				var distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < enemy.r + hero.r) {
					var $this = this;
					if ($this.can.attack) {
						$this.can.attack = false;
						mob.options.health = mob.options.health - this.options.damage >= 0 ? mob.options.health - this.options.damage : 0;
						if (mob.options.health <= 0) {
							//Убили Моба.
							_Mobs.splice(i, 1);
						}
						//Отнимает чуть-чуть жизней..
						setTimeout(function () {
							$this.can.attack = true; //Разрешаем игроку атаковать снова..
						}, 700);
					}
				}
			}
		}
	}; //Учим персонажа атаковать врагов.
	this.drawStatus = function () {
		var mem = this.memory,
			op = this.options,
			st = this.status,
			ctx = _Map.setting.canvas.dom,
			x, y, pst;
		pst = op.health / op.max.health; //Процент от чиста
		ctx.fillStyle = '#610101';
		x = mem.x + st.pos.x;
		y = mem.y + st.pos.y;
		if (pst !== 1) {
			ctx.fillRect(x, y, st.w, st.h);
			ctx.fillStyle = '#e11e26';
			ctx.fillRect(x + 1, y + 1, (st.w - 2) * pst, st.h - 2);
		}
		if (pst === 0) gameOver();
	};
	this.isCollision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
		return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2;
	};
	this.collision = function (nx, ny, callback) {
		var arr = _lvl[storage._lvl].map,
			tile = _tile,
			sp = this.options.speed,
			hero = {
				x: nx,
				y: ny,
				w: _spt.hero.frame.w,
				h: _spt.hero.frame.h
			},
			bool = false;
		for (var x in arr) {
			for (var y in arr[x]) {
				for (var l in arr[x][y]) {
					var i = arr[x][y][l];
					if (i.tile === tile.defMap || i.id === tile.default) continue;
					var itm = tile[i.tile].map[i.id];
					if (itm.wall === 0) continue;
					var titm = tile.param;
					if (!this.isCollision(x * titm.w, y * titm.h, titm.w, titm.h, (hero.x + sp), (hero.y + ((hero.h / 4) * 3)), (hero.w - (sp * 2)), hero.h / 4))
						continue;
					else bool = true; //Столкновение !!!!
				}
			}
		}
		//Столкновение с мобоми
		for (const id in _Mobs) {
			const i = _Mobs[id];
			if (i.type === this.type) continue;
			//Получаем габариты и координаты для проверки столкновения.
			var en = {x: i.x, y: i.y, w: i.width, h: i.height};

			if (this.isCollision(en.x, en.y, en.w, en.h, hero.x, hero.y, hero.w, hero.h) && i.options.code != null) {
				if (i.type !== "enemy") {
					bool = true; //Столкновение с мобом.
				} else this.can.walk = true;

				this.nps = id; //Записываем ID nps.

				i.actFlag = true;//Вызываем сценарий в случае такого столкновения.
			}
		}
		//Вызываем callback есть он есть
		if (typeof callback == 'function' && !bool) callback(nx, ny);
	};
	this.event = function () {
		var mem = this.memory,
			opt = this.options;
		if (this.can.walk) {
			if (InputManager.isPressed(KEYS.LEFT)) {
				this.collision(mem.x - opt.speed, mem.y, function (x, y) {
					mem.x = x;
					mem.y = y;
				});
			}
			if (InputManager.isPressed(KEYS.RIGHT)) {
				this.collision(mem.x + opt.speed, mem.y, function (x, y) {
					mem.x = x;
					mem.y = y;
				});
			}
			if (InputManager.isPressed(KEYS.UP)) {
				this.collision(mem.x, mem.y - opt.speed, function (x, y) {
					mem.x = x;
					mem.y = y;
				});
			}
			if (InputManager.isPressed(KEYS.DOWN)) {
				this.collision(mem.x, mem.y + opt.speed, function (x, y) {
					mem.x = x;
					mem.y = y;
				});
			}
			if (InputManager.isPressed(KEYS.ACTION)) {
				//Выполняем действие..
				this.canTakeIt();
				this.drawTool();
				this.attack();
			} else {
				this.memory.digger = 0;
			}
		}
	};
	this.life = function () {
		this.event(); //События перемещения персонажа на карте.
		this.drawStatus();
		this.questComplete();

	};
	this.init = function (x, y) {
		var mem = this.memory;

		mem.x = x * _tile.param.w;
		mem.y = y * _tile.param.h;

	}; //Инициализируем персонажа.
	this.drawTool = function () {
		var pos = this.options.tool != null ? this.tool.s[this.options.tool].pos : null, text = "",
			f = this.tool.frame,
			tool = _spt.hero.map[this.tool.x][this.tool.y];

		f.msp = f.msp <= f.speed ? f.msp += 1 : f.msp = 0;
		if (f.msp === 0) {
			f.im = f.im >= map.length - 1 ? 0 : f.im += 1;
		}
		if (this.options.tool != null) {
			ctx.drawImage(img, tool.x + c.w * map[f.im], tool.y + c.h * _com[pos], c.w, c.h, mem.x + f.x, mem.y + f.y, c.w, c.h);
		} else {
			ctx.font = "23px Arial";
			ctx.fillStyle = "#fff";
			if (f.im > 0) text = "";
			if (f.im > 1) text = "..";
			if (f.im > 2) text = "...";
			var dx, dy;
			dx = mem.x + f.x - 0.5;
			dy = mem.y + f.y / 2 + 1;
			ctx.fillRect(dx + 1, dy, 22, 6);
			ctx.fillStyle = "#000";
			ctx.fillText(text, dx + 2, dy + 4);
		}
	};
	this.draw = function () {
		ctx = _Map.setting.canvas.dom;
		mem = this.memory; //Память персонажа
		sell = _spt.hero; //Спрайт персонажа
		arr = _spt.hero.map[this.sprite.x][this.sprite.y];//Массив спрайт карты.
		c = _spt.hero.frame; //параметры кадра
		map = c.frameMap;
		img = sell.dom[this.face]; //Изображение персонажа в объекте спрайта
		if (mem.x !== mem.dump.x || mem.y !== mem.dump.y) {
			c.msp = c.msp <= c.speed ? c.msp += 1 : c.msp = 0;
			if (c.msp === 0) {
				c.im = c.im >= map.length - 1 ? 0 : c.im += 1;
			}
		} else c.im = 1;
		if (mem.x || mem.y) {
			if (mem.dump.x !== mem.x) {
				if (mem.dump.x < mem.x) mem.pos = 'right';
				if (mem.dump.x > mem.x) mem.pos = 'left';
			}
			if (mem.dump.y !== mem.y) {
				if (mem.dump.y < mem.y) mem.pos = 'bottom';
				if (mem.dump.y > mem.y) mem.pos = 'top';
			}
		}
		ctx.drawImage(img, arr.x + c.w * map[c.im], arr.y + c.h * _com[mem.pos], c.w, c.h, mem.x, mem.y, c.w, c.h);
		mem.dump.x = mem.x;
		mem.dump.y = mem.y;
		this.life();
	}; //рисуем персонажа в координатах.

	//Вызываем конструктор если заданы значения.
	if (arguments.length > 0) this.init(x, y);
};

var loop = function () {
	const ctx = _Map.setting.canvas.dom;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	// TODO добавлять через addProcessInput
	InputManager.processInput();
	// TODO нужно будет переписать.
	// _Map.draw(); // Отрисовка карты.
	// drawMobs(); //Прорисовываем мобов.
	// _Map.overlay(); //Перекрываем персонажа.
	// _Interface.draw(); //Рисуем диалог.

	levelZero.processInput(gameEngine.deltaTime);
	levelZero.update(gameEngine.deltaTime);
	// TODO вместо этого gameEngine.#setCanvasSettings();
	// ctx.imageSmoothingEnabled = false;
	levelZero.render(ctx);


};
var gameOver = function () {
	_Hero.can.walk = false;
	_Hero.can.attack = false;
	_Interface.dialog.set([
		["3..", 'right', 4, 3, 0],
		["2.."],
		["1.."],
		[" - Игра окончена.."],
		["Ты кто вообще ? "],
		["ППпппрррррРРРРрррруУУУУУууФФФффффф...."]
	], function () {
		gameEngine.stopLoop();
		storage.clearAll();
		location.reload();
	});
};

document.addEventListener('DOMContentLoaded', function () {
	//Если пользователь зашел первый раз в игру устанавливаем настройки..
	storage.setOnce('_lvl', 0); //Устанавливаем уровень персонажа.
	storage.setOnce('_inventory', {tool: null, itms: {0: null, 1: null, 2: null, 3: null, 4: null}}); //Устанавливаем инвентарь.
	_Map.levelSet(storage._lvl);
});

window.May = () => {};
window.May.stopGame = function () {
	_Hero.can.walk = false;
	_Hero.can.attack = false;
	gameEngine.stopLoop();
	storage.clearAll();
}
window.May.pauseGame = function () {
	gameEngine.pause();
}
window.May.resumeGame = function () {
	gameEngine.resume();
}
window.May.levelSet = _Map.levelSet.bind(this);
