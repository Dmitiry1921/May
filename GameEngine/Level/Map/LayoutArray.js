'use strict';

export class LayoutArray extends Array {
	processInput(deltaTime) {
		this.forEach(layout => layout.processInput(deltaTime));
	}
	update(deltaTime) {
		this.forEach(layout => layout.update(deltaTime));
	}
	render(canvasContext) {
		this.forEach(layout => layout.render(canvasContext));
	}
}
