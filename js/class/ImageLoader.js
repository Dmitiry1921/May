export default class ImageLoader {
  constructor(url, options = {}) {
    const {onload} = options;

    this.onloadhook = onload || (() => undefined);

    return new Promise((resolve, reject) => {
      const elem = new Image();
      elem.onload = () => {
        this.onloadhook(elem);
        resolve(elem);
      };
      elem.onerror = reject;
      elem.src = url;
      return elem;
    })
  }

  static async all(urls) {
    return Promise.all(urls.map(async url => new ImageLoader(url)));
  }
}
