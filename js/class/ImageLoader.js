export default class ImageLoader {
  constructor(url) {
    return new Promise((resolve, reject) => {
      const elem = new Image();
      elem.onload = () => resolve(elem);
      elem.onerror = reject;
      elem.src = url;
      return elem;
    })
  }

  static async all(urls) {
    return Promise.all(urls.map(async url => new ImageLoader(url)));
  }
}
