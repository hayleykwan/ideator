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
      var newDataCypher = writeDatamuseResultsToDatabase(submittedWord, results);
      // graphenedb.write(newDataCypher);
      // draft query to database
      // write to database
      return results;
    } else {
      // go web crawling
      return 0;
    }
  });
}

function writeDatamuseResultsToDatabase(submittedWord, resultsArray){
  // submittedWord does not exist, write to database
  var query = 'CREATE ('+ submittedWord.replace(/\s/g, '_') +
    ':Word {wordId: "' + submittedWord + '"}) \n';

  resultsArray.forEach( result => {
    // debug(result);
    var wordId = result.wordId,
        display = result.display,
        freq = result.freq,
        type = result.type,
        arrayParams = result.param;
    query += 'MERGE (' + display + ':Word {wordId: "' + wordId + '"}) \n';
    query += 'ON CREATE SET ' + display + '.freq=' + freq + ', ' +
      display + '.type=[' + type + '], ' ;
      // display + '.suggestionCount: ' + display + '.suggestionCount + 1, ';
    if(result.hasOwnProperty('defs')) { //array of strings
      query += display + '.defs=[' + result.defs + '] \n';
      //COALESCE()
    }
    if(result.hasOwnProperty('defHeadWord')){
      query += display + '.defHeadWord="' + result.defHeadWord + '" \n';
    }
    query += 'ON MATCH SET ' + display + '.suggestionCount=' + display + '.suggestionCount + 1 \n';
    for(var p = 0 ; p < arrayParams.length ; p++){
      query += 'MERGE (' + submittedWord.replace(/\s/g, '_') +
        ')-[:LINK {type: "' + arrayParams[p] + '"}]-(' + display + ')\n';
    }
  })
  debug(query);
  return query
}


module.exports = new DataExplorer();
