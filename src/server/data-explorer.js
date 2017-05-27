var debug = require('debug')('ideator:server:data-explorer');
const datamuseUtils = require('./datamuse-utils');
const graphenedb = require('./graphenedb');

function DataExplorer() {

}

DataExplorer.prototype.query = function(submittedWord){
/* 1. get suggestions by
 *    a. query datamuse
 *    b. web crawling
 * 2. sort suggestions
 * 3. store in database
 */

  graphenedb.clearAllWords();

  return datamuseUtils.query(submittedWord).then(results => {
    if(results.length > 0){
      // debug(results);
      // no need for web crawling ?
      var newDataCypher = writeNewDataQuery(submittedWord, results);
      // graphenedb.write(newDataCypher);
      // draft query to database
      // write to database
      return results;
    } else {
      return 0;
    }
  });
}

function writeNewDataQuery(submittedWord, resultsArray){
  // for each result
  // check if exist in database
  // if not create
  // else update
  // submittedWord does not exist, write to database
  var query = 'CREATE ('+ submittedWord + ':Word {wordid: ' + submittedWord + ', queryCount: 1, suggestionCount: 0}) \n';

  for(var r = 0 ; r < resultsArray.length ; r++){
    // debug(resultsArray[r]);
    var result = resultsArray[r];  // all words in array are unique
    // debug(result);
    var checkNode = 'MERGE (' + result.word + ':Word {wordid: "' + result.word + '"}) \n';
    if(result.hasOwnProperty('defs')) {
      checkNode += 'ON CREATE SET ' + result.word + '.defs=[' + result.defs + '] \n';
    }
    var checkRel = 'MERGE (' + submittedWord + ')-[:LINK {' + result.param + '}]-(' + result.word + ')\n';
    query += checkNode + checkRel ;
  }
  // debug(query);
  return query
}


module.exports = new DataExplorer();
