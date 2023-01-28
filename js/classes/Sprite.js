import sprite from "../config/sprite.js";

function genArr(columns, rows) {
  const arr = {};
  for (let i = 0; i < columns; i++) {
    arr[i] = {};
    for (let j = 0; j < rows; j++) {
      arr[i][j] = null; //Двухмерный массив.
    }
  }
  return arr;
}

export default new class Sprite {
  constructor() {
    this.loaded = false;
    this.count = null; //Кол-во картинок.
    this.isload = 0; //Ко-во загруженных картинок.

    this.load();
  }
  load(callback) {
    if (!this.loaded) {
      this.loaded = true;
      let $this = this;
      for (let id in sprite) {
        let i = sprite[id];
        for (let j in i.url) {
          let url = i.url[j];
          if (i.dom === undefined) i['dom'] = {};
          i['dom'][j] = document.createElement("img");
          i['dom'][j].src = url;
          i['dom'][j].onload = function () {
            $this.isload += 1;
          };
          this.count += 1;
        }
      }
    }
    if (this.count === this.isload) {
      this.genMap();
      callback();
    }
  }
  genMap() {
    for (let id in sprite) {
      let itm = sprite[id],
        count = itm.count,
        f = itm.frame,
        img = itm.dom[0];
      if (count !== undefined) {
        f.w = img.width / count.mini.x;
        f.h = img.height / count.mini.y;
        f.bw = img.width / count.x;
        f.bh = img.height / count.y;

        itm.map = genArr(count.x, count.y);

        for (let x = 0; x < count.x; x++) {
          for (let y = 0; y < count.y; y++) {
            let nx = 0;
            let ny = 0;
            if (x) {
              nx = f.bw * x;
            }
            if (y) {
              ny = f.bh * y;
            }
            itm.map[x][y] = {
              x: nx,
              y: ny
            };
          }
        }
      }
    }
  }
}
