/**
 * Created by Dima101 on 24.04.2016.
 */
var _engine,
    _com,
    _Hero,
    _Interface,
    keys,
    keyDown,
    setKey,
    clearKey,
    isKeyDown,
    _Storage,
    _level,
    _Mobs = []; //Объявляем переменные.
    //Позиция персонажа (боком, лицом, спиной..)
var _nextStep = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();
var _gameStart = function(callback){
    _engine = callback;
    _gameStep();
};
var _gameStep = function(){
    _engine();
    _nextStep(_gameStep);
};
var _gameSet = function(callback){
    _engine = callback;
};
var _Memory = function(){
    var _storage = localStorage;
    this.set = function(name,data){
        _storage.setItem(name,JSON.stringify(data));
    };
    this.setOne = function(key,data){
        if(_storage.getItem(key) == null){
            this.set(key,data);
        }
    };
    this.get = function(name){
        return JSON.parse(_storage.getItem(name));
    };
    this.save = function(){
        this.set(_level,{_mobs: _Mobs, _map: _lvl[_level].map});
        this.set('_hero',_Hero);
    };
    this.unset = function(lvl){
        _gameSet(function(){});
        if(lvl == undefined) _storage.clear(); else this.set(lvl,null);
    }
};

_com = {top: 3, left: 1, right: 2, bottom : 0};
keys = {
    'W'     : 87,
    'A'     : 65,
    'S'     : 83,
    'D'     : 68,
    'LEFT'  : 37,
    'RIGHT' : 39,
    'TOP'   : 38,
    'DOWN'  : 40,
    'SPACE' : 32
};
keyDown = {};
setKey = function(k){
    this.keyDown[k] = true;
};
clearKey = function(k){
    this.keyDown[k] = false;
};
isKeyDown  = function(k){
    return this.keyDown[this.keys[k]] == true;
};
window.onkeydown = function(e){
    setKey(e.keyCode);
};
window.onkeyup = function(e){
    clearKey(e.keyCode);
};



function genArr(columns,rows){
    var arr = {};
    for (var i = 0; i < columns; i++) {
        arr[i] = {};
        for (var j = 0; j < rows; j++) {
            arr[i][j] = null;//Двухмерный массив.
        }
    }
    return arr;
}
var _Sprite = {
    loaded: false,
    count: null, //Кол-во картинок.
    isload: 0, //Ко-во загруженых картинок.
    load: function(callback){
        var j = 0; //счетчик загруженых картинок.
        if(!this.loaded){
            this.loaded = true;
            var $this = this;
            for(var id in _spt){
                var i = _spt[id];
                for(var j in i.url){
                    var url = i.url[j];
                    if(i.dom == undefined) i['dom'] = {};
                    i['dom'][j] = document.createElement("img");
                    i['dom'][j].src = url;
                    i['dom'][j].onload = function(){
                        $this.isload += 1;
                    };
                    this.count +=1;
                }
            }
        }
        if(this.count == this.isload){
            this.genMap();
            callback();
        }
    },
    genMap:function(){
        for(var id in _spt){
            var itm = _spt[id],
                count = itm.count,
                f = itm.frame,
                img = itm.dom[0];
            if(count != undefined) {
                f.w = img.width / count.mini.x;
                f.h = img.height / count.mini.y;
                f.bw = img.width / count.x;
                f.bh = img.height / count.y;

                itm.map = genArr(count.x, count.y);

                for (var x = 0; x < count.x; x++) {
                    for (var y = 0; y < count.y; y++) {
                        var nx = 0;
                        var ny = 0;
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
};
_Sprite.load();
_Storage = new _Memory();
//Если пользователь зашел первый раз в игру устанавливаем настройки..
_Storage.setOne('_lvl',0); //Устанавливаем уровень персонажа.
_Storage.setOne('_inventory',{tool: null, itms: {0: null, 1: null,2: null,3: null, 4: null}});
_level = _Storage.get("_lvl");