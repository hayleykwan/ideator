var debug = require('debug')('ideator:server:graphenedb');
var neo4j = require('neo4j-driver').v1;
var config = require('./config');

function GrapheneDB(){
  //constructor
  this.driver = neo4j.driver(config.GRAPHENEDB_URL, neo4j.auth.basic(config.GRAPHENEDB_USER, config.GRAPHENEDB_PASS));

  this.driver.onCompleted = function(metedata) {
    debug('Driver created');
  };

  this.driver.onError = function(error) {
    console.log('Driver instantiation failed. Error: '+ error);
  };

}

GrapheneDB.prototype.write = function(){
  const session = this.driver.session();
  const resultPromise = session.run(
    'CREATE (w:Word {word: $word}) RETURN w',
    {'word': 'HAYLEY'}
  );
  resultPromise.then(result => {
    result.records.forEach(function(record){
      debug('record: ' + record);
      const node = record.get(0);
      debug('node.properties.word: ' + node.properties.word);
    });
    session.close(() => {
      debug('session closed');
    });
  });
  resultPromise.catch(function (error) {
    console.log(error);
  })
}

GrapheneDB.prototype.read = function(){
  var dbresult;
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
    session.close(() => {
      debug('session closed');
    });
    dbresult = result;
  })
  return dbresult;

}

GrapheneDB.prototype.close = function(){
  this.driver.close();
}

module.exports = new GrapheneDB();
