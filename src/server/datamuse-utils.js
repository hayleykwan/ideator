var debug = require('debug')('ideator:server:datamuse-utils');
const datamuse = require('datamuse');

function DatamuseQuery(){
  this.params = {
    means_like:   'ml',
    sounds_like:  'sl',
    spells_like:  'sp',
    adj_to_noun:  'rel_jja',
    noun_to_adj:  'rel_jjb',
    synonym:      'rel_syn',
    antonym:      'rel_ant',
    trigger:      'rel_trg',
    is_type_of:   'rel_spc',
    specific_be:  'rel_gen',
    comprise_of:  'rel_com',
    is_part_of:   'rel_par',
    followed_by:  'rel_bga',
    preceeded_by: 'rel_bgb',
    rhymes_perfect:  'rel_rhy',
    rhymes_kind_of: 'rel_nry',
    known_homophones: 'rel_hom',
    consonant_match: 'rel_cns'
  }
}

DatamuseQuery.prototype.query = function(word){
  var p;
  for(p in this.params){
    query(word, this.params[p]);
  }
}

var query = function(word, param){
  var query = {};
  query[param] = word;
  var datamusePromise = datamuse.words(query).then((data) => {
    debug(param + ' has results: ' + data.length);
    data.forEach((d) => {
      debug(d);
    })
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
