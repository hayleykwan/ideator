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
  GETTY_IMAGES_API_KEY: 'zgwqskjdkgrs7w3sjz2vfe45',
  COSMOSDB_ENDPOINT: "ideator-db.graphs.azure.com",
  COSMOSDB_PRIMARY_KEY: "ZRaqzZn4D6fwtyY7bZOCdOdiyXcKgbyF5rL7duXbiTROCZekiHzHAKW4djiS9ik5oUZl3MwEuVi2tIKeK3Ar2A==",
  COSMOSDB_DATABASE: "ideator-db",
  COSMOSDB_COLLECTION: "words",
};
