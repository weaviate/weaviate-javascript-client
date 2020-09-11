const ObjectsBatcher = require('./objectsBatcher');
const ReferencesBatcher = require('./referencesBatcher');
const ReferencePayloadBuilder = require('./referencePayloadBuilder');

const data = client => {
  return {
    objectsBatcher: () => new ObjectsBatcher(client),
    referencesBatcher: () => new ReferencesBatcher(client),
    referencePayloadBuilder: () => new ReferencePayloadBuilder(client),
  };
};

module.exports = data;
