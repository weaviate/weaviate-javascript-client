const {DEFAULT_KIND, validateKind} = require('../kinds');

class ReferencesBatcher {
  constructor(client) {
    this.client = client;
    this.errors = [];
    this.fromKind = DEFAULT_KIND;
    this.toKind = DEFAULT_KIND;
  }

  withFromKind = kind => {
    this.fromKind = kind;
    return this;
  };

  withToKind = kind => {
    this.toKind = kind;
    return this;
  };

  withFromId = id => {
    this.fromId = id;
    return this;
  };

  withToId = id => {
    this.toId = id;
    return this;
  };

  withFromClassName = className => {
    this.fromClassName = className;
    return this;
  };

  withFromRefProp = refProp => {
    this.fromRefProp = refProp;
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

  validateKinds = () => {
    try {
      validateKind(this.fromKind);
    } catch (e) {
      this.errors = [
        ...this.errors,
        newError('invalid fromKind: ' + e.toString()),
      ];
    }

    try {
      validateKind(this.toKind);
    } catch (e) {
      this.errors = [
        ...this.errors,
        new Error('invalid toKind: ' + e.toString()),
      ];
    }
  };

  validate = () => {
    this.validateKinds();
    this.validateIsSet(this.fromId, 'fromId', '.withFromId(id)');
    this.validateIsSet(this.toId, 'toId', '.withToId(id)');
    this.validateIsSet(
      this.fromClassName,
      'fromClassName',
      '.withFromClassName(className)',
    );
    this.validateIsSet(
      this.fromRefProp,
      'fromRefProp',
      '.withFromRefProp(refProp)',
    );
  };

  payload = () => {
    this.validate();
    if (this.errors.length > 0) {
      throw new Error(this.errors.join(', '));
    }

    return {
      from:
        `weaviate://localhost/${this.fromKind}/${this.fromClassName}` +
        `/${this.fromId}/${this.fromRefProp}`,
      to: `weaviate://localhost/${this.toKind}/${this.toId}`,
    };
  };
}

module.exports = ReferencesBatcher;
