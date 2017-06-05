var debug = require('debug')('ideator:server:data-selector');

function DataSelector(){

}

DataSelector.prototype.select = function(deg, num, allRelations) {
  var selected = allRelations.slice(0,num);
  allRelations.forEach(r => {
    // debug(r);

  })
  debug(allRelations.length);
  return selected;

}

module.exports = new DataSelector();
