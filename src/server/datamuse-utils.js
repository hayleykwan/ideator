var debug = require('debug')('ideator:server:datamuse-utils');
const datamuse = require('datamuse');

function DatamuseQuery(){
  //
}

DatamuseQuery.prototype.meansLike = function(word){
  var results = {};

  datamuse.words({
    ml: word
  }).then((res) => {
    debug(res.length);
    results = res;
    debug(results.length);
  });
  return results;
}

DatamuseQuery.prototype.rel_trigger = function(word){
  var results = {};
  datamuse.words({
    rel_trig: word
  }).then((res) => {
    debug(res);
    results = res;
    debug(results);
  });
  return results;
}

DatamuseQuery.prototype.query = function(word, param){
  var results = {};
  datamuse.words({
    param: word  //param here doesn't do anything
  }).then((res) => {
    results = res;
  });
  return results;
}

module.exports = new DatamuseQuery();

// function query(word, param){
//   datamuse.words({
//     param: word
//   }).then((json) => {return json});
// }
// module.exports = query;
