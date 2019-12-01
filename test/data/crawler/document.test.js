const { expect } = require('chai');
const NaverCrawledDocument = require('../../../app/data/crawler/document');


describe('NaverCrawledDocument', () => {
  const param = {
    title: ' 평생학습<b>도시</b> 조성을 위한 추진모형 연구 ',
    link: ' http://academic.naver.com/article.naver?doc_id=11440338&amp; ',
    description: ' A Study on a Model of the Lifelong Learning City in Korea  목차&amp;\n평생학습<b>도시</b> 조성을 위한 추진모형 연구/김신일 1',
  };

  it('getTitle', () => {
    // Given
    const expectTitle = '평생학습도시 조성을 위한 추진모형 연구';

    // When
    const document = new NaverCrawledDocument(param);

    // Result
    expect(document.title).to.equal(expectTitle);
  });

  it('getLink', () => {
    // Given
    const expectLink = 'http://academic.naver.com/article.naver?doc_id=11440338&';

    // When
    const document = new NaverCrawledDocument(param);

    // Result
    expect(document.link).to.equal(expectLink);
  });

  it('getDescription', () => {
    // Given
    const expectDescription = 'A Study on a Model of the Lifelong Learning City in Korea  목차&\n평생학습도시 조성을 위한 추진모형 연구/김신일 1';

    // When
    const document = new NaverCrawledDocument(param);

    // Result
    expect(document.description).to.equal(expectDescription);
  });
});