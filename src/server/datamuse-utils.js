var debug = require('debug')('ideator:server:datamuse-utils');
const datamuse = require('datamuse');

function DatamuseQuery(){
  this.params = {
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
    'sp':      'spells like'  ,
    'sl':      'sounds like'  ,
    'rel_rhy': 'rhymes perfect'  ,
    'rel_nry': 'rhymes kind of'  ,
    // 'rel_hom': 'known homophones' ,
    'rel_cns': 'consonant match'
  }
}

DatamuseQuery.prototype.query = function(word){

  let promises = [];
  for(let p in this.params){
    promises.push(query(word, p, this.params[p]));
  }

  return Promise.all(promises).then(allResults => {
    var onearray = [];
    allResults.forEach(results => {
      if (results.length > 0) { //typeof results !== 'undefined' &&
        results.forEach(resultItem => {
          var i = indexOfWordInResults(onearray, resultItem);
          if(i == -1){
            onearray.push(resultItem);
          } else {
            onearray[i].link.concat(resultItem.param);
          }
        })
      }
    });
    debug(onearray.length);
    return onearray
  })
  .catch(e => {debug(e)});
}

var query = function(word, param, meaning){
  let query = {};
  query[param] = word;
  query['max'] = 60;
  query['md'] = 'fpd';
  return datamuse.words(query).then( data => {
    debug(param + ' has results: ' + data.length);
    data.forEach( d => {
      delete d.score;
      delete d.numSyllables;

      d['wordId'] = d.word;
      d['display'] = '_' + d.word.replace(/[^A-Za-z0-9]/g, '_');
      delete d.word;

      d['link'] = [meaning];

      if(d.hasOwnProperty('defs')) {
        var newDefs = [];
        d.defs.forEach(str => {
          var s = str.replace(/\t/g, ": ");
          newDefs.push('"' + s.replace(/["'-\\]/g, "") + '"')
        });
        delete d.defs;
        d['defs'] = newDefs;
      }

      d['freq'] = parseFloat(d.tags.pop().replace('f:', ''));
      if(d.tags.length > 0) {
        var tags = [];
        d.tags.forEach(tag => {tags.push('"' + tag + '"')});
        d['type'] = tags;
      }else {
        d['type'] = [""];
      }
      delete d.tags;
    });
    // debug(data);
    return data;
  }).catch(error => {debug(word); console.log(error); });
}

function indexOfWordInResults(array, obj){
  for(var i = 0 ; i < array.length ; i++){
    if(array[i].wordId === obj.wordId){
      return i;
    }
  }
  return -1;
}

function draftMultiParamsQuery(word, params){
  var query = {};
  for(var i = 0 ; i < params.length ; i++){
    var p = params[i];
    query[p] = word;
  }
  return query;
}

module.exports = new DatamuseQuery();
