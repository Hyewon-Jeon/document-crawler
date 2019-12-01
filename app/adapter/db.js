const mysql = require('mysql');


class Db {
  constructor(options = {
    // TODO: db 설정
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'crawler',
    queryTimeout: 2000,
    maxRetryCnt: 5,
    retryErrorCodes: new Set([
      'PROTOCOL_SEQUENCE_TIMEOUT', 'ER_LOCK_DEADLOCK',
    ]),
  }) {
    this._queryTimeout = options.queryTimeout;
    this._dbInfo = {
      host: options.host,
      user: options.user,
      password: options.password,
      database: options.database,
    };
    this._maxRetryCnt = options.maxRetryCnt;
    this._retryErrorCodes = options.retryErrorCodes;
    this._pool = mysql.createPool(this._dbInfo);
  }

  _getConnection() {
    return new Promise((resolve, reject) => {
      this._pool.getConnection((err, conn) => {
        if (err) return reject(err);

        return resolve(conn);
      });
    });
  }

  disconnect() {
    if (this._pool && typeof this._pool.end !== 'function') {
      this._pool = null;
      return;
    }

    return new Promise((resolve, reject) => {
      this._pool.end((err) => {
        if (err) return reject(err);

        this._pool = null;
        return resolve();
      });
    });
  }

  /*
   * @param {String} query
   * @param {Array} values
   * @return {Object or Array}
   */
  async execute(query, values = [], retryCnt = 0) {
    if (retryCnt > this._maxRetryCnt) return new Error('maxRetryQuery');

    const conn = await this._getConnection();

    return new Promise((resolve, reject) => {
      conn.query({
        values,
        sql: query,
        timeout: this._queryTimeout,
      }, (err, results) => {
        if (err) {
          conn.destroy();
          return this._retryErrorCodes.has(err.code)
            ? resolve(this.execute(query, values, retryCnt + 1))
            : reject(err);
        }

        conn.release();
        return resolve(results);
      });
    });
  }
}


module.exports = Db;
