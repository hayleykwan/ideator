var debug = require('debug')('ideator:server:data-loader');
var graphenedb = require('./graphenedb');
var dataExplorer = require('./data-explorer');
var utils = require('./utils')

function DataLoader(){
}

DataLoader.prototype.search = function(word){
  // graphenedb.clearAllWords();

  return graphenedb.hasResults(word).then((exists) => {
    if(!exists){
      debug('Going to explore');
      return dataExplorer.explore(word);
      //return 0 or return all results, written to database
    } else {
      debug('Going to read from database');
      return graphenedb.getResults(word).then(res =>{
        var results = [];
        if(res.records.length > 0){
          res.records.forEach(d => {
            var r = {};
            r['link'] = d.get(0).properties.type;
            r['deg'] = parseFloat(d.get(0).properties.deg);
            r['usageCount'] = parseFloat(d.get(0).properties.usageCount);
            r['wordId'] = d.get(1).properties.wordId;
            r['queryCount'] = parseFloat(d.get(1).properties.queryCount);
            r['freq'] = parseFloat(d.get(1).properties.freq);
            results.push(r);
          })
        }
        return results;
      });
    }
  })
  .catch(e => {console.log(e)});
}

DataLoader.prototype.findLink = function(link){
  return graphenedb.findLink(link).then(res => {
    return res
  })
}

DataLoader.prototype.exit = function(){
  graphenedb.close();
}

module.exports = new DataLoader();
