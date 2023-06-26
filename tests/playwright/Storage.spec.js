import  { test, expect } from '@playwright/test';

test.describe('Storage', () => {
  let page;

  test.beforeEach(async ({browser}) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => localStorage.clear());
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.afterAll(async ({browser}) => {
    await browser.close();
  });

  test('#load', async () => {
    await page.addScriptTag({content: `
      localStorage.setItem('key1', JSON.stringify('value1'));
      localStorage.setItem('key2', JSON.stringify('value2'));
    `});
    await page.addScriptTag({ content: `import storage from "./js/class/Storage.js"; window.storage = storage;`, type: `module`});

    const data = await page.evaluate(async () => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve(storage._data);
        }, 10);
      // return storage._data;
      });
    });

    expect(data).toEqual({ key1: 'value1', key2: 'value2' });
  });

  test('#autoSave', async () => {
    await page.addScriptTag({ content: `import storage from "./js/class/Storage.js"; window.storage = storage;`, type: `module`});
    await page.evaluate(() => {
      storage._setAutoSaveInterval(10); // задаем более быстрый интервал сохранения чтобы не тормозить тестирование
    });
    await page.evaluate(() => {
      storage.key1 = 'value1';
      storage.key2 = 'value2';
    });
    const data = await page.evaluate(async () => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            key1: JSON.parse(localStorage.getItem('key1')),
            key2: JSON.parse(localStorage.getItem('key2'))
          })
        }, storage._getAutoSaveInterval() * 2) // должно быть больше чем интервал автосохранения
      });
    });

    expect(data.key1).toBe('value1');
    expect(data.key2).toBe('value2');
  });

  test('#stopAutoSave', async () => {
    await page.addScriptTag({ content: `import storage from "./js/class/Storage.js"; window.storage = storage;`, type: `module`});
    const intervalId = await page.evaluate(async () => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve(storage.stopAutoSave());
        }, 100);
      })
      ;
    });
    expect(intervalId).toBeNull();
  });

  test('#startAutoSave', async () => {
    await page.addScriptTag({ content: `import storage from "./js/class/Storage.js"; window.storage = storage;`, type: `module`});
    const intervalId = await page.evaluate(async () => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          storage.stopAutoSave();
          setTimeout(() => {
            resolve(storage.startAutoSave());
          },0);
        }, 50);
      });
    });
    expect(intervalId).not.toBeNull();
    expect(typeof intervalId).toEqual('number');
  });
  test('#clearAll', async () => {
    await page.addScriptTag({content: `
      localStorage.setItem('key1', JSON.stringify('value1'));
      localStorage.setItem('key2', JSON.stringify('value2'));
      `,  type: 'module'});
    await page.addScriptTag({ content: `import storage from "./js/class/Storage.js"; window.storage = storage;`, type: `module`});
    let data;
    // Проверка, что данные загружены
    data = await page.evaluate(async () => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve(storage._data);
        }, 50);
      })
    });
    expect(data.key1).toBe('value1');
    expect(data.key2).toBe('value2');
    // Очищаем данные проверяем, что данные в storage очищены
    data = await page.evaluate(async () => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          storage.clearAll();
          setTimeout(() => {
            resolve(storage._data);
          },0);
        }, 50);
      });
    });
    expect(data.key1).toBeUndefined();
    expect(data.key2).toBeUndefined();
    // Очищаем данные проверяем, что данные в LocalStorage так же очищены
    data = await page.evaluate(async () => {
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            key1: JSON.parse(localStorage.getItem('key1')),
            key2: JSON.parse(localStorage.getItem('key2'))
          });
        }, 0);
      });
    });
    expect(data.key1).toBeNull();
    expect(data.key2).toBeNull();
  });
  test('#setOnce', async () => {
    await page.addScriptTag({content: `localStorage.setItem('key1', JSON.stringify('value1'));`,  type: 'module'});
    await page.addScriptTag({ content: `import storage from "./js/class/Storage.js"; window.storage = storage;`, type: `module`});
    const data = await page.evaluate(async () => {
      try {
        return await new Promise((resolve) => {
          setTimeout(() => {
            storage.setOnce('key1', 'newValue1');
            storage.setOnce('key2', 'newValue2');
            setTimeout(() => {
              resolve(storage._data);
            },0);
          }, 50);
        });
      } catch (err) {

      }

    });
    expect(data.key1).toBe('value1');
    expect(data.key2).toBe('newValue2');
  });
});
