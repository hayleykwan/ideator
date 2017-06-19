var debug = require('debug')('ideator:server:graphenedb');
var neo4j = require('gremlin-secure');
var config = require('./config');

function GrapheneDB(){
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

GrapheneDB.prototype.write = function(query){
  const session = this.driver.session();
  session.run(query)
  .then(result => {
    session.close();
  })
  .catch((error) => { console.log(error); })
}

GrapheneDB.prototype.read = function(query){
  const session = this.driver.session();
  var readPromise = session.run(query);
  return readPromise.then(result => {
    session.close(() => {
      console.log('Finish reading query: ' + query);
    });
    return result;
    // result.records.forEach(function(record){
    //   console.log('record: ' + record);
    //   const node = record.get(0);
    //   console.log('node: ' + node);
    //   console.log('node.properties.wordId: ' + node.properties.wordId);
    //   return record;
    // });

  })
}

GrapheneDB.prototype.getResults = function(word) {
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

GrapheneDB.prototype.hasResults = function(word){
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

GrapheneDB.prototype.clearAllWords = function(){
  console.log('Called to clear all words and relationships');
  const session = this.driver.session();
  session.run(
    'MATCH (n:Word) DETACH DELETE n'
  )
  .then(result => {
    session.close(() => {console.log('Finish clearing all nodes and relationships')});
    // console.log('Should cleared all words: ' + result);
  })
  .catch(error => {console.log(error);});
}

GrapheneDB.prototype.countWords = function(){
  console.log('Called to clear all words and relationships');
  const session = this.driver.session();
  session.run('MATCH (n:Word) RETURN count(n)')
  .then(result => {
    session.close(() => {console.log('Number of words in database: ' + result)});
    // console.log('Should cleared all words: ' + result);
  })
  .catch(error => {console.log(error);});
}

GrapheneDB.prototype.writeNewWord = function(word){
  debug('Write new word: ' + word);
  const session = this.driver.session();
  const resultPromise = session.run(
    'CREATE (w:Word {wordId: $word}) RETURN w',
    {'word': word}
  );
  resultPromise.then(result => {
    session.close(() => {console.log('Finish writing new word: ' + word)});
    result.records.forEach(function(record){
      console.log('record: ' + record);
      const node = record.get(0);
      console.log('node.properties.word: ' + node.properties.wordId);
    });
  });
  resultPromise.catch((error) => { console.log(error); })
}

GrapheneDB.prototype.close = function(){
  console.log('db closing');
  this.driver.close();
}

module.exports = new GrapheneDB();
