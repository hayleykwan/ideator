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
    if(results.length > 0){
      // debug(results);
      // no need for web crawling ?
      var newDataCypher = writeNewDataQuery(results);
      // graphenedb.write(newDataCypher);
      // draft query to database
      // write to database
      return results;
    } else {
      return '';
    }
  });


}

function writeNewDataQuery(resultsArray){
  // for each result
  // check if exist in database
  // if not create
  // else update

  var stat = 'hi';
  for(var r = 0 ; r < resultsArray.length ; r++){
    var result = resultsArray[r];
    var check = 'MATCH (' + result.word + ':Word {word: ' + result.word + '}) RETURN ' + result.word + '; \n';
    stat += check;
  }
  debug(stat);
  return stat
}



module.exports = new DataExplorer();
