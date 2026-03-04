'use strict';

import assert from 'node:assert/strict';

import MobMicroTask from '../MobMicroTask.js';

interface TestCase {
  path: string[];
  arguments: Array<string | number>;
}

interface CaseData {
  [key: string]: TestCase;
}

const caseData: CaseData = {
  '_code.hero.carrot()': {
    path: ['_code', 'hero', 'carrot'],
    arguments: [],
  },
  '_code.nps.astofComeBack(\'Поговорите с Ваннессой\',\'_code.nps.vanessaComplete()\')': {
    path: ['_code', 'nps', 'astofComeBack'],
    arguments: ['Поговорите с Ваннессой', '_code.nps.vanessaComplete()'],
  },
  '_code.end()': {
    path: ['_code', 'end'],
    arguments: [],
  },
  '_code.nps.setLvl(\'Поговори с Кирилом\',1)': {
    path: ['_code', 'nps', 'setLvl'],
    arguments: ['Поговори с Кирилом', 1],
  },
  'path.to.code(\'arg1\',\'arg2\')': {
    path: ['path', 'to', 'code'],
    arguments: ['arg1', 'arg2'],
  },
  'path.to.code(\'arg1\',\'arg2\', \'arg3\')': {
    path: ['path', 'to', 'code'],
    arguments: ['arg1', 'arg2', 'arg3'],
  },
  'to.code("arg1", "arg2", "arg3", "arg4")': {
    path: ['to', 'code'],
    arguments: ['arg1', 'arg2', 'arg3', 'arg4'],
  },
  'to.code("arg1", "arg2", "arg3", "to.code()")': {
    path: ['to', 'code'],
    arguments: ['arg1', 'arg2', 'arg3', 'to.code()'],
  },
  'to.code.to.code("to.code", "to.code", "to.code")': {
    path: ['to', 'code', 'to', 'code'],
    arguments: ['to.code', 'to.code', 'to.code'],
  },
  'to.code.to.code("to.code", "to.code")': {
    path: ['to', 'code', 'to', 'code'],
    arguments: ['to.code', 'to.code'],
  },
  "_code.nps.setLvl('Добудьте 8 подсолнухов',2);": {
    path: ['_code', 'nps', 'setLvl'],
    arguments: ['Добудьте 8 подсолнухов', 2],
  },
};

describe("#MobMicroTask", () => {
  describe(`#constructor`, () => {
    Object.entries(caseData).forEach(([string, expect]) => {
      it(`should parse string ${string}`, () => {
        const mobMicroTask = new MobMicroTask(string);
        assert.deepStrictEqual(mobMicroTask.path, expect.path);
        assert.deepStrictEqual(mobMicroTask.arguments, expect.arguments);
      });
    });
  });

  describe('#constructor — числовые аргументы', () => {
    it('должен конвертировать числа из строк', () => {
      const task = new MobMicroTask('_code.nps.setLvl(\'Текст\',2)');
      assert.strictEqual(typeof task.arguments[1], 'number');
      assert.strictEqual(task.arguments[1], 2);
    });

    it('должен оставлять строки строками', () => {
      const task = new MobMicroTask('_code.nps.foo(\'hello\')');
      assert.strictEqual(typeof task.arguments[0], 'string');
      assert.strictEqual(task.arguments[0], 'hello');
    });

    it('должен конвертировать 0 в число', () => {
      const task = new MobMicroTask('_code.nps.foo(0)');
      assert.strictEqual(typeof task.arguments[0], 'number');
      assert.strictEqual(task.arguments[0], 0);
    });
  });

  describe('#toString', () => {
    it('должен возвращать оригинальную строку', () => {
      const str = '_code.nps.perma()';
      const task = new MobMicroTask(str);
      assert.strictEqual(task.toString(), str);
    });

    it('должен сохранять строку с точкой с запятой в конце', () => {
      const str = "_code.nps.setLvl('Добудьте 8 подсолнухов',2);";
      const task = new MobMicroTask(str);
      assert.strictEqual(task.toString(), str);
    });
  });

  describe('#getFuncByPath', () => {
    it('должен найти функцию по одиночному пути', () => {
      const fn = () => 'result';
      const obj = { foo: fn };
      assert.strictEqual(MobMicroTask.getFuncByPath(obj, 'foo'), fn);
    });

    it('должен найти функцию по вложенному пути', () => {
      const fn = () => 'nested';
      const obj = { a: { b: { c: fn } } };
      assert.strictEqual(MobMicroTask.getFuncByPath(obj, 'a.b.c'), fn);
    });

    it('должен вернуть undefined если путь не существует', () => {
      const obj = { a: {} };
      assert.strictEqual(MobMicroTask.getFuncByPath(obj, 'a.b.c'), undefined);
    });

    it('должен вернуть undefined для несуществующего корневого ключа', () => {
      const obj = {};
      assert.strictEqual(MobMicroTask.getFuncByPath(obj, 'foo'), undefined);
    });
  });

  describe('#run', () => {
    it('должен вызвать функцию по пути (первый сегмент _code отбрасывается)', () => {
      let called = false;
      const obj = {
        nps: {
          perma: function () { called = true; }
        }
      };
      const task = new MobMicroTask('_code.nps.perma()');
      task.run(obj, {});
      assert.ok(called, 'Функция должна быть вызвана');
    });

    it('должен передать аргументы в функцию', () => {
      let receivedArgs: unknown[] | null = null;
      const obj = {
        nps: {
          setLvl: function (...args: unknown[]) { receivedArgs = args; }
        }
      };
      const task = new MobMicroTask("_code.nps.setLvl('Поговори с Кирилом',1)");
      task.run(obj, {});
      assert.deepStrictEqual(receivedArgs, ['Поговори с Кирилом', 1]);
    });

    it('должен вызвать функцию с правильным контекстом (this)', () => {
      let capturedThis: Record<string, unknown> | null = null;
      const context = { myProp: 'test-context' };
      const obj = {
        hero: {
          carrot: function (this: Record<string, unknown>) { capturedThis = this; }
        }
      };
      const task = new MobMicroTask('_code.hero.carrot()');
      task.run(obj, context);
      assert.strictEqual(capturedThis, context);
    });

    it('должен работать с функцией в корне объекта (путь 2 уровня)', () => {
      let called = false;
      const obj = {
        end: function () { called = true; }
      };
      const task = new MobMicroTask('_code.end()');
      task.run(obj, {});
      assert.ok(called);
    });

    it('должен передать несколько строковых аргументов', () => {
      let receivedArgs: unknown[] | null = null;
      const obj = {
        nps: {
          astofComeBack: function (...args: unknown[]) { receivedArgs = args; }
        }
      };
      const task = new MobMicroTask("_code.nps.astofComeBack('Поговорите с Ваннессой','_code.nps.vanessaComplete()')");
      task.run(obj, {});
      assert.deepStrictEqual(receivedArgs, ['Поговорите с Ваннессой', '_code.nps.vanessaComplete()']);
    });
  });

  describe('#run — execute() with dispatch to mock functions', () => {

    it('должен вызвать функцию и сохранить изменение состояния', () => {
      let result: string | null = null;
      const obj = {
        nps: {
          vanessa: function () { result = 'vanessa-called'; return result; }
        }
      };
      const task = new MobMicroTask('_code.nps.vanessa()');
      task.run(obj, {});
      assert.strictEqual(result, 'vanessa-called');
    });

    it('должен вызвать глубоко вложенную функцию через несколько уровней', () => {
      let called = false;
      const obj = {
        game: {
          handlers: {
            complex: {
              task: function () { called = true; }
            }
          }
        }
      };
      const task = new MobMicroTask('_code.game.handlers.complex.task()');
      task.run(obj, {});
      assert.ok(called, 'Глубокая функция должна быть вызвана');
    });

    it('должен передать смешанные аргументы (строки и числа) в правильном порядке', () => {
      let receivedArgs: unknown[] | null = null;
      const obj = {
        hero: {
          attack: function (...args: unknown[]) { receivedArgs = args; }
        }
      };
      const task = new MobMicroTask("_code.hero.attack('enemy', 5, 'fire', 100)");
      task.run(obj, {});
      assert.deepStrictEqual(receivedArgs, ['enemy', 5, 'fire', 100]);
    });

    it('должен привязать контекст в правильном порядке: bind(context, ...args)', () => {
      let capturedThis: Record<string, unknown> | null = null;
      let capturedArgs: unknown[] | null = null;
      const context = { state: 'test-state' };
      const obj = {
        nps: {
          complex: function (this: Record<string, unknown>, ...args: unknown[]) { 
            capturedThis = this;
            capturedArgs = args;
          }
        }
      };
      const task = new MobMicroTask("_code.nps.complex('arg1', 'arg2')");
      task.run(obj, context);
      assert.strictEqual(capturedThis, context);
      assert.deepStrictEqual(capturedArgs, ['arg1', 'arg2']);
    });
  });

  describe('#run — getFuncByPath error handling', () => {
    it('должен выбросить ошибку если функция не найдена', () => {
      const obj = {
        nps: {
          existing: function () { }
        }
      };
      const task = new MobMicroTask('_code.nps.nonExistent()');
      assert.throws(
        () => { task.run(obj, {}); },
        TypeError,
        'Должна выброситься ошибка при вызове undefined функции'
      );
    });

    it('должен вернуть undefined если путь частично существует', () => {
      const obj = {
        nps: {
          foo: 'not-a-function'
        }
      };
      const result = MobMicroTask.getFuncByPath(obj, 'nps.foo.bar');
      assert.strictEqual(result, undefined);
    });

    it('должен безопасно обработать null в пути', () => {
      const obj = {
        nps: null
      };
      const result = MobMicroTask.getFuncByPath(obj, 'nps.foo');
      assert.strictEqual(result, undefined);
    });
  });

  describe('#constructor — edge cases', () => {
    it('должен правильно парсить эмотиконы и спец символы', () => {
      const task = new MobMicroTask("_code.nps.foo('test@#$','[test]')");
      assert.deepStrictEqual(task.arguments, ['test@#$', '[test]']);
    });



    it('должен правильно парсить команду с апострофами в аргументах', () => {
      const task = new MobMicroTask("_code.nps.foo('don\\'t','it\\'s')");
      assert.deepStrictEqual(task.arguments, ["don\\'t", "it\\'s"]);
    });



    it('должен корректно обработать очень длинную строку аргумента', () => {
      const longArg = 'a'.repeat(1000);
      const task = new MobMicroTask(`_code.nps.foo('${longArg}')`);
      assert.strictEqual(task.arguments[0], longArg);
      assert.strictEqual((task.arguments[0] as string).length, 1000);
    });

    it('должен правильно обработать аргумент со смешанными кавычками', () => {
      const task = new MobMicroTask('_code.nps.foo("text", \'text2\')');
      assert.deepStrictEqual(task.arguments, ['text', 'text2']);
    });
  });

  describe('#run — multiple commands execution', () => {
    it('должен правильно выполнить несколько разных команд последовательно', () => {
      const calls: string[] = [];
      const obj = {
        nps: {
          first: function () { calls.push('first'); },
          second: function () { calls.push('second'); }
        }
      };
      const task1 = new MobMicroTask('_code.nps.first()');
      const task2 = new MobMicroTask('_code.nps.second()');
      task1.run(obj, {});
      task2.run(obj, {});
      assert.deepStrictEqual(calls, ['first', 'second']);
    });

    it('должен сохранить состояние между вызовами run', () => {
      let counter = 0;
      const obj = {
        action: {
          increment: function () { counter++; }
        }
      };
      const task = new MobMicroTask('_code.action.increment()');
      task.run(obj, {});
      task.run(obj, {});
      task.run(obj, {});
      assert.strictEqual(counter, 3);
    });
  });
});
