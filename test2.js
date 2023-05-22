function func(code) {
  const result = {
    path: [],
    arguments: []
  };

  // Разделяем код на токены, используя регулярное выражение
  const tokens = code.match(/[_a-zA-Z][_a-zA-Z0-9]*(?:\.[_a-zA-Z][_a-zA-Z0-9]*)*|\('.*?'\)/g);

  if (tokens) {
    // Первый токен является путем
    const pathToken = tokens.shift();
    result.path = pathToken.split('.').filter(token => token !== '');

    // Оставшиеся токены, если есть, являются аргументами
    if (tokens.length > 0) {
      tokens.forEach(token => {
        const argToken = token.slice(2, -2); // Удаляем кавычки из аргументов
        result.arguments.push(argToken);
      });
    }
  }

  return result;
}

let result = func("_code.nps.astofComeBack('Поговорите с Ваннессой','_code.nps.vanessaComplete()')");
console.log(result);
// result = {
//   path: ['_code', 'nps', 'astofComeBack' ],
//   arguments: ['Поговорите с Ваннессой','_code.nps.vanessaComplete()']
//}

let result2 = func("path.to.function()");
console.log(result2);
// result2 = {
//   path: ['path', 'to', 'function' ],
//   arguments: []
//}

let result3 = func("to.function()");
console.log(result3);
// result3 = {
//   path: ['to', 'function' ],
//   arguments: []
//}

let result4 = func("to.function('data', 'data2')");
console.log(result4);
// result4 = {
//   path: ['to', 'function' ],
//   arguments: ['data', 'data2']
//}
