/**
 * Module dependencies.
 */
var app = require('./app');
var debug = require('debug')('ideator:server');
var http = require('http');
const datamuse = require('datamuse');
const dataUpdate = require('./data-update');

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

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


io.on('connection', function(socket) { //listen on the connection event for incoming sockets
  console.log('Client Connection: %s', socket.id);

  socket.on('request', function(submitted, currentGraph){
    datamuse.request('words?ml=' + submitted.word + '&max=' + submitted.numSuggestion)
    .then((json) => { //json is an array of objects
      debug('Response from datamuse' + JSON.stringify(json, null,3));
      debug('Current graph to be updated' + JSON.stringify(currentGraph, null, 3));
      var newGraph = dataUpdate.update(currentGraph, submitted, json);
      debug('Updated graph before emiting: '+ JSON.stringify(newGraph, null, 3));
      // should update database
      socket.emit('response', json, newGraph);
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
