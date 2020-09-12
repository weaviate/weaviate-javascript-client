const {DEFAULT_KIND, validateKind} = require('../kinds');

class ReferenceDeleter {
  constructor(client) {
    this.client = client;
    this.errors = [];
    this.kind = DEFAULT_KIND;
  }

  withId = id => {
    this.id = id;
    return this;
  };

  withKind = kind => {
    this.kind = kind;
    return this;
  };

  withReference = ref => {
    this.reference = ref;
    return this;
  };

  withReferenceProperty = refProp => {
    this.refProp = refProp;
    return this;
  };

  validateIsSet = (prop, name, setter) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validateKind = () => {
    try {
      validateKind(this.kind);
    } catch (e) {
      this.errors = [...this.errors, e.toString()];
    }
  };

  validate = () => {
    this.validateKind();
    this.validateIsSet(this.id, 'id', '.withId(id)');
    this.validateIsSet(this.reference, 'reference', '.withReference(ref)');
    this.validateIsSet(
      this.refProp,
      'referenceProperty',
      '.withReferenceProperty(refProp)',
    );
  };

  payload = () => this.reference;

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/${this.kind}/${this.id}/references/${this.refProp}`;
    return this.client.delete(path, this.payload(), false);
  };
}

module.exports = ReferenceDeleter;
