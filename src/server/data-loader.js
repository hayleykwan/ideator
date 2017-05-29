var debug = require('debug')('ideator:server:data-loader');
var graphenedb = require('./graphenedb');
var dataExplorer = require('./data-explorer');
var utils = require('./utils')

function DataLoader(){
  debug('Data loader ready to work');
}

DataLoader.prototype.search = function(submittedWord){

  return graphenedb.existsWord(submittedWord).then((exists) => {
    debug(exists);
    if(!exists){
      debug('going to explore');
      return dataExplorer.explore(submittedWord);
      //return 0 or return all results, written to database
    } else {
      debug('Going to read from database');
      var query = 'MATCH (n:Word {wordId:"' + submittedWord +'"})-[r]-(w:Word) RETURN r,w'
      return graphenedb.read(query).then(res => {
        debug(res.records.length);
        var results = [];
        if(res.records.length > 0){
          res.records.forEach(d => {
            var r = {};
            r['link'] = d.get(0).properties.type;
            r['suggestion'] = d.get(1).properties.wordId;
            results.push(r);
          })
        }
        return results;
      });
    }
  })
  .catch(e => {console.log(e)});
}

DataLoader.prototype.exit = function(){
  graphenedb.close();
}

module.exports = new DataLoader();
