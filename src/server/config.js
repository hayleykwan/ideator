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
  NEO4J_URL: process.env.GRAPHENEDB_BOLT_URL || 'bolt://localhost',
  NEO4J_USER: process.env.GRAPHENEDB_BOLT_USER || 'neo4j',
  NEO4J_PASS: process.env.GRAPHENEDB_BOLT_PASSWORD || 'test',
};
