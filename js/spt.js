/**
 * Created by Dima101 on 23.04.2016.
 */
// ex _spt
const map32x32 = {
  "0": {
    "0": {
      "x": 0,
      "y": 0
    },
    "1": {
      "x": 0,
      "y": 128
    }
  },
  "1": {
    "0": {
      "x": 96,
      "y": 0
    },
    "1": {
      "x": 96,
      "y": 128
    }
  },
  "2": {
    "0": {
      "x": 192,
      "y": 0
    },
    "1": {
      "x": 192,
      "y": 128
    }
  },
  "3": {
    "0": {
      "x": 288,
      "y": 0
    },
    "1": {
      "x": 288,
      "y": 128
    }
  }
}
const map96x96 = {
  "0": {
    "0": {
      "x": 0,
      "y": 0
    },
    "1": {
      "x": 0,
      "y": 96
    }
  },
  "1": {
    "0": {
      "x": 96,
      "y": 0
    },
    "1": {
      "x": 96,
      "y": 96
    }
  },
  "2": {
    "0": {
      "x": 192,
      "y": 0
    },
    "1": {
      "x": 192,
      "y": 96
    }
  },
  "3": {
    "0": {
      "x": 288,
      "y": 0
    },
    "1": {
      "x": 288,
      "y": 96
    }
  }
};

//Кол-во тайл карт на картинке по x и y
const count32x32 = {
  x: 4,
  y: 2,
  //Кол-во кадров на спрайт карте. на x и y
  mini: {
    x: 12,
    y: 8
  }
};

const count92x92 = {
	x: 4,
	y: 2,
	mini: {
		x: 4,
		y: 2
	}
};

const frame32x32 = {
	w: 32,
	h: 32,
	bw: 96,
	bh: 128,
}
const frame96x96 = {
	w: 96,
	h: 96,
	bw: 96,
	bh: 96
}
export default {
  hero: {
    url: [
      "img/sprite/hero.png",
      "img/sprite/hero1.png"
    ],
    map: map32x32, //Массив с картами.
    count: count32x32,
    //Параметры одного кадра.
    frame: {
      ...frame32x32,
      frameMap: [0, 1, 2, 1],//Показывать кадры в порядке.
      speed: 3, //задержка отображение следующего кадра
      msp: 0, //Счетчик задержки
      im: 0 //Кадр с которого начнется воспроизведение.
    },
    dom: {},
  },
  enemy: {
    url: [
      "img/sprite/enemy.png",
      "img/sprite/enemy2.png",
      "img/sprite/batman.png"
    ],
    //Кол-во тайл карт на картинке по x и y
    count: count32x32,
		//Параметры одного кадра.
    frame: frame32x32,
    dom: {}, //Массив с противниками.
    map: map32x32, //Массив с картами.
  },
  animal: {
    url: [
      "img/sprite/animal.png",
      "img/sprite/children.png",
    ],
		//Кол-во тайл карт на картинке по x и y
    count: count32x32,
    frame: {
      ...frame32x32,
    }, //Параметры одного кадра.
    dom: {}, //Массив с противниками.
    map: map32x32, //Массив с картами.
  },
  nps: {
    url: [
      "img/sprite/nps0.png",
      "img/sprite/batman.png",
      "img/sprite/nps1.png",
      "img/sprite/children.png"
    ],
		//Кол-во тайл карт на картинке по x и y
    count: count32x32,
    frame: {
      ...frame32x32,
    }, //Параметры одного кадра.
    dom: {}, //Массив с противниками.
    map: map32x32 //Массив с картами.
  },
  interface: {
    url: [
      'img/sprite/interface.png'
    ],
    type: "path",
    dom: {}
  },
  face: {
    frame: frame96x96,
    map: map96x96, //массив координат спрайта
    count: count92x92,
    dom: {},
    //Массив с лицами.
    url: [
      "img/sprite/face/hero0.png",
      "img/sprite/face/hero1.png",
      "img/sprite/face/17.png",
      "img/sprite/face/18.png",
      "img/sprite/face/19.png",
      "img/sprite/face/20.png",
      "img/sprite/face/21.png",
      "img/sprite/face/22.png",
      "img/sprite/face/23.png",
      "img/sprite/face/24.png",
      "img/sprite/face/25.png",
      "img/sprite/face/26.png",
      "img/sprite/face/27.png",
      "img/sprite/face/16.png"
    ]
  }
};
