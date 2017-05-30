var debug = require('debug')('ideator:server:graphenedb');
var neo4j = require('neo4j-driver').v1;
var config = require('./config');

function GrapheneDB(){
  this.driver = neo4j.driver(config.GRAPHENEDB_URL,
    neo4j.auth.basic(config.GRAPHENEDB_USER, config.GRAPHENEDB_PASS));

  // this.driver.onCompleted = (metadata) => { debug(metadata); };
  this.driver.onError = (error) => {
    console.log('Driver instantiation failed. Error: '+ error);
  };

}

GrapheneDB.prototype.write = function(query){
  const session = this.driver.session();
  session.run(query)
  .then(result => {
    session.close();
    //   () => {
    //   console.log('Finish with writing query');
    //   // debug(result);
    // }
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

GrapheneDB.prototype.existsWord = function(word) {
  console.log('Called to check if given word, ' + word + ' exists');
  const session = this.driver.session();
  const promise = session.run(
    'MATCH (w:Word {wordId: $word}) RETURN w',
    {word: word}
  );

  var exists = promise.then(result => {
    session.close(() => {console.log('Finish checking if word exists')});
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

GrapheneDB.prototype.close = function(){
  console.log('db closing');
  this.driver.close();
}

module.exports = new GrapheneDB();
