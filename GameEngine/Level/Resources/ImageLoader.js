export default class ImageLoader extends Image {
  constructor(url) {
    super();
    return new Promise((resolve, reject) => {
      const elem = new Image();
      elem.onload = () => resolve(elem);
      elem.onerror = reject;
      elem.src = url;
      return elem;
    })
  }

  static async all(urls) {
    const uniqUrls = [...new Set(urls)]
    return Promise.all(uniqUrls.map(async url => new ImageLoader(url)));
  }
}
