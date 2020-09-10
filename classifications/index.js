const Scheduler = require('./scheduler');
const Getter = require('./getter');

const data = client => {
  return {
    scheduler: () => new Scheduler(client),
    getter: () => new Getter(client),
  };
};

module.exports = data;
