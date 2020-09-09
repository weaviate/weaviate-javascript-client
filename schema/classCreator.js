const {DEFAULT_KIND, validateKind} = require('../kinds');

class ClassCreator {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
    this.errors = [];
  }

  withClass = classObj => {
    this.class = classObj;
    return this;
  };

  withKind = kind => {
    this.kind = kind;
    return this;
  };

  validateClass = () => {
    if (this.class == undefined || this.class == null) {
      this.errors = [
        ...this.errors,
        'class object must be set - set with .withClass(class)',
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
    this.validateClass();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/schema/${this.kind}`;
    return this.client.post(path, this.class);
  };
}

module.exports = ClassCreator;
