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

  let promises = [];
  for(let p in this.params){
    promises.push(query(word, this.params[p]));
  }

  return Promise.all(promises).then(results => {
    var onearray = [];
    results.forEach(res => {
      res.forEach(wordObject => {
        onearray.push(wordObject);
      })
    });

    // break down arrays
    // merge duplicates
    // change params into the
    return onearray
  });
}

var query = function(word, param){
  let query = {};
  query[param] = word;
  return datamuse.words(query).then((data) => {
    debug(param + ' has results: ' + data.length);
    data.forEach((d) => {
      d['param'] = param;
    })
    return data;
  });
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
