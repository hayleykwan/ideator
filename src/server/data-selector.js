var debug = require('debug')('ideator:server:data-selector');

function DataSelector(){
  var submittedWord;
}

DataSelector.prototype.select = function(submitted, allRelations) {

  submittedWord = submitted.word;
  var deg = submitted.degConnection;
  var num = submitted.numSuggestion;

  /* 1. filter:
   *   a/ no words that are similar to given word in spelling and pronounciation
   *   b/ no current nodes
   *   c/ no duplication (ensured by database already)
   * 2. order:
   *   a/ word with most number of params
   *   b/ deg in the relation based on the params (set in data explorer)
   *   c/ word with highest number of queryCount
   *   d/ word with highest number of suggstionCount
   * 3. select:
   *   a/ based on number of sug required
   */

  var nodups = mergeDuplicates(allRelations);
  var filtered = allRelations.filter(filterRelation);
  // var ordered = filtered.order();
  var selected = allRelations.slice(0,num);
  //update queryCount, lastQueried, usageCount
  return selected;

}

var filterRelation = function(relation) {
  var bool = true;
  var word = relation.word
  return bool;
}

function mergeDuplicates(allRelations){
  var nodups = [];
  allRelations.forEach(relation => {
    var i = indexOfWordInResults(nodups, relation);
    if(i == -1){
      relation.link = [relation.link];
      nodups.push(relation);
    } else {
      nodups[i].link.push(relation.link);
      nodups[i].deg = degAvg(nodups[i].link);
    }
  });
  debug(nodups);
  return nodups;
}

function degAvg(array){
  // if (array.length <= 1) {
  //   debug('SHOULD NOT OCCUR')
  //   return contains(['ml','rel_syn','rel_ant','rel_spc','rel_gen'], array.pop()) ? 1: 0
  // };
  var denominator = array.length;
  var degs = array.map(function(param) {
    return contains(['means like','synonym','antonym','is type of','specific be'], param)? 1: 0
  });
  var n = degs.reduce(function(acc, val){
    return acc + val;
  }, 0);
  return n / denominator;

}

function indexOfWordInResults(array, obj){
  for(var i = 0 ; i < array.length ; i++){
    if(array[i].wordId === obj.wordId){
      return i;
    }
  }
  return -1;
}

function contains(array, obj){
  for(var i = 0 ; i < array.length ; i++){
    if(array[i] === obj){
      return true;
    }
  }
  return false;
}

module.exports = new DataSelector();
