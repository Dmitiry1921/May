/**
 * Interface — Phaser GameObjects-based UI system
 * Rewritten from Canvas 2D API to Phaser.GameObjects (Text, Rectangle, Image, Container)
 */

import { _tile } from '../data/tiles';
import { _spt } from '../data/sprites';
import { _itms } from '../data/items';
import storage from '../../js/class/Storage.js';

// Module-level shared state
let _Hero: any = null;
let _Map: any = null;
let _Mobs: any[] = [];
let _Interface: any = null;  // Self-reference! dialog.draw() calls _Interface.dialog.next()
let _com: Record<string, number> = { top: 3, left: 1, right: 2, bottom: 0 };
let isKeyDown: (key: string) => boolean = () => false;
let _scene: Phaser.Scene | null = null;

export function setInterfaceSharedState(
  hero: any,
  map: any,
  mobs: any[],
  iface: any,
  keyFn: (key: string) => boolean,
  scene?: Phaser.Scene
): void {
  _Hero = hero;
  _Map = map;
  _Mobs = mobs;
  _Interface = iface;
  isKeyDown = keyFn;
  if (scene) _scene = scene;
}

interface DialogSubsystem {
  doit: boolean;
  flag: boolean;
  param: {
    x: number;
    y: number;
    main: { w: number; h: number; x: number; y: number };
    say: { w: number; h: number; x: number; y: number };
  };
  face: {
    left: { sid: number; x: number; y: number };
    right: { sid: number; x: number; y: number };
  };
  textid: number | string;
  text: any[];
  callback: (() => void) | undefined;
  mob: any;
  wrapText(context: any, text: string | undefined, marginLeft: number, marginTop: number, maxWidth: number, lineHeight: number): void;
  setFace(pos: string, id: number, x1: number, y1: number): void;
  set(arr: any[], callback?: () => void): void;
  next(): void;
  show(): void;
  hide(): void;
  draw(): void;
}

interface InventorySubsystem {
  pos: { x: number; y: number };
  param: { w: number; h: number; x: number; y: number };
  lastSearch: string | null;
  add(itm: any, count: number): void;
  delete(itm: any, count: number): void;
  show(): void;
  hide(): void;
  isset(itm: any, count: number): boolean;
  drawItms(): void;
  drawTool(): void;
  draw(): void;
}

interface QuestSubsystem {
  param: {
    w: number;
    h: number;
    x: number;
    y: number;
    inv: { w: number; h: number };
  };
  text: string | undefined;
  set(text: string): void;
  draw(): void;
}

interface HpSubsystem {
  param: { w: number; h: number; x: number; y: number };
  draw(): void;
}

export interface InterfaceInstance {
  dialog: DialogSubsystem;
  inventory: InventorySubsystem;
  quest: QuestSubsystem;
  hp: HpSubsystem;
  draw(): void;
}

export interface InterfaceConstructor {
  new (): InterfaceInstance;
  (): void;
}

export const Interface = function (this: InterfaceInstance) {
  const scene = _scene;
  if (!scene) {
    throw new Error('Interface requires Phaser.Scene via setInterfaceSharedState');
  }

  // ============================================================================
  // Dialog subsystem — Phaser GameObjects
  // ============================================================================
  const dialogBg = scene.add.image(0, 0, 'interface_0').setCrop(0, 0, 772, 97).setDepth(20).setOrigin(0, 0).setVisible(false);
  const dialogLeftFace = scene.add.image(0, 0, 'face_0').setDepth(21).setOrigin(0, 0).setVisible(false);
  const dialogRightFace = scene.add.image(0, 0, 'face_0').setDepth(21).setOrigin(0, 0).setVisible(false);
  const dialogTextObj = scene.add.text(0, 0, '', {
    fontSize: '15px',
    fontFamily: 'Arial',
    color: '#000000',
    fontStyle: 'bold',
    wordWrap: { width: 553 }
  }).setDepth(22).setOrigin(0, 0).setVisible(false);

  this.dialog = {
    doit: true,
    flag: false,
    param: {
      x: 0,
      y: 0,
      main: { w: 772, h: 97, x: 0, y: 0 },
      say: { w: 553, h: 86, x: 0, y: 97 }
    },
    face: {
      left: { sid: 0, x: 0, y: 0 },
      right: { sid: 2, x: 0, y: 0 }
    },
    textid: 0,
    text: [],
    callback: undefined,
    mob: undefined,
    wrapText: function (context: any, text: string | undefined, marginLeft: number, marginTop: number, maxWidth: number, lineHeight: number) {
      // Deprecated — Phaser Text handles word wrapping automatically
    },
    setFace: function (pos: string, id: number, x1: number, y1: number) {
      if (pos == "left" || pos == "right") {
        if (pos == "left") {
          this.face.left.sid = id;
          this.face.left.x = x1;
          this.face.left.y = y1;
        } else {
          this.face.right.sid = id;
          this.face.right.x = x1;
          this.face.right.y = y1;
        }
      }
    },
    set: function (arr: any[], callback?: () => void) {
      this.textid = 0;
      this.doit = true;
      this.show();
      this.text = arr;
      this.callback = callback;
    },
    next: function () {
      var $im = _Mobs[_Hero.nps];
      this.textid = (this.text as any[]).length - 1 > (this.textid as number) ? (this.textid as number) + 1 : "next";
      if (this.textid == "next") {
        this.textid = 0;
        _Hero.nps = null;
        _Hero.can.walk = true;
        if ($im != undefined) $im.actFlag = false;
        const cb = this.callback;
        this.callback = undefined;
        if (typeof cb === 'function') {
          try { cb(); } catch(e) { console.error('[dialog callback error]', e); }
        }
        _Interface.dialog.hide();
      }
    },
    show: function () {
      this.flag = true;
    },
    hide: function () {
      this.flag = false;
    },
    draw: function () {
      if (this.flag) {
        const p = this.param;
        const map = _Map.setting.map;
        const x = ((map.count.x * (_tile as any).param.w) - p.main.w) / 2;
        const y = ((map.count.y * (_tile as any).param.h) - p.main.h);
        const dx = p.x = (p.main.w - p.say.w) / 2 + x;
        const dy = p.y = (p.main.h - p.say.h) / 2 + y;

        const arr = this.text[this.textid as number];
        const a = undefined;
        if (arr != undefined) {
          if (arr.length > 1) {
            if (arr[1] != a && arr[2] != a && arr[3] != a && arr[4] != a) {
              this.setFace(arr[1], arr[2], arr[3], arr[4]);
            }
            if (arr[5] != a && arr[6] != a && arr[7] != a && arr[8] != a) {
              this.setFace(arr[5], arr[6], arr[7], arr[8]);
            }
          }
        }

        // Draw face sprites using Image + setCrop (native face frame size)
        const faceFrame = (_spt as any).face.frame;
        const fw: number = faceFrame.bw;
        const fh: number = faceFrame.bh;
        const l = this.face.left;
        const r = this.face.right;
        if (fw && fh) {
          dialogLeftFace.setTexture(`face_${l.sid}`).setCrop(l.x * fw, l.y * fh, fw, fh);
          dialogRightFace.setTexture(`face_${r.sid}`).setCrop(r.x * fw, r.y * fh, fw, fh);
        }
        dialogBg.setPosition(x, y).setVisible(true);
        dialogLeftFace.setPosition(x - l.x * fw, y - l.y * fh).setVisible(true);
        dialogRightFace.setPosition(x + p.main.w - fw - r.x * fw, y - r.y * fh).setVisible(true);
        
        const text = this.text[this.textid as number] != undefined ? this.text[this.textid as number][0] : "";
        dialogTextObj.setText(text).setPosition(dx + 5, dy + 6).setVisible(true);

        if (isKeyDown('SPACE') && this.doit) {
          this.doit = false;
          this.next();
          const $this = this;
          setTimeout(function () {
            $this.doit = true;
          }, 500);
        }
      } else {
        // Hide all dialog GameObjects when flag is false
        dialogBg.setVisible(false);
        dialogLeftFace.setVisible(false);
        dialogRightFace.setVisible(false);
        dialogTextObj.setVisible(false);
      }
    }
  };

  // ============================================================================
  // Inventory subsystem — Phaser GameObjects
  // ============================================================================
  const invBg = scene.add.rectangle(0, 0, 199, 30, 0xffffff, 1).setDepth(20).setOrigin(0, 0).setVisible(false);
  const invItemImages: Phaser.GameObjects.Rectangle[] = [];
  const invItemTexts: Phaser.GameObjects.Text[] = [];
  const invToolImage = scene.add.rectangle(0, 0, 26, 26, 0x888888).setDepth(21).setOrigin(0, 0).setVisible(false);

  // Pre-create 5 item slots
  for (let i = 0; i < 5; i++) {
    const img = scene.add.rectangle(0, 0, 26, 26, 0xaaaaaa).setDepth(21).setOrigin(0, 0).setVisible(false);
    const txt = scene.add.text(0, 0, '', { fontSize: '11px', fontFamily: 'Arial', color: '#000', fontStyle: 'bold' }).setDepth(22).setOrigin(0, 0).setVisible(false);
    invItemImages.push(img);
    invItemTexts.push(txt);
  }

  this.inventory = {
    pos: { x: 0, y: 0 },
    param: { w: 199, h: 30, x: 772, y: 0 },
    lastSearch: null,
    add: function (itm: any, count: number) {
      var inv = (storage as any)._inventory;
      var zero: string[] = [];
      var search: string | null = null;
      for (var id in inv.itms) {
        var cell = inv.itms[id];
        if (cell === null) {
          zero.push(id);
        } else {
          if (cell.itm === itm) {
            search = id;
          }
        }
      }
      if (search === null) {
        inv.itms[zero[0]] = { itm: itm, count: count };
      } else {
        inv.itms[search].count += count;
      }
      (storage as any)._inventory = inv;
    },
    delete: function (itm: any, count: number) {
      var inv = (storage as any)._inventory;
      if (this.isset(itm, count)) {
        var last = this.lastSearch!;
        inv.itms[last].count -= count;
        if (inv.itms[last].count <= 0) {
          inv.itms[last] = null;
        }
      }
      (storage as any)._inventory = inv;
    },
    show: function () {
      (storage as any)._invShow = true;
    },
    isset: function (itm: any, count: number) {
      var inv = (storage as any)._inventory.itms;
      var bool = false;
      for (var i in inv) {
        var cell = inv[i];
        if (cell !== null) {
          if (cell.itm == itm && cell.count >= count) {
            this.lastSearch = i;
            bool = true;
            break;
          }
        }
      }
      return bool;
    },
    hide: function () {
      (storage as any)._invShow = false;
    },
    drawItms: function () {
      const inv = (storage as any)._inventory.itms;
      let idx = 0;
      for (var id in inv) {
        const itm = inv[id];
        if (itm !== null && idx < invItemImages.length) {
          const pos = { x: this.pos.x + 2 + (28 * 2) + (26 * idx + (idx * 2)), y: this.pos.y, w: 26, h: 26 };
          invItemImages[idx].setPosition(pos.x, pos.y).setVisible(true);
          invItemTexts[idx].setText(itm.count.toString()).setPosition(pos.x + 18, pos.y + 15).setVisible(true);
          idx++;
        }
      }
      // Hide unused slots
      for (let i = idx; i < invItemImages.length; i++) {
        invItemImages[i].setVisible(false);
        invItemTexts[i].setVisible(false);
      }
    },
    drawTool: function () {
      const tool = _Hero.options.tool;
      if (tool !== null) {
        const d = { x: this.pos.x + 2 + 28, y: this.pos.y, w: 26, h: 26 };
        invToolImage.setPosition(d.x, d.y).setVisible(true);
      } else {
        invToolImage.setVisible(false);
      }
    },
    draw: function () {
      if ((storage as any)._invShow) {
        this.pos.x = _Map.setting.map.count.x * (_tile as any).param.w - this.param.w - 2;
        this.pos.y = 2;
        invBg.setPosition(this.pos.x, this.pos.y).setVisible(true);
        this.drawItms();
        this.drawTool();
      } else {
        invBg.setVisible(false);
        invToolImage.setVisible(false);
        for (let i = 0; i < invItemImages.length; i++) {
          invItemImages[i].setVisible(false);
          invItemTexts[i].setVisible(false);
        }
      }
    }
  };

  // ============================================================================
  // Quest subsystem — Phaser GameObjects
  // ============================================================================
  const questBg = scene.add.rectangle(0, 0, 199, 17, 0xffffff, 1).setDepth(20).setOrigin(0, 0).setVisible(false);
  const questTextObj = scene.add.text(0, 0, '', {
    fontSize: '13px',
    fontFamily: 'Arial',
    color: '#000',
    fontStyle: 'bold',
    wordWrap: { width: 195 }
  }).setDepth(21).setOrigin(0, 0).setVisible(false);

  this.quest = {
    param: {
      w: 199,
      h: 17,
      x: 772,
      y: 30,
      inv: { w: 199, h: 30 }
    },
    text: undefined,
    set: function (text: string) {
      (storage as any)._quest = text;
    },
    draw: function () {
      const text = (storage as any)._quest;
      const p = this.param;
      const x = _Map.setting.map.count.x * (_tile as any).param.w - p.w - 2;
      const y = (storage as any)._invShow ? p.inv.h + 2 : 2;
      if (text != null) {
        questBg.setPosition(x, y).setVisible(true);
        questTextObj.setText(text).setPosition(x + 2, y + 2).setVisible(true);
      } else {
        questBg.setVisible(false);
        questTextObj.setVisible(false);
      }
    }
  };

  // ============================================================================
  // HP bar subsystem — Phaser GameObjects
  // ============================================================================
  const hpBg = scene.add.rectangle(3, 3, 210, 12, 0x888888).setDepth(20).setOrigin(0, 0);
  const hpBar = scene.add.rectangle(5, 5, 206, 8, 0xe11e26).setDepth(21).setOrigin(0, 0);
  const hpText = scene.add.text(3 + (210 - 70) / 2, 3 + 9, 'hp 5/5', {
    fontSize: '10px',
    fontFamily: 'Arial',
    color: '#fff',
    fontStyle: 'bold'
  }).setDepth(22).setOrigin(0, 0);

  this.hp = {
    param: { w: 210, h: 12, x: 772, y: 47 },
    draw: function () {
      const p = this.param;
      const x = 3;
      const y = 3;
      const max = _Hero.options.max.health;
      const hp = _Hero.options.health;
      const pst = hp / max;

      hpBg.setPosition(x, y).setVisible(true);
      hpBar.setPosition(x + 2, y + 2).setSize((p.w - 4) * pst, p.h - 4).setVisible(true);
      hpText.setText('hp ' + hp + "/" + max).setPosition(x + (p.w - 70) / 2, y + 2).setVisible(true);
    }
  };

  this.draw = function () {
    this.hp.draw();
    this.dialog.draw();
    this.inventory.draw();
    this.quest.draw();
  };
} as unknown as InterfaceConstructor;
