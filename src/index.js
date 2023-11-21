'use strict';

import {GameEngine} from "../GameEngine";
import gameEngineConfig from "../config/gameEngine.config.json" assert {type: 'json'};
import {levelZero} from "./levels/Zero";
// import {levelOne} from "./levels/One";
// import {levelTwo} from "./levels/Two";
// import {levelTree} from "./levels/Tree";

const gameEngine = new GameEngine(gameEngineConfig);

gameEngine.registerLevel('zero', levelZero);
// gameEngine.registerLevel('one', levelOne);
// gameEngine.registerLevel('two', levelTwo);
// gameEngine.registerLevel('tree', levelTree);

gameEngine.setLevel('zero');
// gameEngine.setLevel('one');
// gameEngine.setLevel('two');
// gameEngine.setLevel('tree');

gameEngine.startLoop();
