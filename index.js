const adapter = require('./adapter');
const Crawler = require('./crawler');
const Repository = require('./repository');
const CrawledDocument = require('./data/crawler/document');


const NAVER_API_OPTIONS = {
  /* 참조: https://developers.naver.com/docs/search/doc/ */
  apiUrl: 'https://openapi.naver.com/v1/search/doc.json', // NAVER API '전문자료' 요청 URL (JSON 타입)
  displayCnt: 100, // 요청 당 최대 검색 결과 출력 건수 = 100
  /*
   * 참조: https://developers.naver.com/apps/#/list
   * 일일 API 호출 허용량: 최대 25000
   * TODO: api key 등록
   */
  apiKeys: [
    { clientId: '', clientSecret: '' },
  ]
};



/* TODO: 검색할 키워드 입력 */
const KEYWORD = '도시';




async function run() {
  const crawler = new Crawler(adapter, NAVER_API_OPTIONS);
  const repo = new Repository(adapter);

  try {
    if (typeof KEYWORD !== 'string') throw new TypeError(`type of keyword should string: ${KEYWORD}`);

    for await (const results of crawler.crawl(KEYWORD)) {
      const documents = results.map(r => new CrawledDocument(r));
      await repo.save(KEYWORD, documents);
    }

    console.log('crawling done!');
  } catch (e) {
    throw e;
  } finally {
    adapter.db.disconnect();
  }
};


run();