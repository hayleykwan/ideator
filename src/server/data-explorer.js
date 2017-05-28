var debug = require('debug')('ideator:server:data-explorer');
const datamuseUtils = require('./datamuse-utils');
const graphenedb = require('./graphenedb');

function DataExplorer() {

}

DataExplorer.prototype.explore = function(submittedWord){
/* 1. get suggestions by
 *    a. query datamuse
 *    b. web crawling
 * 2. sort suggestions
 * 3. store in database
 */

  graphenedb.clearAllWords();

  return datamuseUtils.query(submittedWord).then(datamuseResults => {
    if(datamuseResults.length > 0){
      var query = draftDatamuseResultsQuery(submittedWord, datamuseResults);
      graphenedb.write(query);
      return datamuseResults;
    } else {
      return 0;
      // var webResults = spider.crawl(submittedWord);
      // var query = draftWebCrawlResultsQuery(submittedWord, webResults);
      // graphenedb.write(query);
      // return webResults;
    }
  });
}

function draftDatamuseResultsQuery(submittedWord, resultsArray){

  var submitted = 'submittedWordHere';
  var query = 'CREATE (' + submitted + ':Word {wordId: "' + submittedWord + '"}) \n';
  query += 'SET '+ submitted + '.queryCount = 1 \n';

  resultsArray.forEach( result => {
    // debug(result);
    var wordId = result.wordId,
        display = result.display,
        freq = result.freq,
        type = result.type,
        arrayParams = result.param;

    query += 'MERGE (' + display + ':Word {wordId: "' + wordId + '"}) \n';
    query += 'ON CREATE SET ' ;
    if(result.hasOwnProperty('defs')) {
      query += display + '.defs=[' + result.defs + '], ';
    }
    if(result.hasOwnProperty('defHeadWord')){
      query += display + '.defHeadWord="' + result.defHeadWord + '", ';
    }
    query += display + '.freq=' + freq + ', ' +
      display + '.type=[' + type + '], ' +
      display + '.queryCount=0, ' +
      display + '.suggestionCount=0 \n' ;

    query += 'ON MATCH SET ' +
      display + '.freq=' + freq + ', ' +
      display + '.type=[' + type + '], ' ;
    if(result.hasOwnProperty('defs')) { //array of strings
      query += display + '.defs=[' + result.defs + '], ';
    }
    query += display + '.suggestionCount=' +display+'.suggestionCount + 1 \n' ;

    for(var p = 0 ; p < arrayParams.length ; p++){
      query += 'MERGE ('+ submitted +')-[:Link {type: "'+arrayParams[p]+'"}]-('+display+')\n';
    }
  })
  // debug(query);
  return query
}


module.exports = new DataExplorer();
