const Getter = require('./getter');

const get = client => {
  return {
    things: function (className, queryString) {
      return new Getter('Things', className, queryString).withClient(client);
    },
  };
};

module.exports = {get};
