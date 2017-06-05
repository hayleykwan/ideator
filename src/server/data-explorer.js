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

  return datamuseUtils.query(submittedWord).then(datamuseResults => {
    if(datamuseResults.length > 0){
      writeResults(submittedWord, datamuseResults);
      return datamuseResults;
    } else {
      debug('no results from datamuse');
      //datamuse has no results, resort to web crawling
      return 0;
      // var webResults = spider.crawl(submittedWord);
      // var query = draftWebCrawlResultsQuery(submittedWord, webResults);
      // graphenedb.write(query);
      // return webResults;
    }
  });
}

function writeResults(submittedWord, resultsArray) {
  for(var i = 0 ; i < resultsArray.length ; i+=5) {
    var max = Math.min(i+5, resultsArray.length);
    var partResult = resultsArray.slice(i, max);
    var query = draftDatamuseResults(submittedWord, partResult);
    // debug(query);
    graphenedb.write(query);
  }
  // resultsArray.forEach ((result) => {
  //   var submitted = 'submittedWordHere';
  //   var query = 'MERGE (' + submitted + ':Word {wordId: "' + submittedWord + '"}) \n';
  //   query += 'ON CREATE SET '+ submitted + '.queryCount = 1 \n';
  //
  //   var wordId = result.wordId,
  //       display = result.display,
  //       freq = result.freq,
  //       type = result.type,
  //       arrayParams = result.link;
  //
  //   query += 'MERGE (' + display + ':Word {wordId: "' + wordId + '"}) \n';
  //   query += 'ON CREATE SET ' ;
  //   if(result.hasOwnProperty('defs')) {
  //     query += display + '.defs=[' + result.defs + '], ';
  //   }
  //   if(result.hasOwnProperty('defHeadWord')){
  //     query += display + '.defHeadWord="' + result.defHeadWord + '", ';
  //   }
  //   query += display + '.freq=' + freq + ', ' +
  //     display + '.type=[' + type + '], ' +
  //     display + '.queryCount=0, ' +
  //     display + '.suggestionCount=0 \n' ;
  //
  //   query += 'ON MATCH SET ' +
  //     display + '.freq=' + freq + ', ' +
  //     display + '.type=[' + type + '], ' ;
  //   if(result.hasOwnProperty('defs')) { //array of strings
  //     query += display + '.defs=[' + result.defs + '], ';
  //   }
  //   query += display + '.suggestionCount=' +display+'.suggestionCount + 1 \n' ;
  //
  //   for(var p = 0 ; p < arrayParams.length ; p++){
  //     query += 'MERGE ('+ submitted +')-[:Link {type: "'+arrayParams[p]+'"}]-('+display+')\n';
  //   }
  //   // debug(query);
  //   graphenedb.write(query);
  // })
}

function draftDatamuseResults(submittedWord, array){
  var submitted = 'submittedWordHere';
  var query = 'MERGE (' + submitted + ':Word {wordId: "' + submittedWord + '"}) \n';

  for(var i = 0 ; i < array.length ; i++) {
    var result = array[i];
    var wordId = result.wordId,
       display = result.display,
          freq = result.freq,
          type = result.type,
          arrayParams = result.link;

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
  }

  return query;
}

module.exports = new DataExplorer();
