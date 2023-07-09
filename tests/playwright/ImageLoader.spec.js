'use strict';

import {test, expect} from '@playwright/test';
import {STATIC_SERVER_URL} from "../../server/config.js";

test.describe('ImageLoader', () => {
  test.describe.parallel('parallel', () => {
    let page;
    test.beforeEach(async ({browser}) => {
      page = await browser.newPage();
      await page.goto(STATIC_SERVER_URL);
      await page.addScriptTag({
        content: `import ImageLoader from "./GameEngine/Level/Resources/ImageLoader.js"; window.ImageLoader = ImageLoader;`,
        type: `module`
      });
    });

    test.afterEach(async () => {
      await page.close();
    });

    test.afterAll(async ({browser}) => {
      await browser.close();
    });

    test('#constructor', async () => {
      const data = await page.evaluate(async () => {
        const image = await new window.ImageLoader(`./img/sprite/hero.png`);
        return {
          width: image.width,
          height: image.height,
          src: image.src
        };
      });
      expect(data).toEqual({width: 384, height: 256, src: `${STATIC_SERVER_URL}/img/sprite/hero.png`});
    });
    test('#all', async () => {
      const data = await page.evaluate(async () => {
          const images = await window.ImageLoader.all([
            `./img/sprite/hero.png`,
            `./img/sprite/hero1.png`,
            './img/sprite/enemy.png',
            './img/sprite/enemy2.png',
          ]);
          return images.map(image => ({width: image.width, height: image.height, src: image.src}));
      });
      expect(data).toEqual([
        {
          width: 384,
          height: 256,
          src: `${STATIC_SERVER_URL}/img/sprite/hero.png`
        },
        {
          width: 384,
          height: 256,
          src: `${STATIC_SERVER_URL}/img/sprite/hero1.png`
        },
        {
          width: 384,
          height: 256,
          src: `${STATIC_SERVER_URL}/img/sprite/enemy.png`
        },
        {
          width: 384,
          height: 256,
          src: `${STATIC_SERVER_URL}/img/sprite/enemy2.png`
        },
      ]);
    });
  });
});

