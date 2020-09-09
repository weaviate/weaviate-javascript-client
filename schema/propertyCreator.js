const {DEFAULT_KIND, validateKind} = require('../kinds');

class ClassCreator {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
    this.errors = [];
  }

  withClassName = className => {
    this.className = className;
    return this;
  };

  withProperty = property => {
    this.property = property;
    return this;
  };

  withKind = kind => {
    this.kind = kind;
    return this;
  };

  validateClassName = () => {
    if (
      this.className == undefined ||
      this.className == null ||
      this.className.length == 0
    ) {
      this.errors = [
        ...this.errors,
        'className must be set - set with .withClassName(className)',
      ];
    }
  };

  validateProperty = () => {
    if (
      this.property == undefined ||
      this.property == null ||
      this.property.length == 0
    ) {
      this.errors = [
        ...this.errors,
        'property must be set - set with .withProperty(property)',
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
    this.validateClassName();
    this.validateProperty();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/schema/${this.kind}/${this.className}/properties`;
    return this.client.post(path, this.property);
  };
}

module.exports = ClassCreator;
