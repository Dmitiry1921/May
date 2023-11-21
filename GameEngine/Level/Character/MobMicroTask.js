'use strict';

export class MobMicroTask {
  constructor(codePath) {
    const [, pathString, argString] = codePath.match(/^(.*?)(\(.*)$/);

    this.code = codePath;
    this.path = pathString.split('.');
    this.arguments = argString
      .replace(/;$/, '')
      .slice(1, -1)
      .split(/\s*,\s*/)
      .filter(Boolean)
      .map(arg => arg.replace(/^['"]+|['"]+$/g, ''))
      .map(arg => isNaN(Number(arg)) ? arg : Number(arg));
  }

  static getFuncByPath(obj, path) {
    const properties = path.split('.');
    const value = obj[properties.shift()];

    if (value !== undefined && (typeof value === 'function' || (typeof value === 'object' && value !== null))) {
      if (typeof value === 'function' && properties.length === 0) {
        return value;
      }
      return this.getFuncByPath(value, properties.join('.'));
    }

    return undefined;
  }

  run(obj, context = {}) {
    const [, ...path] = this.path;
    const func = MobMicroTask.getFuncByPath(obj, path.join('.'));
    func.bind(context, ...this.arguments)();
  }

  toString() {
    return this.code;
  }
}

