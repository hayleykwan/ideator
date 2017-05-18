/*
 * Server Endpoint to database
 */
var debug = require('debug')('ideator:server:data-loader');
var graphenedb = require('./graphenedb');
var datamuse = require('./datamuse');

function DataLoader(){
  debug('Data loader ready to work');
}

DataLoader.prototype.search = function(query){
  // return relations

  // search if submitted word exists on database
  // if not query datamuse
  debug('prototype method: ' + query.word);
  graphenedb.write();
  var result = graphenedb.read();
  debug(result);
  return 0;

}

DataLoader.prototype.exit = function(){
  graphenedb.close();
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
