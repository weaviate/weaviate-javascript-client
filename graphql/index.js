const Getter = require('./getter');

const graphql = client => {
  return {
    get: () => new Getter(client),
  };
};

module.exports = graphql;
