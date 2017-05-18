var debug = require('debug')('ideator:server:graphenedb');
var neo4j = require('neo4j-driver').v1;
var config = require('./config');

function GrapheneDB(){
  //constructor
  this.driver = neo4j.driver(config.GRAPHENEDB_URL, neo4j.auth.basic(config.GRAPHENEDB_USER, config.GRAPHENEDB_PASS));

  // driver.onCompleted = metedata => {debug('Driver created');}
  // driver.onError = error => {console.log(error);}
  // this.session = this.driver.session();
}

GrapheneDB.prototype.write = function(){
  const session = this.driver.session();
  const resultPromise = session.run(
    'CREATE (w:Word {word: $word}) RETURN w', {'word': 'hello'});
  resultPromise.then(result => {

      result.records.forEach(function(record){
        debug(record);
        const node = record.get(0);
        debug(node.properties.word);
      });
      session.close(() => {
        debug('session closed');
      });

    });
}

GrapheneDB.prototype.read = function(){
  const session = this.driver.session();


}

GrapheneDB.prototype.close = function(){
  this.driver.close();
}

module.exports = new GrapheneDB();
