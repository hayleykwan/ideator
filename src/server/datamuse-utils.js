var debug = require('debug')('ideator:server:datamuse-utils');
const datamuse = require('datamuse');
const graphenedb = require('./graphenedb');

function DatamuseQuery(){
  this.params = {
    'sp':      'spells like'  ,
    'ml':      'means like' ,
    'rel_jja': 'adj to noun'  ,
    'rel_jjb': 'description' ,
    'rel_syn': 'synonym'    ,
    'rel_ant': 'antonym'    ,
    'rel_trg': 'trigger'    ,
    'rel_spc': 'is type of' ,
    'rel_gen': 'specific be'  ,
    'rel_com': 'comprise of'  ,
    'rel_par': 'is part of'   ,
    'rel_bga': 'followed by'  ,
    'rel_bgb': 'preceeded by' ,
    'rel_rhy': 'rhymes perfect'  ,
    'rel_nry': 'rhymes kind of'  ,
    'sl':      'sounds like'  ,
    'rel_hom': 'known_homophones' ,
    'rel_cns': 'consonant_match'
  }
}

function indexOfWordInResults(array, obj){
  for(var i = 0 ; i < array.length ; i++){
    if(array[i].word === obj.word){
      return i;
    }
  }
  return -1;
}

DatamuseQuery.prototype.query = function(word){

  graphenedb.writeNewWord(word);

  let promises = [];
  for(let p in this.params){
    promises.push(query(word, p, this.params[p]));
  }

  return Promise.all(promises).then(allResults => {
    var onearray = [];
    // debug(allResults.reduce((acc, val) => {return acc + val.length}, 0));
    allResults.forEach(results => {
      if (results.length > 0) {
        results.forEach(resultItem => {
          var i = indexOfWordInResults(onearray, resultItem);
          if(i == -1){
            onearray.push(resultItem);
          } else {
            // debug(resultItem.param);
            onearray[i].param.concat(resultItem.param);
          }
        })
      }
    });
    // debug(onearray.length);
    return onearray
  });
}

var query = function(word, param, meaning){
  let query = {};
  query[param] = word;
  return datamuse.words(query).then((data) => {
    debug(param + ' has results: ' + data.length);
    data.forEach((d) => {
      d['param'] = [meaning];
    })
    return data;
  }).catch(error => {
    console.log(error);
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
