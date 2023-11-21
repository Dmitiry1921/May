'use strict';

import {Layout} from "../../GameEngine";

import {dialog, Dialog} from './dialog.js';
import {quest} from './quest.js';
import {inventory} from './inventory.js';

const interfaceLayout = new Layout();

interfaceLayout.addChild(dialog);
interfaceLayout.addChild(quest);
interfaceLayout.addChild(inventory);

export {
	Dialog,
	dialog,
	quest,
	inventory,
	interfaceLayout,
}
