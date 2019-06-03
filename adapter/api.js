const request = require('request');


class Api {
  constructor(options = {
    maxRetryCnt: 5,
    retryErrCodes: new Set([
      'ESOCKETTIMEDOUT', 'ETIMEDOUT',
      'ECONNRESET', 'ECONNREFUSED', 'DNSLOOKUPTIMEOUT',
    ])
  }) {
    this._maxRetryCnt = options.maxRetryCnt;
    this._retryErrCodes = options.retryErrCodes;

    this._wait = ms => new Promise(resolve => setTimeout(() => resolve(), ms))
  }

  /*
   * @param {String} url
   * @param {Object} headers
   * @return {Array} bodies
   */
  async get(url, headers) {
    const options = {
      url,
      headers,
      method: 'GET'
    };

    return this._request(options);
  }

  async _request(options, retryCnt = 0) {
    await this._wait(120);

    return new Promise((resolve, reject) => {
      if (retryCnt > this._maxRetryCnt) return reject(new Error('over max retry cnt'));

      request(options, (err, result, body) => {
        if (err) {
          return this._retryErrCodes.has(err.code)
            ? resolve(this._request(options, retryCnt + 1))
            : reject(err);
        }
        return resolve(body);
      });
    });
  }
}


module.exports = Api;
