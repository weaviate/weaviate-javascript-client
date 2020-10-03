const ExtensionCreator = require('./extensionCreator');
const ConceptsGetter = require('./conceptsGetter');

const c11y = client => {
  return {
    conceptsGetter: () => new ConceptsGetter(client),
    extensionCreator: () => new ExtensionCreator(client),
  };
};

export default c11y
