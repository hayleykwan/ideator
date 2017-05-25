var debug = require('debug')('ideator:server:data-explorer');
const datamuseUtils = require('./datamuse-utils');
const graphenedb = require('./graphenedb');

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

  graphenedb.clearAllWords();

  datamuseUtils.query(word).then(results => {
    // debug(results);
  });


}



module.exports = new DataExplorer();
