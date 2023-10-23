export class LayoutArray extends Array {
	processInput(inputManager) {
		this.forEach(layout => layout.processInput(inputManager));
	}
	update(deltaTime) {
		this.forEach(layout => layout.update(deltaTime));
	}
	render(canvasContext) {
		this.forEach(layout => layout.render(canvasContext));
	}
}
