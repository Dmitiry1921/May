/**
 * Created by Dima101 on 24.04.2016.
 */

var _engine;
//Позиция персонажа (боком, лицом, спиной..)
var _nextStep = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();
export function _gameStart(callback) {
  _engine = callback;
  _gameStep();
}
export function _gameStep () {
  _engine();
  _nextStep(_gameStep);
}
export function _gameSet(callback) {
  _engine = callback;
}
