const Creator = require('./creator');
const Updater = require('./updater');
const Merger = require('./merger');
const Getter = require('./getter');
const GetterById = require('./getterById');

const data = client => {
  return {
    creator: () => new Creator(client),
    updater: () => new Updater(client),
    merger: () => new Merger(client),
    getter: () => new Getter(client),
    getterById: () => new GetterById(client),
  };
};

module.exports = data;
