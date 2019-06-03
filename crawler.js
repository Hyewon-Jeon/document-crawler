class NaverCrawler {
  constructor(adapter, options = {}) {
    this.api = adapter.api;
    this._urlPrefix = options.apiUrl;
    this._displayCnt = options.displayCnt;
    this._apiKeys = options.apiKeys;
  }

  async* crawl(keyword) {
    let startIdx = 1;

    while(true) {
      const url = this._createUrl(keyword, startIdx);
      const headers = this._chooseApiKey();

      const body = await this.api.get(url, headers);
      const result = JSON.parse(body);

      yield result.items;

      const isStopPoint = !result.items.length || startIdx >= 1000;
      if (isStopPoint) break;

      const lastIdx = startIdx + this._displayCnt;
      startIdx = lastIdx > 1000 ? 1000 : lastIdx;
    }
  }

  _createUrl(keyword, startIdx) {
    return `${this._urlPrefix}?query=${encodeURI(keyword)}&start=${startIdx}&display=${this._displayCnt}`;
  }

  _chooseApiKey() {
    const idx = NaverCrawler.THIS_METHOD_CALL_CNT % this._apiKeys.length;
    const { clientId, clientSecret } = this._apiKeys[idx];

    NaverCrawler.THIS_METHOD_CALL_CNT += 1;

    return {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    };
  }
}


NaverCrawler.THIS_METHOD_CALL_CNT = 0;


module.exports = NaverCrawler;
