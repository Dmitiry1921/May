'use strict';

import assert from 'node:assert/strict';

import MobMicroTask from '../MobMicroTask.js';

const caseData = {
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
}

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
});
