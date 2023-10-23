'use strict';

import gameEngineConfig from '../config/gameEngine.config.json' assert {type: "json"};

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

export default new class GameEngine {
  #lastFrameTime; // Переменная времени на предыдущем кадре
  #currentLoop; // Переменная для хранения текущего цикла игры

	#inputProcesses; // Набор уникальных функций для обработки ввода
	#updateProcesses; // Набор уникальных функций для обработки обновлений
	#renderProcesses; // Набор уникальных функций для обработки отрисовки

  constructor() {
    const {canvasId} = gameEngineConfig;
		if(typeof canvasId !== "string") throw new TypeError('canvasId must be string');
		this.canvasId = canvasId;

    this.#lastFrameTime = performance.now(); // Инициализация переменной времени на предыдущем кадре
    this.#currentLoop = console.warn.bind(this, 'Engine not set');
    this.deltaTime = 0; // Инициализация переменной delta time

    this.#initCanvas(); // инициализируем холст
    this.#gameLoop(); // запускаем игровой цикл

		this.#inputProcesses = new Set();
		this.#updateProcesses = new Set();
		this.#renderProcesses = new Set();
  }

  #initCanvas() {
		const {
			imageSmoothingEnabled = true, // Сглаживанием по умолчанию - true
		} = gameEngineConfig;
		if(typeof imageSmoothingEnabled !== "boolean") throw new TypeError('imageSmoothingEnabled must be boolean');
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = imageSmoothingEnabled;
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

  #init() {

  }

	#clearCanvas() {
		const {clearCanvasBeforeRender = false} = gameEngineConfig;
		if(typeof clearCanvasBeforeRender !== "boolean") throw new TypeError('clearCanvasBeforeRender must be boolean');
		if(clearCanvasBeforeRender) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

  #processInput(deltaTime) {
		console.log(this.#inputProcesses);
  }

  #processUpdate(deltaTime) {

  }

  #processRender(canvasContext) {

  }

  /**
   * @deprecated пока переезжаем на GameEngine, как закончу нужно будет удалить в пользу #loop
   */
  setLoop(loop) {
    this.#currentLoop = loop;
  }

  stopLoop() {
    this.#currentLoop = console.info.bind(this, 'Engine stopped');
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
}
