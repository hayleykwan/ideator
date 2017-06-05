var debug = require('debug')('ideator:server:ideator');
var dataLoader = require('./data-loader');
var graphUpdate = require('./graph-update');
var utils = require('./utils');

function Ideator(){
  debug('ideator service ready');
}

Ideator.prototype.search = function(submitted, currentGraphJSON) {
  // catch if currentGraphJSON is null;
  var currentGraph = utils.removeD3Extras(JSON.parse(currentGraphJSON));

  var queryWord = submitted.word;
  var queryDeg = submitted.degConnection;
  var queryNum = submitted.numSuggestion;

  return dataLoader.search(queryWord).then(results => {
    if(results === 0 || results.length <= 0 ){ //|| typeof(results) === 'undefined'
      return 0;
    } else {
      debug(results.length);
      var selected = results.slice(0,queryNum);
      // debug(selected);
      var newGraph = graphUpdate(currentGraph, queryWord, selected);
      debug('Updated graph before emiting: '+ JSON.stringify(newGraph, null, 3));
      return JSON.stringify(newGraph);
    }
  })
  .catch(error => { debug(error); });

}

module.exports = new Ideator();
