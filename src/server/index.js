/**
 * Module dependencies.
 */
var app = require('./app');
var debug = require('debug')('ideator:server');
var http = require('http');

const neo4j = require('neo4j-driver').v1;
const datamuse = require('datamuse');
const dataUpdate = require('./graph-update');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);
debug('Server created.');
var io = require('socket.io')(server);
debug('socket.io set up with server');

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

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Listen to socket
 */
io.on('connection', function(socket) { //listen on the connection event for incoming sockets
  console.log('Client Connection: %s', socket.id);

  socket.on('request', function(submitted, currentGraphJSON){
    //check database if word is cached
    //if not send request(s) to datamuse, and store in database

    datamuse.words({
      ml: submitted.word,
      max: submitted.numSuggestion
    })
    .then((json) => { //json is an array of objects
      // debug(json)
      var currentGraph = JSON.parse(currentGraphJSON);
      var newGraph = dataUpdate.update(currentGraph, submitted, json);
      debug('Updated graph before emiting: '+ JSON.stringify(newGraph, null, 3));
      var newGraphJSON = JSON.stringify(newGraph);
      // should update database
      socket.emit('response', json, newGraphJSON, currentGraphJSON);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: %s', socket.id);
  });
})

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;// named pipe
  }
  if (port >= 0) {
    return port;// port number
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  debug('Error occurred');
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  debug('Event listener listening');
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
