var debug = require('debug')('ideator:server:ideator');

function DataSelector(){

}

DataSelector.prototype.select = function(deg, num, allRelations) {
  var selected = allRelations.slice(0,num);
  return selected;

}

module.exports = new DataSelector();
