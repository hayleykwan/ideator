var debug = require('debug')('ideator:server:datamuse');
const datamuseUtils = require('./datamuse-utils');

function Datamuse() {
  this.results = [];
  this.paramEnum = {};
}

//query all possible parameters
//to stock up the database
Datamuse.prototype.query = function(word){
  debug('query datamuse all possible params');
  // for(var i = 0 ; i < Object.keys(paramEnum) ; i++){
  //   datamuseUtils.query(word, paramEnum)
  // }
  debug(datamuseUtils.meansLike(word));

  // debug(typeof(ml));  //undefined
  // this.results.push(ml);
  // debug(this.results); //[empty]

  return this.results;
}



module.exports = new Datamuse();
