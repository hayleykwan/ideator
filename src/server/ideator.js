var debug = require('debug')('ideator:server:ideator');
var dataLoader = require('./data-loader');
var dataSelector = require('./data-selector');
var imageProcessor = require('./image-processor');
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
    if(results === 0 || results.length <= 0 || typeof(results) === 'undefined'){
      var result = 0;
    } else {
      debug(results.length);
      var allSelected = dataSelector.select(submitted, currentGraph, results);
      var selected = allSelected.slice(0,num);
      var backUp = allSelected.slice(num, allSelected.length);
      var newGraph = graphUpdate(currentGraph, word, selected);
      var result = {
        newGraphJSON: newGraph,
        backUpResults: backUp
      };
    }
    return JSON.stringify(result);

  })
  .catch(error => { debug(error); });
}

Ideator.prototype.findLink = function(link){

  return dataLoader.findLink(link).then(res => {
    debug(result);
    var result = {
      type: res,
      link: link
    }
    return JSON.stringify(result);
  })

}

Ideator.prototype.removedOrReloaded = function(word){

}

module.exports = new Ideator();
