import Map from './Map.js';
import Storage from './Storage.js';
import KeyBoard from './KeyBoard.js';

import {_com} from "../config/main.js";
import sprite from '../config/sprite.js';
import global from '../config/global.js';
import items from '../config/items.js';
import code from "../config/code.js";


class Quest {
  constructor() {
    this.param = {
      w: 199,
      h: 17,
      x: 772,
      y: 30,
      inv: {
        w: 199,
        h: 30
      } //Габариты инвентаря.
    };
    this.text = Storage.get('_quest'); //Коротенький текст который будет помогать игроку выполнить задание..
  }

  set(text) {
    Storage.set('_quest', text);
  } //Устанавливаем текст задания.
  draw() {
     const ctx = Map.setting.canvas.dom,
      p = this.param,
      img = sprite['interface'].dom[0],
      x = Map.setting.map.count.x * _tile.param.w - p.w - 2,
      y = Storage.get('_invShow') != null ? p.inv.h + 2 : 2;
    if (this.text != null) {
      ctx.drawImage(img, p.x, p.y, p.w, p.h, x, y, p.w, p.h);
      ctx.font = 'bold 13px Arial';
      ctx.fillStyle = "#000";
      ctx.fillText(this.text, x + 2, y + 13, p.w - 4);
    }
  }
}

class HealthPower {
  constructor() {
    this.param = {
      w: 210,
      h: 12,
      x: 772,
      y: 47
    };
  }

  draw() {
    const ctx = Map.setting.canvas.dom,
      p = this.param,
      img = sprite['interface'].dom[0],
      x = 3,
      y = 3,
      max = global._Hero.options.max.health,
      hp = global._Hero.options.health, pst = hp / max;

    ctx.drawImage(img, p.x, p.y, p.w, p.h, x, y, p.w, p.h);

    ctx.fillStyle = '#e11e26';
    ctx.fillRect(x + 2, y + 2, (p.w - 4) * pst, p.h - 4);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.fillText('hp ' + hp + "/" + max, x + (p.w - 70) / 2, y + 9, 100);
  }
}

class Dialog {
  constructor() {
    this.doit = true; //Флаг доступности чего-либо..
    this.flag = false; //Отображать диалог
    this.param = {
      x: 0, //Координаты текстового поля.
      y: 0, //Координаты текстового поля.
      main: {
        w: 772,
        h: 97,
        x: 0,
        y: 0
      }, //Главный блок диалогов.
      say: {
        w: 553,
        h: 86,
        x: 0,
        y: 97
      } //Блок, где персонажи общаются.
    }; //Параметры диалога на игровом пространстве.
    this.face = {
      left: {
        sid: 0,
        x: 0,
        y: 0
      },
      right: {
        sid: 2,
        x: 0,
        y: 0
      }
    };
    this.textid = 0; //id реплики в диалоге.
    this.text = []; //текс который мы будем выводить.
    this.callback = undefined; //Функция выполнимая после завершения диалога.
    this.mob = undefined; //Персонаж, который вызвал диалог.
  }

  wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight) {
    if (text !== undefined) {
      const words = text.split(" ");
      const countWords = words.length;
      let line = "";
      for (let n = 0; n < countWords; n++) {
        let testLine = line + words[n] + " ";
        const testWidth = context.measureText(testLine).width;
        if (testWidth > maxWidth) {
          context.fillText(line, marginLeft, marginTop);
          line = words[n] + " ";
          marginTop += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, marginLeft, marginTop);
    }
  }

  setFace(pos, id, x1, y1) {
    /**
     * Положение: right || left
     * tid - Спрайт ID
     * x - Координата по X на спрайте
     * y - Координата по Y на спрайте
     */
    if (pos === "left" || pos === "right") {
      if (pos === "left") {
        this.face.left.sid = id;
        this.face.left.x = x1;
        this.face.left.y = y1;
      } else {
        this.face.right.sid = id;
        this.face.right.x = x1;
        this.face.right.y = y1;
      }
    }

  }

  set(arr, callback) {
    //Отображаем диалог
    this.show();
    //Записываем диалог в Интерфейс.
    this.text = arr;
    this.callback = callback;
  }

  next() {
    //Активный моб.
    const $im = global._Mobs[global._Hero.nps];
    //Меняем индекс текста.
    this.textid = this.text.length - 1 > this.textid ? this.textid + 1 : "next";
    //------
    if (this.textid === "next") { // Диалог окончен.
      this.textid = 0;
      global._Hero.nps = null; // Делаем игрока уязвимым для врагов.
      global._Hero.can.walk = true; // Разрешаем игроку ходить..
      if ($im !== undefined) $im.actFlag = false; // Убираем интерфейс.
      if (typeof this.callback == 'function') this.callback.apply(code);
      this.hide(); // Прячем диалог.
    }
  }

  show() {
    this.flag = true;
  }

  hide() {
    this.flag = false
  }

  draw() {
    if (this.flag) {
      const ctx = Map.setting.canvas.dom,
        p = this.param,
        l = this.face.left,
        r = this.face.right,
        img = sprite['interface'].dom[0],
        face = sprite['face'].frame,
        m = sprite['face'].map,
        left = sprite['face'].dom[l.sid],
        right = sprite['face'].dom[r.sid];
      let x, y, dx, dy,
        map = Map.setting.map; //Размеры холста в клетках.
      x = ((map.count.x * _tile.param.w) - p.main.w) / 2; //Координата диалога.
      y = ((map.count.y * _tile.param.h) - p.main.h); //Координата диалога.
      dx = p.x = (p.main.w - p.say.w) / 2 + x;
      dy = p.y = (p.main.h - p.say.h) / 2 + y;

      const arr = this.text[this.textid],
        a = undefined;
      //Назначаем лица для диалогов.
      if (arr !== undefined) {
        if (arr.length > 1) {
          //Больше одного.
          if (arr[1] !== a && arr[2] !== a && arr[3] !== a && arr[4] !== a) {
            this.setFace(arr[1], arr[2], arr[3], arr[4]);
          }
          if (arr[5] !== a && arr[6] !== a && arr[7] !== a && arr[8] !== a) {
            this.setFace(arr[5], arr[6], arr[7], arr[8]);
          }
        }
      }


      ctx.drawImage(img, p.main.x, p.main.y, p.main.w, p.main.h, x, y, p.main.w, p.main.h);
      ctx.drawImage(left, m[l.x][l.y].x, m[l.x][l.y].y, face.w, face.h, x, y, face.w, face.h);
      ctx.drawImage(right, m[r.x][r.y].x, m[r.x][r.y].y, face.w, face.h, x + p.main.w - face.w, y, face.w, face.h);

      ctx.font = 'bold 15px Arial';
      ctx.fillStyle = "#000";
      const text = this.text[this.textid] !== undefined ? this.text[this.textid][0] : "";

      this.wrapText(ctx, text, dx + 5, dy + 20, p.say.w, 20);
      if (KeyBoard.isKeyDown('SPACE') && this.doit) {
        this.doit = false;
        this.next();
        setTimeout(() => {
          this.doit = true;
        }, 500);
      }
    }
  }
}

class Inventory {
  constructor() {
    this.pos = {
      x: 0, //положение инвентаря на карте.
      y: 0
    };
    this.param = {
      w: 199,//Габариты
      h: 30,
      x: 772, // положение на спрайт карте
      y: 0
    };//Рисуем инвентарь..
    this.lastSearch = null; //тут храним результат последнего наденого елемента в инвентаре..
  }

  add(itm, count) {
    const inv = Storage.get('_inventory'), //инвентарь игрока
      zero = [];//массив с пустыми ячейками.
    let search = null; //Ячейка поиска.
    //Функция добавляем в инвентарь игрока, что-то определенного кол-ва.
    //Проверяем есть ли в инвентаре у игрока уже предмет этого типа ?
    for (let id in inv.itms) {
      const cell = inv.itms[id];
      if (cell === null) {
        //ячейка пуста записываем ее id что бы потом использовать.
        zero.push(id);
      } else {
        if (cell.itm === itm) {
          //такой предмет уже есть в инвентаре, увеличиваем кол-во таких предметов в инветаре игрока.
          search = id; //Записываем найденную ячейку, что бы потом увеличить кол-во.
        }//если предмет не найден тогда search == null и нужно создать такой предмет в инвентаре.
      }
    }
    //поиск окончен, смотрим результаты поиска.
    if (search === null) {
      //не чего не найдено, создаем предмет в инвентаре.
      inv.itms[zero[0]] = {
        itm: itm,
        count: count
      }
    } else {
      //Найдена ячейка хранения такого предмета, увеличиваем ко-во этих предметов в инвентаре.
      inv.itms[search].count += count;
    }
    //Записываем инвентарь в хранилище..
    Storage.set('_inventory', inv);
  }

  delete(itm, count) {
    //Удаляем предмет в кол-ве из инвенторя.
    const inv = Storage.get("_inventory");
    if (this.isSet(itm, count)) {
      const last = this.lastSearch;
      //Предмет найден отнимаем от существующего ко-ва наше.
      inv.itms[last].count -= count;
      if (inv.itms[last].count <= 0) {
        inv.itms[last] = null;
      }
    }
    Storage.set('_inventory', inv);
  }

  show() {
    Storage.set('_invShow', true);
  }

  isSet(itm, count) {
    const inv = Storage.get('_inventory').itms;
    let bool = false;
    //проверяем существует ли в инвентаре, что-то определенного кол-ва.
    for (let i in inv) {
      const cell = inv[i];
      if (cell !== null) {
        if (cell.itm === itm && cell.count >= count) {
          this.lastSearch = i; //Записываем результат поиска
          bool = true;
          break;
        }
      }
    }
    return bool;
  }

  hide() {
    Storage.set('_invShow', null);
  }

  drawItems() {
    const ctx = Map.setting.canvas.dom;
    //Получаем инвентарь персонажа.
    const inv = Storage.get('_inventory').itms; //только предметы.
    for (let id in inv) {
      const itm = inv[id];
      if (itm !== null) {
        //Получаем параметры предмета.
        const param = items[itm.itm].map,
          im = _tile[param.tile].map[param.id],
          tile = {x: im.x + 3, y: im.y + 3, w: 26, h: 26},
          pos = {x: this.pos.x + 2 + (28 * 2) + (tile.w * id + (id * 2)), y: this.pos.y, w: 26, h: 26};//положение предметов в инвентаре.

        ctx.drawImage(_tile[param.tile].dom, tile.x, tile.y, tile.w, tile.w, pos.x, pos.y, pos.w, pos.h);
        //Рисуем кол-во предметов в инвентаре..
        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = "#000"; //Черный
        ctx.fillText(itm.count, pos.x + 18, pos.y + 26, 26);
      }
    }
  } //Функция отрисовки предметов в инвентаре персонажа.
  drawTool() {
    const ctx = Map.setting.canvas.dom,
      img = sprite.hero.dom[global._Hero.face],
      map = sprite.hero.map[global._Hero.tool.x][global._Hero.tool.y];

    //получаем id предмета
    const tool = global._Hero.options.tool;
    if (tool !== null) {
      const s = {x: map.x + (32 * 2) + 3, y: map.y + (32 * _com[global._Hero.tool.s[global._Hero.options.tool].pos]), w: 26, h: 26};
      const d = {x: this.pos.x + 2 + 28, y: this.pos.y, w: 26, h: 26};
      //Рисуем предмет в инвентаре..
      ctx.drawImage(img, s.x, s.y, s.w, s.h, d.x, d.y, d.w, d.h);
    }
  } //Рисуем инструмент который у нас в руке или доступен для использования.
  draw() {
    if (Storage.get('_invShow') != null) {
      const ctx = Map.setting.canvas.dom,
        img = sprite['interface'].dom[0];
      this.pos.x = Map.setting.map.count.x * _tile.param.w - this.param.w - 2;
      this.pos.y = 2;

      ctx.drawImage(img, this.param.x, this.param.y, this.param.w, this.param.h, this.pos.x, this.pos.y, this.param.w, this.param.h);
      this.drawItems(); //Рисуем предметы в инвентаре.
      this.drawTool(); //Рисуем предмет который в руке у персонажа.
    }
  }
}

export default new class Interface {
  constructor() {
    this.dialog = new Dialog();
    this.inventory = new Inventory();
    this.hp = new HealthPower();
    this.quest = new Quest();
  }

  draw() {
    this.hp.draw();
    this.dialog.draw();
    this.inventory.draw();
    this.quest.draw();
  }
}
