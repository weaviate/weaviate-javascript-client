const {DEFAULT_KIND, validateKind} = require('../kinds');

class Validator {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
    this.errors = [];
  }

  withClassName = className => {
    this.className = className;
    return this;
  };

  withSchema = schema => {
    this.schema = schema;
    return this;
  };

  withId = id => {
    this.id = id;
    return this;
  };

  withKind = kind => {
    validateKind(kind);
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

  payload = () => ({
    schema: this.schema,
    class: this.className,
    id: this.id,
  });

  validate = () => {
    this.validateClassName();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/${this.kind}/validate`;
    return this.client.post(path, this.payload(), false).then(() => true);
  };
}

module.exports = Validator;
