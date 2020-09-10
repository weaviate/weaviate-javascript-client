const ObjectsBatcher = require('./objectsBatcher');

const data = client => {
  return {
    objectsBatcher: () => new ObjectsBatcher(client),
  };
};

module.exports = data;
