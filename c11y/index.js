const ExtensionCreator = require('./extensionCreator');
const ConceptsGetter = require('./conceptsGetter');

const data = client => {
  return {
    conceptsGetter: () => new ConceptsGetter(client),
    extensionCreator: () => new ExtensionCreator(client),
  };
};

module.exports = data;
