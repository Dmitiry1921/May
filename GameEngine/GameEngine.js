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
  constructor() {
    const {canvasId} = gameEngineConfig;
    this.canvasId = canvasId;

    this.#lastFrameTime = performance.now(); // Инициализация переменной времени на предыдущем кадре
    this.#currentLoop = console.warn.bind(this, 'Engine not set');
    this.deltaTime = 0; // Инициализация переменной delta time

    this.#initCanvas(); // инициализируем холст
    this.#gameLoop(); // запускаем игровой цикл
  }

  #initCanvas() {
    this.canvas = document.getElementById(this.canvasId);
    this.ctx = this.canvas.getContext('2d');
  }

  #gameLoop() {
    this.getDeltaTime(); // Получение delta time в секундах

    if (typeof this.#currentLoop === 'function') {
      this.#currentLoop(); // Вызов текущего цикла игры
    }
    // Выкидываем из стека текущую функцию и добавляем в стек следующую
    nextStep(this.#gameLoop.bind(this));
  }

  #loop() {
    this.#processInput();
    this.#update();
    this.#render(this.ctx);
  }

  getDeltaTime() {
    const currentTime = performance.now(); // Получение текущего времени
    const deltaTime = (currentTime - this.#lastFrameTime) / 1000; // Вычисление разницы во времени в секундах

    this.#lastFrameTime = currentTime; // Обновление значения предыдущего времени

    this.deltaTime = deltaTime; // Обновление значения delta time
  }

  #init() {

  }

  #processInput() {

  }

  #update() {

  }

  #render(canvasContext) {

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
}
