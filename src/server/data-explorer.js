var debug = require('debug')('ideator:server:datamuse');
const datamuseUtils = require('./datamuse-utils');

function DataExplorer() {
  this.results = [];
}

DataExplorer.prototype.query = function(word){
/* 1. get suggestions by
 *    a. query datamuse
 *    b. web crawling
 * 2. sort suggestions
 * 3. store in database
 */
  datamuseUtils.query(word);

  return this.results;
}



module.exports = new DataExplorer();
