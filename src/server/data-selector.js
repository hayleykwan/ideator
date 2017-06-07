var debug = require('debug')('ideator:server:data-selector');
var graphenedb = require('./graphenedb');
var utils = require('./utils');
// var natural = require('natural');
// var soundex = natural.SoundEx;
// var metaphone = natural.Metaphone;

function DataSelector(){
  var submittedWord;
  var nodes;
}

DataSelector.prototype.select = function(submitted, currentGraph, allRelations) {
  submittedWord = submitted.word;
  var deg = submitted.degConnection;
  var num = submitted.numSuggestion;
  nodes = currentGraph.nodes;

  /* 0. Merge duplicates, update degs
   * 1. Filter: submittedWord vs suggestion, suggestion vs suggestion
   *     a/ no words that are similar to given word in spelling and pronounciation
   *     b/ no current nodes
   * 2. Order:
   *     a/ word with most number of params
   *     b/ deg in the relation based on the params (set in data explorer)
   *     c/ word with highest number of queryCount
   *     d/ link with highest number of usageCount
   * 3. Select:
   *     a/ based on number of sug required
   */
  debug(allRelations);
  var nodups = mergeDuplicates(allRelations);
  // var filtered = filterAll(nodups);

  // var ordered = filtered.order();
  var selected = nodups.slice(0,num);
  //update queryCount, lastQueried, usageCount
  return selected;

}

var filterAll = function(nodups){
  var filterNode = nodups.filter(filterGraph);
  var filterWord = filterNode.filter(filterSubmitted);
  var filterSugg = filterWord.reduce(function(acc, val){
    if(match){
      return acc;
    } else {
      return acc.push(val);
    }
  }, []);
  debug(filterSugg);
  return filterWord;
}

var match = function(acc, val){
  for(var i = 0 ; i< acc.length ; i++){
    if(soundex.compare(acc[i].wordId, val.wordId) ||
      natural.JaroWinklerDistance(acc[i].wordId, val.wordId) > 0.8){
        debug(val.wordId);
        return true;
      }
  }
  return false;
}

var filterSubmitted = function(relation) {
  var match = (soundex.compare(submittedWord, relation.wordId) ||
    natural.JaroWinklerDistance(submittedWord, relation.wordId) > 0.9);
  if(match){
    debug('matching submitted')
    debug(relation.wordId);
  }
  return !match;
}

var filterGraph = function(relation){
  var match = utils.containMatchNodeId(nodes, relation.wordId);
  if(match){
    debug('matching graph nodes')
    debug(relation.wordId);
  }
  return !match;
}

function mergeDuplicates(allRelations){
  var nodups = [];
  allRelations.forEach(relation => {
    var i = utils.containMatchWordId(nodups, relation.wordId);
    if(i == -1){
      relation.link = [relation.link];
      nodups.push(relation);
    } else {
      nodups[i].link.push(relation.link);
      nodups[i].deg = degAvg(nodups[i].link);
    }
  });
  return nodups;
}

function degAvg(array){
  // if (array.length <= 1) {
  //   debug('SHOULD NOT OCCUR')
  //   return containMatchObject(['ml','rel_syn','rel_ant','rel_spc','rel_gen'], array.pop()) ? 1: 0
  // };
  var denominator = array.length;
  var degs = array.map(function(param) {
    return utils.containMatchObject(['means like','synonym','antonym','is type of','specific be'], param)? 1: 0
  });
  var n = degs.reduce(function(acc, val){
    return acc + val;
  }, 0);
  return n / denominator;
}



module.exports = new DataSelector();
