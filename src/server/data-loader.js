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
    // if(!exists){
      return dataExplorer.query(submittedWord);
      //return 0 if no results
      //else return all results, written to database
    // } else {
      // read all results from database
      //return results
    // }
  })
}

DataLoader.prototype.exit = function(){
  graphenedb.close();
}

module.exports = new DataLoader();
