const ClassCreator = require('./classCreator');
const ClassDeleter = require('./classDeleter');
const PropertyCreator = require('./propertyCreator');
const Getter = require('./getter');

const schema = client => {
  return {
    classCreator: () => new ClassCreator(client),
    classDeleter: () => new ClassDeleter(client),
    getter: () => new Getter(client),
    propertyCreator: () => new PropertyCreator(client),
  };
};

module.exports = schema;
