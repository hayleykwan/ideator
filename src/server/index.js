var app = require('./app');
var debug = require('debug')('ideator:server');
var http = require('http');

var dataLoader = require('./data-loader');
var dataUpdate = require('./graph-update');
var config = require('./config');
var utils = require('./utils');

var datamuse = require('datamuse');

/**
 * Get port from environment and store in Express.
 */
var port = config.PORT;
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);
debug('Server created.');
var io = require('socket.io')(server);
debug('socket.io set up with server');

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
    var currentGraph = utils.removeD3Extras(JSON.parse(currentGraphJSON));

    //call data-loader
    var result = dataLoader.search(submitted);
    debug('from dataloader' + result);

    datamuse.words({
      ml: submitted.word,
      max: submitted.numSuggestion
    })
    .then((json) => {
      var newGraph = dataUpdate.update(currentGraph, submitted, json);
      debug('Updated graph before emiting: '+ JSON.stringify(newGraph, null, 3));
      var newGraphJSON = JSON.stringify(newGraph);
      socket.emit('response', newGraphJSON);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: %s', socket.id);
  });
})

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
