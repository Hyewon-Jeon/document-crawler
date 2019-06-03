const mandatory = key => {throw new TypeError(`${key} is empty`)};


class NaverCrawledDocument {
  constructor(param) {
    const {
      title = mandatory('key'),
      link = mandatory('link'),
      description = mandatory('description')
    } = param;

    this._title = this._convertHtmlEntities(this._removeBoldTag(title.trim()));
    this._link = this._convertHtmlEntities(this._removeBoldTag(link.trim()));
    this._description = this._convertHtmlEntities(this._removeBoldTag(description.trim()));
  }

  get title() { return this._title; }
  get link() { return this._link; }
  get description() { return this._description; }

  _removeBoldTag(str) {
    return str
      .replace(/<b>/gi, '')
      .replace(/<\/b>/gi, '');
  }

  _convertHtmlEntities(str) {
    return str
      .replace('/&amp;/g', '&')
      .replace('/&nbsp;/g', ' ')
      .replace('/&lt;/g', '<')
      .replace('/&gt;/g', '>');
  }
}


module.exports = NaverCrawledDocument;