import MobMicroTask from "./MobMicroTask.js";

export default class Character {
  #microtask;
	// TODO Должен уметь работать с различными событиями
	//  - событиями от InputManager
	//  - событиями от CollisionDetection
	//  - событиями от Character например другие Character могут убивать этого Character
	//  - событиями от других объектов
	//  - событиями от игрока
	#microtaskTrigger;
  constructor() {
    this.#microtask = new MobMicroTask();
  }
}
