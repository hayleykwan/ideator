var debug = require('debug')('ideator:server:graphenedb');
var neo4j = require('gremlin-secure');
var config = require('./config');

function CosmosDB(){
  const client = Gremlin.createClient(
    443,
    config.COSMOSDB_ENDPOINT,
    {
      "session": false,
      "ssl": true,
      "user": `/dbs/${config.COSMOSDB_DATABASE}/colls/${config.COSMOSDB_COLLECTION}`,
      "password": config.COSMOSDB_PRIMARY_KEY
    });
}

CosmosDB.prototype.write = function(query){
  //TODO
}

CosmosDB.prototype.read = function(query){
  //TODO
}

CosmosDB.prototype.getResults = function(word) {
  const session = this.driver.session();
  var promise = session.run(
    'MATCH (n:Word {wordId:"' + word +'"})-[r]-(w:Word) RETURN r,w'
  );
  return promise.then(result => {
    session.close(() => {console.log('Finish getting all results')});
    console.log(result.records.length);
    return result;
  })
}

CosmosDB.prototype.hasResults = function(word){
  console.log('Check if given word, ' + word + ', has results');
  const session = this.driver.session();
  const promise = session.run(
    'MATCH (w:Word {wordId: "'+ word + '"}) \n' +
    'MATCH (w)-[l:Link]-(r) RETURN count(DISTINCT r)'
  );
  return promise.then(result => {
    session.close(() => {console.log('Finish checking if word has results')});
    var num = result.records[0]._fields[0].low;
    console.log(num);
    if(num >= 50){
      return true;
    }
    return false;
  })
}

CosmosDB.prototype.clearAllWords = function(){
  console.log('Called to clear all words and relationships');
  //TODO
}

CosmosDB.prototype.countWords = function(){
  console.log('Called to clear all words and relationships');
  //TODO
}

CosmosDB.prototype.writeNewWord = function(word){
  debug('Write new word: ' + word);
  // TODO
}

CosmosDB.prototype.close = function(){
  console.log('db closing');
  //TODO
}

module.exports = new CosmosDB();
