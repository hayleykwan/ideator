var debug = require('debug')('ideator:server:datamuse-utils');
const datamuse = require('datamuse');
var blacklist = require('./data-blacklist');
var utils = require('./utils');

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
    // 'sp':      'spells like'  ,
    // 'sl':      'sounds like'  ,
    'rel_rhy': 'rhymes perfectly'  ,
    // 'rel_nry': 'rhymes kind of'  ,
    // 'rel_hom': 'known homophones' ,
    // 'rel_cns': 'consonant match'
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
          onearray.push(resultItem);
          // var i = indexOfWordInResults(onearray, resultItem);
          // if(i == -1){
          //   onearray.push(resultItem);
          // } else {
          //   onearray[i].link.push(resultItem.link.pop());
          // }
        })
      }
    });
    // debug(onearray.length);
    return onearray
  })
  .catch(e => {console.log(e)});
}

var query = function(word, param, meaning){
  let query = {};
  query[param] = word;
  query['max'] = 60;
  query['md'] = 'f';
  // query['md'] = 'fpd';
  return datamuse.words(query).then( data => {
    var i = 0;
    while(i < data.length){
      var d = data[i];
      if (utils.contains(blacklist, d.word) || /[^A-Za-z\-\s]/.test(d.word)) { //0-9.*+?!^@#$%&{}()|[\]]
        // debug(d.word);
        data.splice(i, 1);
      } else {
        delete d.score;
        delete d.numSyllables;

        d['wordId'] = d.word;
        d['display'] = '_' + d.word.replace(/[^A-Za-z0-9]/g, '_');
        delete d.word;

        // d['link'] = [meaning]; //no filtering duplicates
        d['link'] = meaning;

        d['deg'] = contains(['ml','rel_syn','rel_ant','rel_spc','rel_gen'], param) ? 1 : 0;

        // if(d.hasOwnProperty('defs')) {
        //   var newDefs = [];
        //   d.defs.forEach(str => {
        //     var s = str.replace(/\t/g, ": ");
        //     newDefs.push("'" + s.replace(/["'`-]/, "")+ "'");
        //   });
        //   delete d.defs;
        //   d['defs'] = newDefs;
        // }

        d['freq'] = parseFloat(d.tags.pop().replace('f:', ''));
        // if(d.tags.length > 0) {
        //   var tags = [];
        //   d.tags.forEach(tag => {tags.push('"' + tag + '"')});
        //   d['type'] = tags;
        // }else {
        //   d['type'] = [""];
        // }
        delete d.tags;
        debug(d);
        i++;
      }
    }
    return data;
  })
  .catch(error => {console.log(error); });
}


function contains(array, obj){
  for(var i = 0 ; i < array.length ; i++){
    if(array[i] === obj){
      return true;
    }
  }
  return false;
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
