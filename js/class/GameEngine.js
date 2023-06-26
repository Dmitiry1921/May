'use strict';

import storage from "./Storage.js";
import _spt from "../spt.js";
import {isBrowser} from "../utils/env.js";
import ImageLoader from "./ImageLoader.js";

function requestAnimationFrame(callback) {
  callback();
  setTimeout(requestAnimationFrame, 1000 / 60)
}

export default class GameEngine {
  #lastFrameTime; // Переменная времени на предыдущем кадре
  #nextStep; // Переменная для хранения функции requestAnimationFrame
  #currentLoop; // Переменная для хранения текущего цикла игры
  constructor() {
    this.#lastFrameTime = performance.now(); // Инициализация переменной времени на предыдущем кадре
    this.#nextStep = isBrowser() ? window.requestAnimationFrame : requestAnimationFrame;
    this.#currentLoop = console.warn.bind(this, 'Engine not set');
    this.deltaTime = 0; // Инициализация переменной delta time

    this.gameLoop(); // Запуск игрового цикла
  }
  gameLoop() {
    this.#getDeltaTime(); // Получение delta time в секундах

    if(typeof this.#currentLoop === 'function') {
      this.#currentLoop(); // Вызов текущего цикла игры
    }
    // Выкидываем из стека текущую функцию и добавляем в стек следующую
    setTimeout(() => this.#nextStep(this.gameLoop.bind(this)), 0);
  }
  #loop() {
    this.#processInput();
    this.#update();
    this.#render();
  }
  #getDeltaTime() {
    const currentTime = performance.now(); // Получение текущего времени
    const deltaTime = (currentTime - this.#lastFrameTime) / 1000; // Вычисление разницы во времени в секундах

    this.#lastFrameTime = currentTime; // Обновление значения предыдущего времени

    this.deltaTime = deltaTime; // Обновление значения delta time
  }
  #processInput() {

  }
  #update() {

  }
  #render() {

  }
  stopLoop() {
    this.#currentLoop = console.info.bind(this, 'Engine stopped');
  }
  startLoop() {
    this.#currentLoop = this.#loop;
  }

  pause() {

  }
  resume() {

  }
  setLevel(lvl) {
    storage.stopAutoSave();
    this.stopLoop(); // останавливаем игровой процесс
    // _Mobs.length = 0; // TODO решить куда поместить мобов

    //Загружаем всех персонажей, NPS и противников, которые есть на карте.
    // _Interface = !_Interface ? new Interface() : _Interface; // TODO
    const urls = Object.values(_spt).map(({url}) => url);
    console.log({urls: urls.flat()});
    (new ImageLoader(urls.flat()[0])).then(res => console.log(res));
    ImageLoader.all(urls.flat()).then((res) => console.log(res));
    console.log('asdasdas')
    // _Sprite.load(() => { //Загружаем спрайт карты.
    //   if (storage[lvl] === null) {
    //     createMobs(lvl);
    //   } else {
    //     mapInit(lvl);
    //     mobInit(lvl);
    //     heroInit(lvl);
    //   }
    //   _Map.canvasSetting(); //Настраиваем canvas.
    //   _Map.tileLoader(_gameSet.bind(this, loop)); //Загружаем тайл карты которые у нас имеются.
    //
    //   runHookAfterLoadMob();
    // });
    //
    storage.startAutoSave();
    storage._lvl = lvl;
  }
}
