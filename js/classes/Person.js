import Map from './Map.js';
import Storage from './Storage.js';
import KeyBoard from './KeyBoard.js';
import _Interface from './Interface.js';

import sprite from "../config/sprite.js";
import _lvl from "../config/lvl.js";
import {_com} from "../config/main.js";
import global from "../config/global.js";
import items from "../config/items.js";

let _level = Storage.get('_lvl');

export default class Person {
  constructor(ctx, x, y) {
    this.nps = null; //id nps с которым я взаимодействую.
    this.type = "hero";
    this.face = 0; //Пол персонажа парень 0 девушка 1. !!!!!(Не проверялось..)!!!!!!!!!
    this.sprite = {
      x: 2, //Положение персонажа на спрайт карте
      y: 0 //Положение персонажа на спрайт карте
    };
    this.status =  {
      pos: {
        x: 3,
        y: -6
      }, //положение статуса относильно персонажа.
      w: 26,
      h: 4
    };
    this.tool =  {
      s: {
        0:{name: 'Топор', pos : 'top'},
        1:{name: 'Тесак', pos : 'right'},
        2:{name: 'Сабля', pos : 'left'},
        3:{name: 'Мачете', pos : 'bottom'}
      }, //Предметы доступные персонажу.
      frame: {
        speed: 5, //задержка отображение следеющего кадра
        msp : 0, //Ячейка памяти задержки отображение следеющего кадра
        im: 0, //Кадр с которого начнеться воспроизведение.
        map: [0,1,2,1], //Порядок воспроизведения кадров.
        width: 32,
        height: 32,
        x: 5, //Положение топора относительно персонажа
        y: -38 //Положение топора относительно персонажа
      },//Параметры кадров.
      x: 3, //Положение топора на спрайт карте
      y: 1 //Положение топора на спрайт карте
    };
    this.can = {
      attack: false, //Можем ли мы атаковать ?
      walk: true //Флаг говорящий о том что персонаж может перемещаться..
    };
    this.memory =  {
      dump: {
        x: null, //точка персонажа на холсте
        y: null, //точка персонажа на холсте
        cell: undefined //точка x,y на карте где находиться персонаж.
      },
      x: null, //точка персонажа на холсте
      y: null, //точка персонажа на холсте
      pos: 'bottom', //положение в пространстве
      cell: undefined, //точка x,y на карте где находиться персонаж.
      digger: 0 //счетчик выполнения действия.
    }; //Память персонажа
    this.options =  {
      quest: null, //текущее задание.
      digger: 200, //время пока персонаж добывает что либо..
      tool : null, //Активный предмет.
      max: {
        health : 5 //Очки жизни
      }, //макмимумы.
      radios: 5, //Радиус атаки игрока..
      speed: 2,//скорость
      damage: 1, //Урон который может нанести персонаж.
      health : 1 //Очки жизни
    }; //Статы.


    this.memory.x = x*_tile.param.w;
    this.memory.y = y*_tile.param.h;
  }

  canTakeIt(ctx){
    //Проверяем если действие произходит в координате, есть ли там объект который я могу получить ?
    var h = {w: _tile.param.w, h: _tile.param.h, x: this.memory.x, y: this.memory.y,s: this.status},//Персонаж.
      dx,dy, bool = false;
    //Получаем ячейку на которой стит персонаж сходя из его размеров..
    dx = Math.floor((h.x+h.w/2)/ h.w);
    dy = Math.floor((h.y+h.h)/ h.h);
    //Смотрим ячейку на которой стоим и проверяем можем ли мы ее взять.
    var cell = _lvl[_level].map[dx][dy], stop = false;
    //Проверяем каждый слой карты на наличие на нем предметов.
    for(var l in cell){
      var c = cell[l];
      for(var itm in items){
        var i = items[itm].map;
        if(c.id === i.id && c.tile === i.tile){
          stop = true;
          bool = true;
          break;
        }
      }
      if(stop) break;
    }
    if(bool){
      var i = this.memory,
        max = this.options,
        ps = i.digger/max.digger,
        w = (h.s.w-2)*ps;
      //рисуем статус бар..
      ctx.fillStyle="#054807";
      ctx.fillRect(h.x+h.s.pos.x, h.y+h.s.pos.y-5,h.s.w,h.s.h);
      ctx.fillStyle="#2AFF10";
      ctx.fillRect(h.x+h.s.pos.x+1, h.y+h.s.pos.y-4,w,h.s.h-2);
      //предмет найден запускаем таймер для того что бы полуить его.
      i.digger= i.digger+1 < max.digger ? i.digger+1 : max.digger; //Увеличиваем счетчик.
      if(i.digger === max.digger){
        //удаляем этот элемент с карты
        _lvl[_level].map[dx][dy][l] = {tile: null, id: null};
        _Interface.inventory.add(parseInt(itm),parseInt(1)); //Добавляем 1 элемент в инвентарь игрока.
        //Выкапываем на этом участке карты предмет который нас интересует.
        i.digger=0;//Обнуляем счетчик..
      }
    }
  };
  setTool(id){
    this.options.tool = id;
    var st = Storage.get('_inventory');
    st.tool = id;
    Storage.set('_inventory',st); //Записываем..
  };
  setQuest(obj){
    /**
     * @type {obj} - Объект типа {itm: @id, count,callback: function(){}}
     * функция устанавливаем ивент, для персонажа.
     */
    this.options.quest = obj;
  }; //Устанавливаем тот или иной квест.
  questComplete(){
    var q = this.options.quest; //квест.
    if(q != null){
      //определяем что это за квест.
      if(q.itm !== undefined && q.count !== undefined){
        if(_Interface.inventory.isSet(q.itm, q.count)){
          eval(q.callback);
          this.options.quest = null;
        }
      }else{
        if(q.lvl === _level){
          //Задание убить всех мобов
          if(Map.countEnemy() === 0){
            //Убиты все враги..
            eval(q.callback);
            this.options.quest = null;
          }
        }
      }
    }

  };//Проверяем квест на завершение.
  attack(){
    if(this.options.tool !== null && this.can.attack){//В руке имеется что-то чем можно бить по башке.
      //Проверяем на столкновение в радиусе..
      for(let i=0; i<global._Mobs.length; i++){
        const mob = global._Mobs[i];
        if(mob.type !== "enemy") continue;
        //И так это враг, получаем его координату. и радиус..
        const enemy = {x: mob.x-(mob.width/2),y: mob.y-(mob.height/2), r: mob.options.radius+mob.width};
        const hero = {x: this.memory.x-16,y: this.memory.y-16, r: this.options.radios+32};

        const dx = enemy.x - hero.x;
        const dy = enemy.y - hero.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.r + hero.r) {
          if(this.can.attack){
            this.can.attack = false;
            mob.options.health = mob.options.health-this.options.damage >= 0 ? mob.options.health-this.options.damage: 0;
            if(mob.options.health <= 0){
              //Убили Моба.
              global._Mobs.splice(i,1);
            }
            //Отнимает чуть-чуть жизней..
            setTimeout(() =>{
              this.can.attack = true; //Разрешаем игроку атаковать снова..
            },700);
          }
        }
      }
    }
  };//Учим персонажа атаковать врагов.
  drawStatus(ctx) {
    const op = this.options;
    const st = this.status;
    let x, y, pst;
    pst = op.health/op.max.health; //Процент от чиста
    ctx.fillStyle = '#610101';
    x = this.memory.x+st.pos.x;
    y = this.memory.y+st.pos.y;
    if(pst !== 1) {
      ctx.fillRect(x, y, st.w, st.h);
      ctx.fillStyle = '#e11e26';
      ctx.fillRect(x + 1, y + 1, (st.w - 2) * pst, st.h - 2);
    }
    if(pst === 0) this.gameOver();
  };
  isCollision(x1,y1,w1,h1,x2,y2,w2,h2){
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2;
  };
  collision(nx,ny,callback) {
    const arr = _lvl[_level].map,
      tile = _tile,
      sp = this.options.speed,
      hero = {
        x: nx,
        y: ny,
        w: sprite.hero.frame.w,
        h: sprite.hero.frame.h
      };
    let bool = false;
    for (let x in arr) {
      for (let y in arr[x]) {
        for (let l in arr[x][y]) {
          const i = arr[x][y][l];
          if (i.tile === tile.defMap || i.id === tile.default) continue;
          const itm = tile[i.tile].map[i.id];
          if (itm.wall === 0) continue;
          const titm = tile.param;
          if (!this.isCollision(x * titm.w, y * titm.h, titm.w, titm.h, (hero.x+sp), (hero.y+((hero.h/4)*3)), (hero.w-(sp*2)), hero.h/4))
            continue;
          else bool = true; //Сталкновение !!!!
        }
      }
    }
    //Столкновение с мобоми
    for(var id in global._Mobs) {
      var i = global._Mobs[id];
      if (i.type === this.type) continue;
      //Получаем габариты и координаты для проверки столкновения.
      var en = {x: i.x, y: i.y, w: i.width, h: i.height};

      if (this.isCollision(en.x, en.y, en.w, en.h, hero.x, hero.y, hero.w, hero.h) && i.options.code != null){
        if(i.type !== "enemy"){
          bool = true; //Столкновение с мобом.
        } else this.can.walk = true;

        this.nps = id; //Записываем ID nps.

        i.actFlag = true;//Вызываем сценарий в случае такого столкновения.
      }
    }
    //Вызываем колбэк есть он есть
    if (typeof callback == 'function' && !bool) callback(nx, ny);
  };
  event(ctx){
    const opt = this.options;
    if(this.can.walk){
      if(KeyBoard.isKeyDown('LEFT') || KeyBoard.isKeyDown('A')){
        this.collision(this.memory.x-opt.speed,this.memory.y,(x,y) => {
          this.memory.x = x;
          this.memory.y = y;
        });
      }
      if(KeyBoard.isKeyDown('RIGHT') || KeyBoard.isKeyDown('D')){
        this.collision(this.memory.x+opt.speed,this.memory.y,(x,y) => {
          this.memory.x = x;
          this.memory.y = y;
        });
      }
      if(KeyBoard.isKeyDown('TOP')     || KeyBoard.isKeyDown('W')){
        this.collision(this.memory.x,this.memory.y-opt.speed,(x,y) => {
          this.memory.x = x;
          this.memory.y = y;
        });
      }
      if(KeyBoard.isKeyDown('DOWN')    || KeyBoard.isKeyDown('S')){
        this.collision(this.memory.x,this.memory.y+opt.speed,(x,y) => {
          this.memory.x = x;
          this.memory.y = y;
        });
      }
      if(KeyBoard.isKeyDown('SPACE')){
        //Выполняем дейтвие..
        this.canTakeIt(ctx);
        this.drawTool(ctx);
        this.attack(ctx);
      }else{
        this.memory.digger = 0;
      }
    }
  };
  life(ctx){
    this.event(ctx); //События перемещения персонажа на карте.
    this.drawStatus(ctx);
    this.questComplete();

  };
  drawTool(ctx){
    const pos = this.options.tool !== null ? this.tool.s[this.options.tool].pos : null;
    let text = '';
    const tool = sprite.hero.map[this.tool.x][this.tool.y];

    this.tool.frame.msp = this.tool.frame.msp <= this.tool.frame.speed ? this.tool.frame.msp+=1 : this.tool.frame.msp=0;
    if(this.tool.frame.msp === 0){
      this.tool.frame.im = this.tool.frame.im >= sprite.hero.frame.frameMap.length-1 ? 0 : this.tool.frame.im +=1;
    }
    if(this.options.tool !== null){
      ctx.drawImage(
        sprite.hero.dom[this.face],
        tool.x+sprite.hero.frame.w*sprite.hero.frame.frameMap[this.tool.frame.im],
        tool.y+sprite.hero.frame.h*_com[pos],
        sprite.hero.frame.w,
        sprite.hero.frame.h,
        this.memory.x+this.tool.frame.x,
        this.memory.y+this.tool.frame.y,
        sprite.hero.frame.w,
        sprite.hero.frame.h
      );
    }else{
      ctx.font = '23px Arial';
      ctx.fillStyle = '#fff';
      if(this.tool.frame.im > 0) text = '';
      if(this.tool.frame.im > 1) text = '..';
      if(this.tool.frame.im > 2) text = '...';
      let dx, dy;
      dx = this.memory.x+this.tool.frame.x-0.5;
      dy = this.memory.y+this.tool.frame.y/2+1;
      ctx.fillRect(dx+1,dy,22,6);
      ctx.fillStyle = "#000";
      ctx.fillText(text,dx+2,dy+4);
    }
  };
  gameOver() {
    _Hero.can.walk = false;
    _Hero.can.attack = false;
    _Interface.dialog.set([
      ["...",'right',4,3,0],
      ["3.."],
      ["2.."],
      ["1.."],
      [" - Игра окончина.."],
      ["Ты кто вообще ? "],
      ["ППпппрррррРРРРрррруУУУУУууФФФффффф...."]
    ], () => {
      Storage.unset();
      location.reload();
    });
  };
  draw(ctx){
    const arr = sprite.hero.map[this.sprite.x][this.sprite.y];//Массив спрайт карты.
    const c = sprite.hero.frame; //параметры кадра
    const map = c.frameMap;
    const img = sprite.hero.dom[this.face]; //Изображение персонажа в объекте спрайта
    if(this.memory.x !== this.memory.dump.x || this.memory.y !== this.memory.dump.y){
      c.msp = c.msp <= c.speed ? c.msp+=1 : c.msp=0;
      if(c.msp === 0){
        c.im = c.im >= map.length-1 ? 0 : c.im +=1;
      }
    }else c.im = 1;
    if(this.memory.x || this.memory.y){
      if(this.memory.dump.x !== this.memory.x) {
        if (this.memory.dump.x < this.memory.x) this.memory.pos = 'right';
        if (this.memory.dump.x > this.memory.x) this.memory.pos = 'left';
      }
      if(this.memory.dump.y !== this.memory.y){
        if(this.memory.dump.y < this.memory.y) this.memory.pos = 'bottom';
        if(this.memory.dump.y > this.memory.y) this.memory.pos = 'top';
      }
    }
    ctx.drawImage(img,arr.x+c.w*map[c.im], arr.y+c.h*_com[this.memory.pos], c.w, c.h, this.memory.x, this.memory.y, c.w, c.h);
    this.memory.dump.x = this.memory.x;
    this.memory.dump.y = this.memory.y;
    this.life(ctx);
  };//рисуем персонажа в координатах.
  save() {
    Storage.set('_hero', this);
  }
}
