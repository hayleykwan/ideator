var debug = require('debug')('ideator:server:utils');

module.exports = {

  removeD3Extras: function(currentGraph) {
    currentGraph.nodes.forEach(function(d){
      // delete d.index;
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

  contains: function(array, needle) {
    var l = array.length;
    while(l--){
      if(array[l] === needle) {
        return true;
      }
    }
    return false;
  },

  containMatchWordId: function(array, obj){
    for(var i = 0 ; i < array.length ; i++){
      if(array[i].wordId === obj){
        return i;
      }
    }
    return -1;
  },

  containMatchNodeId: function(array, obj){
    for(var i = 0 ; i < array.length; i++){
      if(array[i].id === obj){
        return true;
      }
    }
    return false;
  },

  containMatchObject: function(array, obj){
    for(var i = 0 ; i < array.length ; i++){
      if(array[i] === obj){
        return true;
      }
    }
    return false;
  }

}
