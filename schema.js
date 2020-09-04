const {
  KIND_THINGS,
  KIND_ACTIONS,
  DEFAULT_KIND,
  validateKind,
} = require('./kinds');

const schema = client => {
  return {
    createClass: makeCreateClass(client),
    deleteClass: makeDeleteClass(client),
    get: makeGet(client),
  };
};

module.exports = schema;

const makeCreateClass = client => (classObj, kind = DEFAULT_KIND) => {
  try {
    validateKind(kind);
  } catch (e) {
    return Promise.reject(e);
  }

  const path = `/schema/${kind}/`;
  return client.post(path, classObj);
};

const makeDeleteClass = client => (className, kind = DEFAULT_KIND) => {
  try {
    validateKind(kind);
  } catch (e) {
    return Promise.reject(e);
  }

  const path = `/schema/${kind}/${className}`;
  return client.delete(path);
};

const makeGet = client => className => {
  const path = `/schema`;
  return client.get(path);
};
