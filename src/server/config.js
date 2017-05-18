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

module.exports = {
  PORT: normalizePort(process.env.PORT || '3000'),
  GRAPHENEDB_URL: process.env.GRAPHENEDB_BOLT_URL || 'bolt://localhost',
  GRAPHENEDB_USER: process.env.GRAPHENEDB_BOLT_USER || 'neo4j',
  GRAPHENEDB_PASS: process.env.GRAPHENEDB_BOLT_PASSWORD || 'test',
};
