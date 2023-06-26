'use strict';

import assert from 'node:assert/strict';
import ImageLoader from '../../js/class/ImageLoader.js';

describe.skip('ImageLoader', () => {
  describe('constructor', () => {
    it('should load image successfully', async () => {
      const url = 'https://example.com/image.jpg';
      const result = await new ImageLoader(url);

      assert.ok(result instanceof Image);
      assert.strictEqual(result.src, url);
    });

    it('should reject when image fails to load', async () => {
      const url = 'https://example.com/invalid.jpg';
      const imageLoader = new ImageLoader(url);

      try {
        await imageLoader;
        assert.fail('Expected promise to be rejected');
      } catch (error) {
        assert.ok(error instanceof Error);
      }
    });
  });

  describe('all', () => {
    it('should load all images successfully', async () => {
      const urls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
      const imageLoaders = await ImageLoader.all(urls);

      assert.strictEqual(imageLoaders.length, urls.length);
      assert.ok(imageLoaders[0] instanceof Image);
      assert.ok(imageLoaders[1] instanceof Image);
    });

    it('should reject when any image fails to load', async () => {
      const urls = ['https://example.com/image1.jpg', 'https://example.com/invalid.jpg'];
      const imageLoaders = ImageLoader.all(urls);

      try {
        await imageLoaders;
        assert.fail('Expected promise to be rejected');
      } catch (error) {
        assert.ok(error instanceof Error);
      }
    });
  });
});
