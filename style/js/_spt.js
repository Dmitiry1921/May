/**
 * Created by Dima101 on 23.04.2016.
 */
var _spt = {
    hero: {
        url: [
            "style/img/sprite/hero.png",
            "style/img/sprite/hero1.png"

        ],
        map: undefined, //Массив с картами.
        count: {
            x: 4,
            y: 2,
            mini: {
                x: 12,
                y: 8
            } //Кол-во кадров на спрайт карте. на x и y
        }, //Кол-во тайл карт на картинке по x и y
        frame: {
            w: null,
            h: null,
            bw: null,
            bh: null,
            frameMap: [0,1,2,1],//Показывать кадры в порядке.
            speed: 3, //задержка отображение следеющего кадра
            msp: 0, //Счетчик задержки
            im: 0 //Кадр с которого начнеться воспроизведение.
        }//Параметры одного кадра.

    },
    enemy: {
        url: [
            "style/img/sprite/enemy.png",
            "style/img/sprite/enemy2.png",
            "style/img/sprite/batman.png"
        ],
        count: {
            x: 4,
            y: 2,
            mini: {
                x: 12,
                y: 8
            } //Кол-во кадров на спрайт карте. на x и y
        }, //Кол-во тайл карт на картинке по x и y
        frame: {
            w: null,
            h: null,
            bw: null,
            bh: null
        }, //Параметры одного кадра.
        dom: {}, //Массив с противниками.
        map: undefined //Массив с картами.
    },
    animal: {
        url: [
            "style/img/sprite/animal.png",
            "style/img/sprite/children.png",
        ],
        count: {
            x: 4,
            y: 2,
            mini: {
                x: 12,
                y: 8
            } //Кол-во кадров на спрайт карте. на x и y
        }, //Кол-во тайл карт на картинке по x и y
        frame: {
            w: null,
            h: null,
            bw: null,
            bh: null
        }, //Параметры одного кадра.
        dom: {}, //Массив с противниками.
        map: undefined //Массив с картами.
    },
    nps: {
        url: [
            "style/img/sprite/nps0.png",
            "style/img/sprite/batman.png",
            "style/img/sprite/nps1.png",
            "style/img/sprite/children.png"
        ],
        count: {
            x: 4,
            y: 2,
            mini: {
                x: 12,
                y: 8
            } //Кол-во кадров на спрайт карте. на x и y
        }, //Кол-во тайл карт на картинке по x и y
        frame: {
            w: null,
            h: null,
            bw: null,
            bh: null
        }, //Параметры одного кадра.
        dom: {}, //Массив с противниками.
        map: undefined //Массив с картами.
    },
    interface: {
        url: [
            'style/img/sprite/interface.png'
        ],
        type: "path",
        dom: {}
    },
    face: {
        frame: {
            w: null,
            h: null,
            bw: null,
            bh: null
        },
        map: undefined, //массив координат спрайта
        count: {
            x: 4,
            y: 2,
            mini: {
                x: 4,
                y: 2
            }
        },
        dom: {}, //Массив с лицами.
        url: [
            "style/img/sprite/face/hero0.png",
            "style/img/sprite/face/hero1.png",
            "style/img/sprite/face/17.png",
            "style/img/sprite/face/18.png",
            "style/img/sprite/face/19.png",
            "style/img/sprite/face/20.png",
            "style/img/sprite/face/21.png",
            "style/img/sprite/face/22.png",
            "style/img/sprite/face/23.png",
            "style/img/sprite/face/24.png",
            "style/img/sprite/face/25.png",
            "style/img/sprite/face/26.png",
            "style/img/sprite/face/27.png",
            "style/img/sprite/face/16.png"
        ]
    }
};