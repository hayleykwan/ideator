var debug = require('debug')('ideator:server:graphenedb');
var neo4j = require('neo4j-driver').v1;
var config = require('./config');

function GrapheneDB(){
  //constructor
  this.driver = neo4j.driver(config.GRAPHENEDB_URL, neo4j.auth.basic(config.GRAPHENEDB_USER, config.GRAPHENEDB_PASS));

  this.driver.onCompleted = function(metadata) {
    debug(metadata);
  };

  this.driver.onError = function(error) {
    console.log('Driver instantiation failed. Error: '+ error);
  };

}

GrapheneDB.prototype.writeNewWord = function(word){
  debug('Write new word');
  const session = this.driver.session();
  const resultPromise = session.run(
    'CREATE (w:Word {word: $word}) RETURN w',
    {'word': word}
  );
  resultPromise.then(result => {
    result.records.forEach(function(record){
      debug('record: ' + record);
      const node = record.get(0);
      debug('node.properties.word: ' + node.properties.word);
    });
    session.close();
  });
  resultPromise.catch(function (error) {
    console.log(error);
  })
}

GrapheneDB.prototype.read = function(){
  const session = this.driver.session();
  const resultPromise = session.run(
    'MATCH (w:Word {word: $word}) RETURN w',
    {'word': 'hello'}
  );
  resultPromise.then(result => {
    result.records.forEach(function(record){
      debug('record: ' + record);
      const node = record.get(0);
      debug('node: ' + node);
      debug('node.properties.word: ' + node.properties.word);
    });
    session.close();
  })

}

GrapheneDB.prototype.exists = function(word) {
  debug('check if word exists');
  const session = this.driver.session();
  const promise = session.run(
    'MATCH (w:Word {word: $word}) RETURN w',
    {'word': word}
  );

  var exists = promise.then(result => {
    session.close();

    if(result.records.length === 0){
      return false;
    } else if (result.records.length > 1){
      // duplicate nodes!
      return 'duplicate!';
    } else if (result.records.length === 1){
      return true;
    }
  })

  return exists;

}

GrapheneDB.prototype.getRelationsBasedOn = function(){

}

GrapheneDB.prototype.close = function(){
  debug('db closing');
  this.driver.close();
}

module.exports = new GrapheneDB();
