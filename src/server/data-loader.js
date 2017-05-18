/*
 * End point of server to database
 */
console.log('at data-loader');
const neo4j = require('neo4j-driver').v1;


/**
 * Connect to Neo4j Database
 */

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

// driver.close(); //should be on application exit


//constructor: connect to database

// receive query
// return relations

// on application exit, end session
