var debug = require('debug')('ideator:server:data-explorer');
const datamuseUtils = require('./datamuse-utils');
const graphenedb = require('./graphenedb');

function DataExplorer() {

}

DataExplorer.prototype.explore = function(word){

  return datamuseUtils.query(word).then(datamuseResults => {
    if(datamuseResults.length > 0){
      writeResults(word, datamuseResults);
      return datamuseResults;
    } else {
      debug('no results from datamuse');
      //datamuse has no results, resort to web crawling
      return 0;
      // var webResults = spider.crawl(word);
      // var query = draftWebCrawlResultsQuery(word, webResults);
      // graphenedb.write(query);
      // return webResults;
    }
  });
}

function writeResults(word, resultsArray) {
  for(var i = 0 ; i < resultsArray.length ; i+=2) {
    var max = Math.min(i+2, resultsArray.length);
    var partResult = resultsArray.slice(i, max);
    var query = draftDatamuseResults(word, partResult);
    // debug(query);
    graphenedb.write(query);
  }
}

function draftDatamuseResults(word, array){
  var submitted = 'submittedWordHere';
  var query = 'MERGE (' + submitted + ':Word {wordId: "' + word + '"}) \n';

  for(var i = 0 ; i < array.length ; i++) {
    var result = array[i];
    var wordId = result.wordId,
       display = result.display,
          freq = result.freq,
          type = result.type,
          arrayParams = result.link,
          deg  = result.deg;

    query += 'MERGE (' + display + ':Word {wordId: "' + wordId + '"}) \n';
    query += 'ON CREATE SET ' ;
    // if(result.hasOwnProperty('defs')) {
    //   query += display + '.defs=[' + result.defs + '], ';
    // }
    // if(result.hasOwnProperty('defHeadWord')){
    //   query += display + '.defHeadWord="' + result.defHeadWord + '", ';
    // }
    query += display + '.freq=' + freq + ', ' +
             display + '.type=[' + type + '], ' +
             display + '.queryCount=0 \n ';

    // query += 'ON MATCH SET ' ;
    // // if(result.hasOwnProperty('defs')) { //array of strings
    // //   query += display + '.defs=[' + result.defs + '], ';
    // // }
    // query += display + '.freq=' + freq + ', ' +
    //         display + '.type=[' + type + '] \n' ;

    query += 'MERGE ('+ submitted +')-['+submitted+'_'+display+
      ':Link {type: "'+arrayParams+'", deg: '+deg+'}]-('+display+')\n';
    query += 'ON CREATE SET '+submitted+'_'+display+'.usageCount=0 \n';
    // for(var p = 0 ; p < arrayParams.length ; p++){
    //   query += 'MERGE ('+ submitted +')-[:Link {type: "'+arrayParams[p]+'"}]-('+display+')\n';
    // }
  }

  return query;
}

module.exports = new DataExplorer();
