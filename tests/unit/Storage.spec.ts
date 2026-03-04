'use strict';

import assert from 'node:assert/strict';
import { beforeEach, describe, it, vi } from 'vitest';

// Storage is a dynamic Proxy — exact typing requires source changes
type StorageInterface = {
  save(): void;
  load(): void;
  clearAll(): void;
  stopAutoSave(cause?: string): void;
  startAutoSave(): void;
  setOnce(key: string, value: unknown): void;
  validate(data: unknown): boolean;
  data: Record<string, unknown>;
  [key: string]: unknown;
};

describe('#Storage', () => {
  let storage: StorageInterface;

  beforeEach(async () => {
    vi.clearAllTimers();
    localStorage.clear();
    const { default: Storage } = await import('../../js/class/Storage.js') as {
      default: StorageInterface;
    };
    storage = Storage;
    storage.clearAll();
    storage.startAutoSave();
  });

  describe('initialization', () => {
    it('should initialize and work with values', () => {
      storage.testValue = 'hello';
      assert.strictEqual(storage.testValue, 'hello');
    });

    it('should load existing localStorage data on init', () => {
      localStorage.setItem('testKey', JSON.stringify('testValue'));
      storage.load();
      assert.strictEqual(storage.testKey, 'testValue');
    });
  });

  describe('Proxy get trap', () => {
    it('should return null for undefined keys', () => {
      const value = storage.nonExistentKey;
      assert.strictEqual(value, null);
    });

    it('should retrieve stored values', () => {
      storage.testKey = 'testValue';
      assert.strictEqual(storage.testKey, 'testValue');
    });

    it('should return methods for reserved keys', () => {
      assert.strictEqual(typeof storage.save, 'function');
      assert.strictEqual(typeof storage.load, 'function');
      assert.strictEqual(typeof storage.clearAll, 'function');
      assert.strictEqual(typeof storage.stopAutoSave, 'function');
      assert.strictEqual(typeof storage.startAutoSave, 'function');
      assert.strictEqual(typeof storage.setOnce, 'function');
      assert.strictEqual(typeof storage.validate, 'function');
    });
  });

  describe('Proxy set trap', () => {
    it('should store and retrieve values', () => {
      storage.myKey = { test: 'value' };
      assert.deepStrictEqual(storage.myKey, { test: 'value' });
    });

    it('should throw error when trying to set reserved key', () => {
      assert.throws(() => {
        (storage as Record<string, unknown>).stopAutoSave = 'hacked';
      }, /Property "stopAutoSave" is reserved/);
    });

    it('should throw error for all reserved keys', () => {
      const reservedKeys = ['stopAutoSave', 'clearAll', 'setOnce', 'startAutoSave', 'save', 'load', 'validate', 'data'];
      reservedKeys.forEach(key => {
        assert.throws(() => {
          (storage as Record<string, unknown>)[key] = 'value';
        }, new RegExp(`Property "${key}" is reserved`));
      });
    });

    it('should allow setting multiple values', () => {
      storage.key1 = 'value1';
      storage.key2 = 'value2';
      storage.key3 = { nested: 'object' };
      assert.strictEqual(storage.key1, 'value1');
      assert.strictEqual(storage.key2, 'value2');
      assert.deepStrictEqual(storage.key3, { nested: 'object' });
    });

    it('should allow overwriting existing values', () => {
      storage.myKey = 'original';
      assert.strictEqual(storage.myKey, 'original');
      storage.myKey = 'updated';
      assert.strictEqual(storage.myKey, 'updated');
    });
  });

  describe('save method', () => {
    beforeEach(() => {
      storage.clearAll();
      storage.startAutoSave();
    });

    it('should save data to localStorage', () => {
      storage.testKey = 'testValue';
      storage.save();
      const savedValue = JSON.parse(localStorage.getItem('testKey') || '');
      assert.strictEqual(savedValue, 'testValue');
    });

    it('should save complex objects', () => {
      const complexData = { a: 1, b: [2, 3], c: { nested: true } };
      storage.complexKey = complexData;
      storage.save();
      const savedValue = JSON.parse(localStorage.getItem('complexKey') || '');
      assert.deepStrictEqual(savedValue, complexData);
    });

    it('should validate before saving', () => {
      const circular: Record<string, unknown> = {};
      circular.self = circular;
      assert.strictEqual(storage.validate(circular), false);
      assert.strictEqual(storage.validate({ normal: 'object' }), true);
    });
  });

  describe('load method', () => {
    it('should load data from localStorage', () => {
      localStorage.setItem('loadKey', JSON.stringify('loadValue'));
      storage.load();
      assert.strictEqual(storage.loadKey, 'loadValue');
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('corruptedKey', 'not-valid-json{');
      const consoleWarn = console.warn;
      const warnings: unknown[][] = [];
      console.warn = (...args: unknown[]) => warnings.push(args);
      storage.load();
      console.warn = consoleWarn;
      assert.strictEqual(warnings.length > 0, true);
      assert.strictEqual(localStorage.getItem('corruptedKey'), null);
    });

    it('should load multiple keys from localStorage', () => {
      localStorage.setItem('key1', JSON.stringify('value1'));
      localStorage.setItem('key2', JSON.stringify({ nested: 'value2' }));
      localStorage.setItem('key3', JSON.stringify([1, 2, 3]));
      storage.load();
      assert.strictEqual(storage.key1, 'value1');
      assert.deepStrictEqual(storage.key2, { nested: 'value2' });
      assert.deepStrictEqual(storage.key3, [1, 2, 3]);
    });
  });

  describe('validate method', () => {
    it('should return true for valid JSON-serializable data', () => {
      assert.strictEqual(storage.validate('string'), true);
      assert.strictEqual(storage.validate(123), true);
      assert.strictEqual(storage.validate({ a: 1 }), true);
      assert.strictEqual(storage.validate([1, 2, 3]), true);
      assert.strictEqual(storage.validate(null), true);
      assert.strictEqual(storage.validate(true), true);
    });

    it('should return false for circular references', () => {
      const circular: Record<string, unknown> = {};
      circular.self = circular;
      assert.strictEqual(storage.validate(circular), false);
    });

    it('should return false for undefined', () => {
      assert.strictEqual(storage.validate(undefined), false);
    });
  });

  describe('clearAll method', () => {
    it('should clear localStorage', () => {
      storage.key1 = 'value1';
      storage.save();
      assert.strictEqual(localStorage.getItem('key1') !== null, true);
      storage.clearAll();
      storage.startAutoSave();
      assert.strictEqual(localStorage.length, 0);
    });

    it('should stop autosave', () => {
      const consoleWarn = console.warn;
      const warnings: unknown[][] = [];
      console.warn = (...args: unknown[]) => warnings.push(args);
      storage.clearAll();
      console.warn = consoleWarn;
      const hasClearAllWarning = warnings.some(w => 
        w.some(arg => typeof arg === 'object' && arg !== null && (arg as Record<string, unknown>).cause === 'clearAll')
      );
      assert.strictEqual(hasClearAllWarning, true);
      storage.startAutoSave();
    });
  });

  describe('setOnce method', () => {
    it('should set value if key does not exist', () => {
      storage.setOnce('onceKey', 'initialValue');
      assert.strictEqual(storage.onceKey, 'initialValue');
    });

    it('should not overwrite existing value', () => {
      storage.onceKey = 'original';
      storage.setOnce('onceKey', 'attempted');
      assert.strictEqual(storage.onceKey, 'original');
    });

    it('should set value if key is null', () => {
      assert.strictEqual(storage.nullKey, null);
      storage.setOnce('nullKey', 'newValue');
      assert.strictEqual(storage.nullKey, 'newValue');
    });

    it('should not set value if key exists with falsy value', () => {
      storage.falsyKey = 0;
      storage.setOnce('falsyKey', 999);
      assert.strictEqual(storage.falsyKey, 0);
    });
  });

  describe('stopAutoSave method', () => {
    it('should log warning with cause and stack', () => {
      const consoleWarn = console.warn;
      const warnings: unknown[][] = [];
      console.warn = (...args: unknown[]) => warnings.push(args);
      storage.stopAutoSave('test-cause');
      console.warn = consoleWarn;
      const hasWarning = warnings.some(w => 
        w[0] === 'Storage.stopAutoSave()' && 
        w.some(arg => typeof arg === 'object' && arg !== null && (arg as Record<string, unknown>).cause === 'test-cause')
      );
      assert.strictEqual(hasWarning, true);
      storage.startAutoSave();
    });
  });

  describe('startAutoSave method', () => {
    it('should start autosave interval', () => {
      storage.stopAutoSave('test');
      storage.startAutoSave();
      assert.ok(true, 'startAutoSave should not throw');
    });

    it('should stop previous interval before starting new one', () => {
      const consoleWarn = console.warn;
      const warnings: unknown[][] = [];
      console.warn = (...args: unknown[]) => warnings.push(args);
      storage.startAutoSave();
      storage.startAutoSave();
      console.warn = consoleWarn;
      const hasStopWarning = warnings.some(w => 
        w.some(arg => typeof arg === 'object' && arg !== null && (arg as Record<string, unknown>).cause === 'startAutoSave')
      );
      assert.strictEqual(hasStopWarning, true);
    });
  });

  describe('getDataWrapper behavior', () => {
    it('should return null for undefined keys via Proxy', () => {
      const result = storage.undefinedKey;
      assert.strictEqual(result, null);
    });

    it('should return defined values as-is via Proxy', () => {
      storage.testValue = 'test';
      storage.zeroValue = 0;
      storage.falseValue = false;
      storage.nullValue = null;
      assert.strictEqual(storage.testValue, 'test');
      assert.strictEqual(storage.zeroValue, 0);
      assert.strictEqual(storage.falseValue, false);
      assert.strictEqual(storage.nullValue, null);
    });
  });


  describe('edge cases', () => {
    it('should handle setting and getting empty string', () => {
      storage.emptyString = '';
      assert.strictEqual(storage.emptyString, '');
    });

    it('should handle setting and getting zero', () => {
      storage.zeroValue = 0;
      assert.strictEqual(storage.zeroValue, 0);
    });

    it('should handle setting and getting false', () => {
      storage.falseValue = false;
      assert.strictEqual(storage.falseValue, false);
    });

    it('should handle setting and getting null explicitly', () => {
      storage.nullValue = null;
      assert.strictEqual(storage.nullValue, null);
    });

    it('should handle array values', () => {
      storage.arrayValue = [1, 2, 3, { nested: true }];
      assert.deepStrictEqual(storage.arrayValue, [1, 2, 3, { nested: true }]);
    });

    it('should handle nested objects', () => {
      storage.nested = { a: { b: { c: 'deep' } } };
      assert.deepStrictEqual(storage.nested, { a: { b: { c: 'deep' } } });
    });
  });

  describe('integration with localStorage', () => {
    it('should persist data across save/load cycle', () => {
      storage.persistKey = 'persistValue';
      storage.save();
      storage.clearAll();
      localStorage.setItem('persistKey', JSON.stringify('persistValue'));
      storage.load();
      assert.strictEqual(storage.persistKey, 'persistValue');
      storage.startAutoSave();
    });

    it('should handle game state keys', () => {
      storage._lvl = 5;
      storage._hero = { x: 10, y: 20 };
      storage._inventory = ['item1', 'item2'];
      storage.save();
      
      assert.strictEqual(storage._lvl, 5);
      assert.deepStrictEqual(storage._hero, { x: 10, y: 20 });
      assert.deepStrictEqual(storage._inventory, ['item1', 'item2']);
      
      const savedLvl = JSON.parse(localStorage.getItem('_lvl') || '');
      assert.strictEqual(savedLvl, 5);
    });
  });
});
