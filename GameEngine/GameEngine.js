'use strict';

import {Level} from "./Level/Level.js";

const nextStep = (() => (
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    setTimeout(callback, 1000 / 60);
  }
))();

export class GameEngine {
	#debugLogs = false;
	#config;
	#canvasId;
  #lastFrameTime; // Переменная времени на предыдущем кадре
  #currentLoop; // Переменная для хранения текущего цикла игры

	#inputProcesses; // Набор уникальных функций для обработки ввода
	#updateProcesses; // Набор уникальных функций для обработки обновлений
	#renderProcesses; // Набор уникальных функций для обработки отрисовки

	#levels; // Уровни

	/**
	 *
	 * @param gameEngineConfig {Object}
	 */
  constructor(gameEngineConfig) {
		if(typeof gameEngineConfig !== "object") throw new TypeError('gameEngineConfig must be object');
		if(typeof gameEngineConfig.canvasId !== "string") throw new TypeError('canvasId must be string');
		this.#config = gameEngineConfig;
		this.#canvasId = gameEngineConfig.canvasId;

    this.#lastFrameTime = performance.now(); // Инициализация переменной времени на предыдущем кадре
    this.#currentLoop = () => {
			if(this.#debugLogs) console.warn(this, 'Engine not set')
		};
    this.deltaTime = 0; // Инициализация переменной delta time

    this.#initCanvas(); // инициализируем холст
    this.#gameLoop(); // запускаем игровой цикл

		this.#inputProcesses = new Set();
		this.#updateProcesses = new Set();
		this.#renderProcesses = new Set();

		this.#levels = new Map();
  }

	#setCanvasSettings() {
		const {
			imageSmoothingEnabled = true, // Сглаживанием по умолчанию - true
		} = this.#config;
		if(typeof imageSmoothingEnabled !== "boolean") throw new TypeError('imageSmoothingEnabled must be boolean');
		this.ctx.imageSmoothingEnabled = imageSmoothingEnabled;
	}

  #initCanvas() {
    this.canvas = document.getElementById(this.#canvasId);
    this.ctx = this.canvas.getContext('2d');
	}

  #gameLoop() {
    this.updateDeltaTime(); // Получение delta time в секундах

    if (typeof this.#currentLoop === 'function') {
      this.#currentLoop(); // Вызов текущего цикла игры
    }
    // Выкидываем из стека текущую функцию и добавляем в стек следующую
    nextStep(this.#gameLoop.bind(this));
  }

  #loop() {
		this.#setCanvasSettings();
		this.#clearCanvas(this.ctx);
    this.#processInput(this.deltaTime);
    this.#processUpdate(this.deltaTime);
    this.#processRender(this.ctx);
  }

  updateDeltaTime() {
    const currentTime = performance.now(); // Получение текущего времени
    const deltaTime = (currentTime - this.#lastFrameTime) / 1000; // Вычисление разницы во времени в секундах

    this.#lastFrameTime = currentTime; // Обновление значения предыдущего времени

    this.deltaTime = deltaTime; // Обновление значения delta time
  }

	#clearAllProcesses() {
		this.#inputProcesses.clear();
		this.#updateProcesses.clear();
		this.#renderProcesses.clear();
	}

	#clearCanvas() {
		const {clearCanvasBeforeRender = false} = this.#config;
		if(typeof clearCanvasBeforeRender !== "boolean") throw new TypeError('clearCanvasBeforeRender must be boolean');
		if(clearCanvasBeforeRender) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

  #processInput(deltaTime) {
		this.#inputProcesses.forEach((process) => process(deltaTime))
  }

  #processUpdate(deltaTime) {
		this.#updateProcesses.forEach((process) => process(deltaTime))

  }

  #processRender(canvasContext) {
		this.#renderProcesses.forEach((process) => process(canvasContext))
  }

  /**
   * @deprecated пока переезжаем на GameEngine, как закончу нужно будет удалить в пользу #loop
   */
  setLoop(loop) {
    this.#currentLoop = loop;
  }

  stopLoop() {
    this.#currentLoop = () => {
			if(this.#debugLogs) console.info(this, 'Engine stopped')
    };
  }

  startLoop() {
    this.#currentLoop = this.#loop;
  }

  pause() {
    return this.stopLoop();
  }

  resume() {
    return this.startLoop();
  }

	debugLogs(value) {
		if(typeof value !== "boolean") throw new TypeError('value must be boolean');
		this.#debugLogs = value;

	}

	/**
	 * Добавляет функцию в цикл игры на этапе обработки ввода
	 */
	addProcessInput(func) {
		if(typeof func !== 'function') {
				throw new Error('Input process must be a function');
		}
		this.#inputProcesses.add(func);
	}

	/**
	 * Удаляет функцию из цикла игры с этапа обработки ввода
	 * @param func
	 */
	deleteProcessInput(func) {
		this.#inputProcesses.delete(func);
	}

	/**
	 * Добавляет функцию в цикл игры на этапе обновления
	 */
	addProcessUpdate(func) {
		if(typeof func !== 'function') {
			throw new Error('Update process must be a function');
		}

		this.#updateProcesses.add(func);
	}

	/**
	 * Удаляет функцию из цикла игры с этапа обновления
	 * @param func
	 */
	deleteProcessUpdate(func) {
		this.#updateProcesses.delete(func);
	}

	/**
	 * Добавляет функцию в цикл игры на этапе отрисовки
	 */
	addProcessRender(func) {
		if(typeof func !== 'function') {
			throw new Error('Render process must be a function');
		}

		this.#renderProcesses.add(func);
	}

	/**
	 * Удаляет функцию из цикла игры с этапа отрисовки
	 * @param func
	 */
	deleteProcessRender(func) {
		this.#renderProcesses.delete(func);
	}

	registerLevel(key, level) {
		if(typeof key !== "string") throw new TypeError('param key should be string');
		if(!(level instanceof Level)) throw new Error('param level should instance of Level');

		this.#levels.set(key, level);
	}

	setLevel(key) {
		if(typeof key !== "string") throw new TypeError('param key should be string');
		if(!this.#levels.has(key)) throw new Error('key of level should be registered before usage');
		const level = this.#levels.get(key);
		// загружаем уровень
		this.stopLoop();
		// Очищаем ранее заданные процессы
		this.#clearAllProcesses();
		// Добавляем хуки уровня в движок:
		this.addProcessInput(level.processInput.bind(level));
		this.addProcessUpdate(level.update.bind(level));
		this.addProcessRender(level.render.bind(level));



		// Загружаем уровень
		level.load()
			// запускаем игровой процесс
			.then(() => {
				// level.init();
				this.startLoop();
			});

	}
}
