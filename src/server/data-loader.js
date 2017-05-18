/*
 * End point of server to database
 */
var debug = require('debug')('ideator:server:data-loader');
var neo4j = require('neo4j-driver').v1;
var config = require('./config');
var datamuse = require('./datamuse');

function DataLoader(){
  debug('constructor');
  // this.driver = neo4j.driver(config.NEO4J_URL, neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASS));
  // this.driver.onCompleted = metedata => {debug('Driver created');}
  // this.driver.onError = error => {console.log(error);}
}

DataLoader.prototype.search = function(query){
  // return relations

  // search if submitted word exists on database
  // if not query datamuse
  debug('prototype method' + query.word);
  return 0;

}

DataLoader.prototype.exit = function(){
  this.driver.close();
}

module.exports = new DataLoader();


// const driver = neo4j.driver(uri, neo4j.auth.basic(neo4j, test));
// driver.onCompleted = metedata => {debug('Driver created');}
// driver.onError = error => {debug(error);}
//
// const session = driver.session();
//
// const resultPromise = session.writeTransaction(tx => tx.run(
//   'CREATE (a:Greeting) SET a.message = $message RETURN a.message + ", from node" + id(a)',
//   {message: 'hello, world'}
// ));
// resultPromise.then(result => {
//   session.close();
//   const singleRecord = result.records[0];
//   const greeting = singleRecord.get(0);
//   console.log(greeting);
// });
