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

  return dataLoader.search(queryWord).then(results => {
    if(results === 0 || results.length <= 0){
      return 0;
    } else {
      var selected = results.slice(0,5);
      debug(selected);
      var newGraph = graphUpdate(currentGraph, submitted, selected);
      debug('Updated graph before emiting: '+ JSON.stringify(newGraph, null, 3));
      return JSON.stringify(newGraph);
      // return results;
    }
  })
  .catch(error => {
    debug(error);
  });

  // return datamuse.words({
  //   ml: queryWord,
  //   max: queryNum
  // })
  // .then((allRelations) => {
  //   debug(allRelations);
  //   var newGraph = graphUpdate(currentGraph, submitted, allRelations);
  //   // debug('Updated graph before emiting: '+ JSON.stringify(newGraph, null, 3));
  //   return JSON.stringify(newGraph);
  // })
}

module.exports = new Ideator();
