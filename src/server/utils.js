var debug = require('debug')('ideator:server:utils');

module.exports = {

  removeD3Extras: function(currentGraph) {
    currentGraph.nodes.forEach(function(d){
      delete d.index;
      delete d.x;
      delete d.y;
      delete d.vx;
      delete d.vy;
      delete d.fx;
      delete d.fy;
    });

    currentGraph.links.forEach(function(d){
      d.source = d.source.id;
      d.target = d.target.id;
      delete d.index;
    });

    return currentGraph;
  },

  test: function() {
    debug('importing and exporting right');
  },



}
