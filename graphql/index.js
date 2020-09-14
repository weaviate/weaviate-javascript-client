const Aggregator = require('./aggregator');
const Getter = require('./getter');
const Explorer = require('./explorer');

const graphql = client => {
  return {
    get: () => new Getter(client),
    aggregate: () => new Aggregator(client),
    explore: () => new Explorer(client),
  };
};

module.exports = graphql;
