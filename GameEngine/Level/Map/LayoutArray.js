export class LayoutArray extends Array {
  render() {
   this.forEach(layout => layout.render());
  }
}
