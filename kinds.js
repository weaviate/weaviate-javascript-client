const validateKind = kind => {
  if (kind != KIND_THINGS && kind != KIND_ACTIONS) {
    throw new Error('invalid kind: ' + kind);
  }
};

const KIND_THINGS = 'things';
const KIND_ACTIONS = 'actions';
const DEFAULT_KIND = KIND_THINGS;

module.exports = {
  KIND_THINGS,
  KIND_ACTIONS,
  DEFAULT_KIND,
  validateKind: validateKind,
};
