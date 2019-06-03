const Api = require('./api');
const Database = require('./db');


module.exports = {
  api: new Api(),
  db: new Database(),
};
