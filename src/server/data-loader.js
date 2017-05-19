/*
 * Server Endpoint to database
 */
var debug = require('debug')('ideator:server:data-loader');
var graphenedb = require('./graphenedb');
var datamuse = require('./datamuse');
var utils = require('./utils')

function DataLoader(){
  debug('Data loader ready to work');
}

DataLoader.prototype.search = function(queryWord){

  var relations = {};
  var existsPromise = graphenedb.exists(queryWord);
  promise.then(function(exists) {
    debug(exists);
    // if(!exists){
    //   // var suggestions
    // }
  })
  // if(!graphenedb.exists(queryWord)){
  //   graphenedb.writeNewWord(queryWord);
  //   var suggestions = datamuse.query(queryWord);
  //   if(suggestions.length === 0){
  //     relations = 'Not Found';
  //     return relations;
  //   } else{
  //     debug(suggestions.length);
  //     debug('Result from datamuse: '+ suggestions);
  //     // graphenedb.load(json)
  //   }
  //
  // }
  // var relations = graphenedb.getRelationsBasedOn(idea);
  return 0;
}

DataLoader.prototype.exit = function(){
  graphenedb.close();
}

module.exports = new DataLoader();
