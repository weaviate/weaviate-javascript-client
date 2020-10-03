const Creator = require('./creator');
const Validator = require('./validator');
const Updater = require('./updater');
const Merger = require('./merger');
const Getter = require('./getter');
const GetterById = require('./getterById');
const Deleter = require('./deleter');
const ReferenceCreator = require('./referenceCreator');
const ReferenceReplacer = require('./referenceReplacer');
const ReferenceDeleter = require('./referenceDeleter');
const ReferencePayloadBuilder = require('./referencePayloadBuilder');

const data = client => {
  return {
    creator: () => new Creator(client),
    validator: () => new Validator(client),
    updater: () => new Updater(client),
    merger: () => new Merger(client),
    getter: () => new Getter(client),
    getterById: () => new GetterById(client),
    deleter: () => new Deleter(client),
    referenceCreator: () => new ReferenceCreator(client),
    referenceReplacer: () => new ReferenceReplacer(client),
    referenceDeleter: () => new ReferenceDeleter(client),
    referencePayloadBuilder: () => new ReferencePayloadBuilder(client),
  };
};

export default data
