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
      return dataExplorer.explore(submittedWord);
      //return 0 or return all results, written to database
    // } else {
      // read all results from database
      //return results
    // }
  })
  .catch(e => {console.log(e)});
}

DataLoader.prototype.exit = function(){
  graphenedb.close();
}

module.exports = new DataLoader();
