export default class PaginatedArray {
  constructor(arr = [], pageLen = 10) {
    this.pageCount = Math.ceil(arr.length / pageLen);
    this.pages = [];

    for (let i = 0; i < this.pageCount; i++) {
      this.pages[i] = arr.slice(i * pageLen, (1 + i) * pageLen);
    }
  }
}
