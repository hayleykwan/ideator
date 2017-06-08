var debug = require('debug')('ideator:server:data-selector');
var graphenedb = require('./graphenedb');
var utils = require('./utils');
var natural = require('natural');
var soundex = natural.SoundEx;
var metaphone = natural.Metaphone;

function DataSelector(){
  var submittedWord;
  var deg;
  var num;
  var nodes;
}

DataSelector.prototype.select = function(submitted, currentGraph, allRelations) {
  submittedWord = submitted.word;
  deg = submitted.degConnection;
  num = submitted.numSuggestion;
  nodes = currentGraph.nodes;

  var nodups = mergeDuplicates(allRelations);
  var filtered = filterAll(nodups);
  var ordered = sortAll(filtered);
  var selected = ordered.slice(0,num);
  //update queryCount, lastQueried, usageCount

  // for(var i = 0 ; i < selected.length ; i++){
  //   graphenedb.updateQueryCount(selected[i].wordId);
  //   graphenedb.updateLink(selected[i].word)
  // }
  return selected;

}

var sortAll = function(array){
  debug(array.length);
  var degree = sortByDegreeCloseness(array);
  var degreeDone = degree.slice(0, Math.round(degree.length*0.8));

  var mostLinks = sortByMostLinks(degreeDone);
  var mostLinksDone = mostLinks.slice(0, Math.round(mostLinks.length*0.8));

  var freq = sortByFreq(mostLinksDone);
  var freqDone = freq.slice(0, Math.round(freq.length*0.8));

  var popularWord = sortByWordPopularity(freqDone);
  var wordDone = popularWord.slice(0, Math.round(popularWord.length*0.8));

  var popularLink = sortByLinkPopularity(wordDone);
  var linkDone = popularLink.slice(0, Math.round(popularLink.length*0.8));

  var mostLinks = sortByMostLinks(linkDone);
  var mostLinksDone = mostLinks.slice(0, Math.round(mostLinks.length*0.8));

  var degreeAgain = sortByDegreeCloseness(mostLinksDone);
  debug(degreeAgain.length);
  return degreeAgain;
}

var sortByDegreeCloseness = function(array){
  var mapped = array.map(function(val, i){
    return {index: i, value: Math.abs(val.deg - deg)}
  })
  mapped.sort(function(a,b){
    return a.value - b.value;
  });
  var result = mapped.map(function(val){
    return array[val.index]
  });
  return result;
}

var sortByFreq = function(array){
  array.sort(function(a,b){
    if(a.freq > b.freq){
      return -1;
    } else if (a.freq < b.freq){
      return 1;
    }
    return 0;
  });
  return array;
}

var sortByLinkPopularity = function(array){
  if(array[0].hasOwnProperty('usageCount')){
    array.sort(function(a,b){
      if(a.usageCount > b.usageCount){
        return -1;
      } else if (a.usageCount < b.usageCount){
        return 1;
      }
      return 0;
    });
  }
  return array;
}

var sortByWordPopularity = function(array){
  if(array[0].hasOwnProperty('queryCount')){
    array.sort(function(a,b){
      if(a.queryCount > b.queryCount){
        return -1;
      } else if (a.queryCount < b.queryCount){
        return 1;
      }
      return 0;
    });
  }
  return array;
}

var sortByMostLinks = function(array){
  array.sort(function(a,b){
    if(a.link.length > b.link.length){
      return -1;
    } else if (a.link.length < b.link.length){
      return 1;
    }
    return 0;
  });
  return array;
}

var filterAll = function(nodups){
  var filterNode = nodups.filter(filterGraph);
  var filterWord = filterNode.filter(filterSubmitted);
  var filterSugg = filterWord.reduce(
    function(acc, val){
      if(!match){
        return acc;
      } else {
        return acc.concat(val);
      }
    },
    []
  );
  return filterSugg;
}

var match = function(acc, val){
  for(var i = 0 ; i< acc.length ; i++){
    if(soundex.compare(acc[i].wordId, val.wordId) ||
      natural.JaroWinklerDistance(acc[i].wordId, val.wordId) > 0.8){
        debug('matching suggestions')
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
