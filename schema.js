const schema = client => {
  return {
    createClass: makeCreateClass(client),
  };
};

module.exports = schema;

const makeCreateClass = client => (classObj, kind = '') => {
  return undefined;
};
