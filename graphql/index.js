const Aggregator = require('./aggregator');
const Getter = require('./getter');

const graphql = client => {
  return {
    get: () => new Getter(client),
    aggregate: () => new Aggregator(client),
  };
};

module.exports = graphql;
