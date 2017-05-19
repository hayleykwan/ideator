var debug = require('debug')('ideator:server:datamuse');
const datamuseUtils = require('./datamuse-utils');

function Datamuse() {
  this.results = [];
  this.paramEnum = {};
}

Datamuse.prototype.query = function(word){

  datamuseUtils.query(word);

  return this.results;
}



module.exports = new Datamuse();
