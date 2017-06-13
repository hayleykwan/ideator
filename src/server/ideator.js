var debug = require('debug')('ideator:server:ideator');
var dataLoader = require('./data-loader');
var dataSelector = require('./data-selector');
var graphUpdate = require('./graph-update');
var utils = require('./utils');

function Ideator(){
  debug('ideator service ready');
}

Ideator.prototype.search = function(submitted, currentGraphJSON) {
  // catch if currentGraphJSON is null;
  var currentGraph = utils.removeD3Extras(JSON.parse(currentGraphJSON));

  var word = submitted.word;
  var deg = submitted.degConnection;
  var num = submitted.numSuggestion;

  return dataLoader.search(word).then(results => {
    if(results === 0 || results.length <= 0 || typeof(results) === 'undefined'){ //|| typeof(results) === 'undefined'
      return 0;
    } else {
      debug(results.length);
      var allSelected = dataSelector.select(submitted, currentGraph, results);
      // find images
      var selected = allSelected.slice(0,num);
      var backUp = allSelected.slice(num, allSelected.length);
      var newGraph = graphUpdate(currentGraph, word, selected);
      // debug('Updated graph before emiting: '+ JSON.stringify(newGraph, null, 3));
      var result = {
        newGraphJSON: JSON.stringify(newGraph),
        backUpResults: JSON.stringify(backUp)
      }
      return result;
    }
  })
  .catch(error => { debug(error); });

}

module.exports = new Ideator();
