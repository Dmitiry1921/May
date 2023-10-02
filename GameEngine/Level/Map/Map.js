import {GameObject} from "../../GameObject.js";
import {LayoutArray} from "./LayoutArray.js";

export class Map extends GameObject {
  constructor() {
    super();
    this.layouts = new LayoutArray();
  }
  processInput() {

  }

  update() {

  }

  render(canvasContext) {
    this.layouts.render();
  }
}
