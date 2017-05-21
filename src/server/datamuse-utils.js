var debug = require('debug')('ideator:server:datamuse-utils');
const datamuse = require('datamuse');
const graphenedb = require('./graphenedb');

function DatamuseQuery(){
  this.params = {
    'spells_like':  'sp',
    'means like':   'ml',
    'adj_to_noun':  'rel_jja',
    'noun_to_adj':  'rel_jjb',
    'synonym':      'rel_syn',
    'antonym':      'rel_ant',
    'trigger':      'rel_trg',
    'is type of':   'rel_spc',
    'specific be':  'rel_gen',
    'comprise of':  'rel_com',
    'is part of':   'rel_par',
    'followed by':  'rel_bga',
    'preceeded by': 'rel_bgb',
    'rhymes perfect':  'rel_rhy',
    'rhymes kind of': 'rel_nry',
    'sounds like':  'sl',
    'known_homophones': 'rel_hom',
    'consonant_match': 'rel_cns'
  }
}

DatamuseQuery.prototype.query = function(word){
  graphenedb.writeNewWord(word);

  var promises = [];
  var p;
  for(p in this.params){
    promises.push(query(word, this.params[p]));
  }
  Promise.all(promises).then(results => {
    debug(results.length);
    debug(results);
  })
}

var fireQueries = function(word, params){
  var query = {};
  query[param] = word;
}

var query = function(word, param){
  var query = {};
  query[param] = word;
  var datamusePromise = datamuse.words(query).then((data) => {
    debug(param + ' has results: ' + data.length);
    // data.forEach((d) => { debug(d); })
    return data;
  });
  return datamusePromise;
}

var draftMultiParamsQuery = function(word, params){
  var query = {};
  for(var i = 0 ; i < params.length ; i++){
    var p = params[i];
    query[p] = word;
  }
  return query;
}

DatamuseQuery.prototype.hasNoResults = function(array){
  return array.length > 0 ;
}

module.exports = new DatamuseQuery();
