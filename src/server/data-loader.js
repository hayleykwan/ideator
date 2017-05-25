var debug = require('debug')('ideator:server:data-loader');
var graphenedb = require('./graphenedb');
var dataExplorer = require('./data-explorer');
var utils = require('./utils')

function DataLoader(){
  debug('Data loader ready to work');
}

DataLoader.prototype.search = function(queryWord){

  var existsPromise = graphenedb.exists(queryWord);

  existsPromise.then(function(exists) {
    debug(exists);
    if(!exists){
      dataExplorer.query(queryWord);
      // if results.length === 0 th en return
      // write all to database
      // return results
    } else {
      // read all results from database
      //return results
    }
  })
  return 0;
}

DataLoader.prototype.exit = function(){
  graphenedb.close();
}

module.exports = new DataLoader();
