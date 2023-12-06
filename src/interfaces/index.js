'use strict';

import {Layout} from "../../GameEngine";

import {dialog, Dialog} from './dialog.js';
import {quest} from './quest.js';
import {inventory} from './inventory.js';
import {healthPower} from './healthPower.js'

const interfaceLayout = new Layout();

interfaceLayout.addChild(dialog);
interfaceLayout.addChild(quest);
interfaceLayout.addChild(inventory);
interfaceLayout.addChild(healthPower);

export {
	Dialog,
	healthPower,
	dialog,
	quest,
	inventory,
	interfaceLayout,
}
