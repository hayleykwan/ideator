var debug = require('debug')('ideator:server:ideator');
var dataLoader = require('./data-loader');
var graphUpdate = require('./graph-update');
var utils = require('./utils');

var datamuse = require('datamuse');

function Ideator(){
  debug('ideator service ready');
}

Ideator.prototype.process = function(submitted, currentGraphJSON) {
  var currentGraph = utils.removeD3Extras(JSON.parse(currentGraphJSON));

  var queryWord = submitted.word;
  var queryDeg = submitted.degConnection;
  var queryNum = submitted.numSuggestion;

  debug('Query: ' + queryWord + ', ' + queryNum);

  var dataLoaderPromise = dataLoader.search(queryWord).then(results => {
    if(results.length > 0){
      debug(results.length);
      return results;
    }else {
      debug(results);
      return 0;
    }
  })
  .catch(error => {
    debug(error);
  });

  var updatePromise = dataLoaderPromise.then(results => {
    if(results == 0 ){
      debug('HERE')
      return 0;
    }else {
      debug(results.length);
      //process with data selector
      //graph update
      //return JSON.stringify(newGraph);
    }
  });

  // return updatePromise;


  return datamuse.words({
    ml: queryWord,
    max: queryNum
  })
  .then((allRelations) => {
    debug(allRelations);
    var newGraph = graphUpdate(currentGraph, submitted, allRelations);
    // debug('Updated graph before emiting: '+ JSON.stringify(newGraph, null, 3));
    return JSON.stringify(newGraph);
  })
}

module.exports = new Ideator();
