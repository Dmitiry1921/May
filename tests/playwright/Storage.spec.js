import  { test, expect } from '@playwright/test';
import { STATIC_SERVER_URL } from "../../server/config.js";

const filePath = './GameEngine/Storage/Storage.js';

test.describe('Storage', () => {
  test.describe.parallel('parallel', () => {
    let page;
    test.beforeEach(async ({browser}) => {
      page = await browser.newPage();
      await page.goto(STATIC_SERVER_URL);
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
      await page.addScriptTag({ content: `import storage from "${filePath}"; window.storage = storage;`, type: `module`});

      const data = await page.evaluate(async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve(window.storage._data);
          }, 10);
          // return window.storage._data;
        });
      });

      expect(data).toEqual({ key1: 'value1', key2: 'value2' });
    });
    test('#autoSave', async () => {
      await page.addScriptTag({ content: `import storage from "${filePath}"; window.storage = storage;`, type: `module`});
      await page.evaluate(() => {
        window.window.storage._setAutoSaveInterval(10); // задаем более быстрый интервал сохранения чтобы не тормозить тестирование
      });
      await page.evaluate(() => {
        window.storage.key1 = 'value1';
        window.storage.key2 = 'value2';
      });
      const data = await page.evaluate(async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              key1: JSON.parse(localStorage.getItem('key1')),
              key2: JSON.parse(localStorage.getItem('key2'))
            })
          }, window.storage._getAutoSaveInterval() * 2) // должно быть больше чем интервал автосохранения
        });
      });

      expect(data.key1).toBe('value1');
      expect(data.key2).toBe('value2');
    });
    test('#stopAutoSave', async () => {
      await page.addScriptTag({ content: `import storage from "${filePath}"; window.storage = storage;`, type: `module`});
      const intervalId = await page.evaluate(async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve(window.storage.stopAutoSave());
          }, 100);
        })
          ;
      });
      expect(intervalId).toBeNull();
    });
    test('#startAutoSave', async () => {
      await page.addScriptTag({ content: `import storage from "${filePath}"; window.storage = storage;`, type: `module`});
      const intervalId = await page.evaluate(async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            window.storage.stopAutoSave();
            setTimeout(() => {
              resolve(window.storage.startAutoSave());
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
      await page.addScriptTag({ content: `import storage from "${filePath}"; window.storage = storage;`, type: `module`});
      let data;
      // Проверка, что данные загружены
      data = await page.evaluate(async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve(window.storage._data);
          }, 50);
        })
      });
      expect(data.key1).toBe('value1');
      expect(data.key2).toBe('value2');
      // Очищаем данные проверяем, что данные в storage очищены
      data = await page.evaluate(async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            window.storage.clearAll();
            setTimeout(() => {
              resolve(window.storage._data);
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
      await page.addScriptTag({ content: `import storage from "${filePath}"; window.storage = storage;`, type: `module`});
      const data = await page.evaluate(async () => {
          return await new Promise((resolve) => {
            setTimeout(() => {
              window.storage.setOnce('key1', 'newValue1');
              window.storage.setOnce('key2', 'newValue2');
              setTimeout(() => {
                resolve(window.storage._data);
              },0);
            }, 50);
          });
      });
      expect(data.key1).toBe('value1');
      expect(data.key2).toBe('newValue2');
    });
  });
});
