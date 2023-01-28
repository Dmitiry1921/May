/**
 * Created by Dima101 on 22.04.2016.
 */
var _tile = {
  defMap: null,  //устанавливаем стандартный тайл.
  default: null, //Этим значение будет наполняться карта по умолчанию.
  param: {
    w: 32,
    h: 32
  }, //Параметры тайлов.
  1: {
    dom: undefined,
    url: "img/tiles/main.png",
    map: [{"tileID": 1, "x": 0, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 288, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 288,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 288, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 288,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 288, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 288,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 320, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 320,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 320, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 320,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 320, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 320,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 448, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 448,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 448, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 448,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 448, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 448,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 480, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 480,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 480, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 480,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 480, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 480,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 512, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 512,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 512, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 512,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 512, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 512,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 544, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 544,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 544, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 544,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 544, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 544,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 576, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 576,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 576, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 576,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 576, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 576,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 672, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 672,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 672, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 672,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 672, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 672,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 704, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 704,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 704, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 704,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 704, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 704,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 736, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 736,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 736, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 736,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 736, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 736,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 768, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 768,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 768, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 768,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 768, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 768,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 800, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 800,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 800, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 800,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 800, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 800,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 832, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 832,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 832, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 832,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 832, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 832,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 864, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 864,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 864, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 864,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 864, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 864,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 896, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 896,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 896, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 896,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 896, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 896,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 928, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 928,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 928, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 928,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 928, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 928,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 960, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 960,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 960, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 960,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 960, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 960,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 992, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 992,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 992, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 992,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 992, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 992,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1024, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1024,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1024, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1024,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1024, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1024,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1088, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1088,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1088, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1088,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1088, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1088,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1120, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1120,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1120, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1120,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1120, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1120,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1152, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1152,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1152, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1152,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1152, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1152,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1184, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1184,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1184, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1184,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1184, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1184,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1216, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1216,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1216, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1216,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1216, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1216,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1248, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1248,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1248, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1248,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1248, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1248,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1312, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1312,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1312, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1312,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1312, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1312,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1344, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1344,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1344, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1344,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1344, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1344,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1376, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1376,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1376, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1376,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1376, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1376,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1408, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1408,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1408, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1408,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1408, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1408,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 0, "y": 1440, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 32,
      "y": 1440,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 64, "y": 1440, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 96,
      "y": 1440,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 1, "x": 128, "y": 1440, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 1,
      "x": 160,
      "y": 1440,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }]
  },
  11: {
    dom: undefined,
    url: "img/tiles/plane.png",
    map: [{"tileID": 11, "x": 0, "y": 0, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 0,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 0, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 0,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 0, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 0,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 32, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 32,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 32, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 32,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 32, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 32,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 64, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 64,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 64, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 64,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 64, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 64,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 96, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 96,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 96, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 96,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 96, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 96,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 128, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 128,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 128, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 128,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 128, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 128,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 160, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 160,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 160, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 160, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 160,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 192, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 192,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 192, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 192,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 192, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 192,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 224, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 224,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 224, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 224,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 224, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 224,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 256, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 256,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 256, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 256,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 256, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 256,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 288, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 288,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 288, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 288,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 288, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 288,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 320, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 320,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 320, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 320,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 320, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 320,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 352, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 352,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 352, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 352,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 352, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 352,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 384, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 384,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 384, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 384,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 384, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 384,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 416, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 416,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 416, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 416,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 416, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 416,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 480, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 480,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 480, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 480,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 480, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 480,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 512, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 512,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 512, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 512,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 512, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 512,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 544, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 544,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 544, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 544,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 544, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 544,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 576, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 576,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 576, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 576,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 576, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 576,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 640, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 640,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 640, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 640,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 640, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 640,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 672, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 672,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 672, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 672,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 672, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 672,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 704, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 704,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 704, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 704,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 704, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 704,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 736, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 736,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 736, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 736,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 736, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 736,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 768, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 768,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 768, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 768,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 768, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 768,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 832, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 832,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 832, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 832,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 832, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 832,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 864, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 864,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 864, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 864,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 864, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 864,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 896, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 896,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 896, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 896,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 896, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 896,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 928, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 928,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 928, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 928,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 928, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 928,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 960, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 960,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 960, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 960,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 960, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 960,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 992, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 992,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 992, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 992,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 992, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 992,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1024, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1024,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1024, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1024,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1024, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1024,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1088, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1088,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1088, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1088,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1088, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1088,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1120, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1120,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1120, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1120,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1120, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1120,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1152, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1152,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1152, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1152,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1152, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1152,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1184, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1184,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1184, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1184,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1184, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1184,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1216, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1216,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1216, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1216,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1216, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1216,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1248, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1248,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1248, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1248,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1248, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1248,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1280, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1280,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1280, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1280,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1280, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1280,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1312, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1312,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1312, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1312,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1312, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1312,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1344, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1344,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1344, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1344,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1344, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1344,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1376, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1376,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1376, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1376,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1376, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1376,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1408, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1408,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1408, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1408,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1408, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1408,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1440, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1440,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1440, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1440,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1440, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1440,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1472, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1472,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1472, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1472,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1472, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1472,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1504, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1504,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1504, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1504,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1504, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1504,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1536, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1536,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1536, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1536,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1536, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1536,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1568, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1568,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1568, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1568,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1568, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1568,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1600, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1600,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1600, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1600,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1600, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1600,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1632, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1632,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1632, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1632,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1632, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1632,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1664, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1664,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1664, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1664,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1664, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1664,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1696, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1696,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1696, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1696,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1696, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1696,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1728, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1728,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1728, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1728,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1728, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1728,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1760, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1760,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1760, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1760,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1760, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1760,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1792, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1792,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1792, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1792,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1792, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1792,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1824, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1824,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1824, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1824,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1824, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1824,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1856, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1856,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1856, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1856,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1856, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1856,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1888, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1888,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1888, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1888,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1888, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1888,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1920, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1920,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1920, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1920,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1920, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1920,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1952, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1952,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1952, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1952,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1952, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1952,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 1984, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 1984,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 1984, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 1984,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 1984, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 1984,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2016, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2016,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2016, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2016,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2016, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2016,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2048, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2048,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2048, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2048,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2048, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2048,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2080, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2080,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2080, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2080,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2080, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2080,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2112, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2112,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2112, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2112,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2112, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2112,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2144, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2144,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2144, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2144,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2144, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2144,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2176, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2176,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2176, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2176,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2176, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2176,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2208, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2208,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2208, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2208,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2208, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2208,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2240, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2240,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2240, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2240,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2240, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2240,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2272, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2272,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2272, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2272,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2272, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2272,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2304, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2304,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2304, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2304,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2304, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2304,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2336, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2336,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2336, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2336,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2336, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2336,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 0, "y": 2368, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 32,
      "y": 2368,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 64, "y": 2368, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 96,
      "y": 2368,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 11, "x": 128, "y": 2368, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 11,
      "x": 160,
      "y": 2368,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }]
  },
  2: {
    dom: undefined,
    url: "img/tiles/tiled.png",
    map: [{"tileID": 2, "x": 0, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 0, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 0,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 32, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 32,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 64,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 64, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 64,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 96,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 96,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 96, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 96,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 128,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 224, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 256, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 256,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 288, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 288,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 288, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 288,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 288, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 288,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 288, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 288,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 288, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 288,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 288, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 288,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 288, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 288,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 288, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 288,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 320, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 320,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 320, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 320,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 320, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 320,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 320, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 320,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 320, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 320,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 320, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 320,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 320, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 320,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 320, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 320,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 352, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 352, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 352,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 384, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 448, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 448,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 448, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 448,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 448, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 448,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 448, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 448,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 448, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 448,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 448,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 0, "y": 480, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 32,
      "y": 480,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 64, "y": 480, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 96,
      "y": 480,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 128, "y": 480, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 160,
      "y": 480,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 192, "y": 480, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 224,
      "y": 480,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 256, "y": 480, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 288,
      "y": 480,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 320, "y": 480, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 352,
      "y": 480,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 384, "y": 480, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 416,
      "y": 480,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 2, "x": 448, "y": 480, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 2,
      "x": 480,
      "y": 480,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }]
  },
  3: {
    dom: undefined,
    url: "img/tiles/building.png",
    map: [{"tileID": 3, "x": 0, "y": 0, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 0,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 0, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 0,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 0, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 0,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 32, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 32,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 32, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 32,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 32, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 32,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 64, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 64,
      "wall": 1,
      "overlay": 0,
      "use": 0,
      "user": 1
    }, {"tileID": 3, "x": 64, "y": 64, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 64,
      "wall": 1,
      "overlay": 0,
      "use": 0,
      "user": 1
    }, {"tileID": 3, "x": 128, "y": 64, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 64,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 96, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 96,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 96, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 96,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 96, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 96,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 128, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 128,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 128, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 128,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 128, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 128,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 160, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 160,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 160, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 160,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 160, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 160,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 192, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 192,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 192, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 192,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 224, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 224,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 224, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 224,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 224, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 224,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 256, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 256,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 256, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 256,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 256, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 256,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 288, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 288,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 288, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 288,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 288, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 288,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 320, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 320,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 320, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 320,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 320, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 320,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 352, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 352,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 352, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 352,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 352, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 352,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 384, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 384,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 384, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 384,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 384, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 384,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 416, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 416,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 416, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 416,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 416, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 416,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 448, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 480, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 480,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 480, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 480,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 480, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 480,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 512, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 512,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 512, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 512,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 512, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 512,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 544, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 544,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 544, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 544,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 544, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 544,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 576, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 576,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 576, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 576,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 576, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 576,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 608, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 608,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 608, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 672, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 672,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 672, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 672,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 672, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 672,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 704, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 704,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 704, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 704,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 704, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 704,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 736, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 736,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 736, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 736,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 736, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 736,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 768, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 768,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 768, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 768,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 768, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 768,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 832, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 832,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 832, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 832,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 832, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 832,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 864, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 864,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 864, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 864,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 864, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 864,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 896, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 896,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 896, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 896,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 896, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 896,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 928, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 928,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 928, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 928,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 928, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 928,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 960, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 960,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 960, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 960,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 960, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 960,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 992, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 992,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 992, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 992,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 992, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 992,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1024, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1024,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1024, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1024,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1024, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1024,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1056,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1088, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1088,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1088, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1088,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1088, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1088,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1120, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1120,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1120, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1120,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1120, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1120,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1152, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1152,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1152, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1152,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1152, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1152,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1184, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1184,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1184, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1184,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1184, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1184,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1216, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1216,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1216, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1216,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1216, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1216,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1248, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1248,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1248, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1248,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1248, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1248,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1312, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1312,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1312, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1312,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1312, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1312,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1344, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1344,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1344, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1344,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1344, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1344,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1376, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1376,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1376, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1376,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1376, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1376,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1408, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1408,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1408, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1408,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1408, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1408,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1440, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1440,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1440, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1440,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1440, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1440,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1472, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1472,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1472, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1472,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1472, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1472,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1504, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1504,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1504, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1504,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1504, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1504,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1536, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1536,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1536, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1536,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1536, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1536,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1568, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1568,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1568, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1568,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1568, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1568,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1600, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1600,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1600, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1600,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1600, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1600,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1632, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1632,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1632, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1632,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1632, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1632,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1664, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1664,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1664, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1664,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1664, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1664,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1696, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1696,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1696, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1696,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1696, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1696,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1728, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1728,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1728, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1728,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1728, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1728,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1760, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1760,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1760, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1760,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1760, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1760,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1792, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1792,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1792, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1792,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1792, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1792,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1824, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1824,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1824, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1824,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1824, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1824,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1856, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1856,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1856, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1856,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1856, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1856,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1888, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1888,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1888, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1888,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1888, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1888,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1920, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1920,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1920, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1920,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1920, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1920,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1952, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1952,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1952, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1952,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1952, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1952,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 1984, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 1984,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 1984, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 1984,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 1984, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 1984,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2016, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2016,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2016, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2016,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2016, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2016,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2048, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2048,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2048, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2048,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2048, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2048,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2080, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2080,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2080, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2080,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2080, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2080,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2112, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2112,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2112, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2112,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2112, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2112,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2144, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2144,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2144, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2144,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2144, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2144,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2176, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2176,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2176, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2176,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2176, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2176,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2208, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2208,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2208, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2208,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2208, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2208,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2240, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2240,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2240, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2240,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2240, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2240,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2272, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2272,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2272, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2272,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2272, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2272,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2304, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2304,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2304, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2304,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2304, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2304,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2336, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2336,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2336, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2336,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2336, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2336,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2368, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2368,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2368, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2368,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2368, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2368,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2400, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2400,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2400, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2400,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2400, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2400,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2432, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2432,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2432, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2432,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2432, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2432,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2464, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2464,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2464, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2464,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2464, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2464,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2496, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2496,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2496, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2496,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2496, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2496,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2528, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2528,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2528, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2528,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2528, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2528,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2560, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2560,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2560, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2560,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2560, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2560,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2592, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2592,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2592, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2592,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2592, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2592,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2624, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2624,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2624, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2624,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2624, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2624,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2656, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2656,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2656, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2656,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2656, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2656,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2688, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2688,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2688, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2688,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2688, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2688,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2720, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2720,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2720, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2720,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2720, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2720,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2752, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2752,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2752, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2752,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2752, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2752,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2784, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2784,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2784, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2784,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2784, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2784,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2816, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2816,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2816, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2816,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2816, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2816,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2848, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2848,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2848, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2848,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2848, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2848,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2880, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2880,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2880, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2880,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2880, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2880,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2912, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2912,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2912, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2912,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2912, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2912,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2944, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2944,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2944, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2944,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2944, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2944,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 2976, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 2976,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 2976, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 2976,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 2976, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 2976,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3008, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3008,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3008, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3008,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3008, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3008,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3040, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3040,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3040, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3040,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3040, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3040,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3072, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3072,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3072, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3072,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3072, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3072,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3104, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3104,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3104, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3104,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3104, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3104,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3136, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3136,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3136, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3136,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3136, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3136,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3168, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3168,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3168, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3168,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3168, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3168,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3200, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3200,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3200, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3200,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3200, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3200,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3232, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3232,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3232, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3232,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3232, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3232,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3264, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3264,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3264, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3264,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3264, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3264,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3296, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3296,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3296, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3296,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3296, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3296,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3328, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3328,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3328, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3328,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3328, "wall": 1, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3328,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3360, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3360,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3360, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3360,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3360, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3360,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3392, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3392,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3392, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3392,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3392, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3392,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3424, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3424,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3424, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3424,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3424, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3424,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3456, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3456,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3456, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3456,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3456, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3456,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3488, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3488,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3488, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3488,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3488, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3488,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3520, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3520,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3520, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3520,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3520, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3520,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3552, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3552,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3552, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3552,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3552, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3552,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3584, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3584,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3584, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3584,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3584, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3584,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3616, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3616,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3616, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3616,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3616, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3616,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3648, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3648,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3648, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3648,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3648, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3648,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3680, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3680,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3680, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3680,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3680, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3680,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3712, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3712,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3712, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3712,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3712, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3712,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3744, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3744,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3744, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3744,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3744, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3744,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3776, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3776,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3776, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3776,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3776, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3776,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3808, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3808,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3808, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3808,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3808, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3808,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3840, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3840,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3840, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3840,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3840, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3840,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3872, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3872,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3872, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3872,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3872, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3872,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3904, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3904,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3904, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3904,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3904, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3904,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3936, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3936,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3936, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3936,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3936, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3936,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 3968, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 3968,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 3968, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 3968,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 3968, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 3968,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4000, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4000,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4000, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4000,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4000, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4000,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4032, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4032,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4032, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4032,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4032, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4032,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4064, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4064,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4064, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4064,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4064, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4064,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4096, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4096,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4096, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4096,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4096, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4096,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4128, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4128,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4160, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4160,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4192, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4192,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4192, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4192,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4192, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4192,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4224, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4224,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4224, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4224,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4224, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4224,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4256, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4256,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4256, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4256,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4256, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4256,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4288, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4288,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4288, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4288,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4288, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4288,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4320, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4320,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4320, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4320,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4320, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4320,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4352, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4352,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4352, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4352,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4352, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4352,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4384, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4384,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4384, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4384,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4384, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4384,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4416, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4416,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4416, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4416,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4416, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4416,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4448, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4448,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4448, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4448,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4480, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4480,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4480, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4480,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4480, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4480,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4512, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4512,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4512, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4512,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4512, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4512,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4544, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4544,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4544, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4544,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4544, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4544,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4576, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4576,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4576, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4576,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4576, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4576,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4608, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4608,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4640, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4640,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4672, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4672,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4672, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4672,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4672, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4672,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4704, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4704,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4704, "wall": 1, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4704,
      "wall": 1,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4704, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4704,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4736, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4736,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4736, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4736,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4736, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4736,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4768, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4768,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4768, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4768,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4768, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4768,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4800, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4800,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4832, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4832,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4832, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4832,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4832, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4832,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4864, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4864,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4864, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4864,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4864, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4864,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4896, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4896,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4896, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4896,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4896, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4896,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4928, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4928,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4928, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4928,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4928, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4928,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4960, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4960,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4960, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4960,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4960, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4960,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 4992, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 4992,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 4992, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 4992,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 4992, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 4992,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5024, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5024,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5024, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5024,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5024, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5024,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5056,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5056, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5056,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5056, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5056,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5088, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5088,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5088, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5088,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5088, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5088,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5120, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5120,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5120, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5120,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5120, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5120,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5152, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5152,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5152, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5152,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5152, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5152,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5184, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5184,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5184, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5184,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5184, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5184,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5216, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5216,
      "wall": 1,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5216, "wall": 1, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5216,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5216, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5216,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5248, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5248,
      "wall": 0,
      "overlay": 1,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5248, "wall": 0, "overlay": 1, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5248,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5248, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5248,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5280, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5280,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5312, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5312,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5312, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5312,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5312, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5312,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5344, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5344,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5344, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5344,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5344, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5344,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 0, "y": 5376, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 32,
      "y": 5376,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 64, "y": 5376, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 96,
      "y": 5376,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }, {"tileID": 3, "x": 128, "y": 5376, "wall": 0, "overlay": 0, "use": 0}, {
      "tileID": 3,
      "x": 160,
      "y": 5376,
      "wall": 0,
      "overlay": 0,
      "use": 0
    }]
  }
};
