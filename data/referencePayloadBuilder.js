const {DEFAULT_KIND, validateKind} = require('../kinds');

class ReferencePayloadBuilder {
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
  };

  payload = () => {
    this.validate();
    if (this.errors.length > 0) {
      throw new Error(this.errors.join(', '));
    }

    return {
      beacon: `weaviate://localhost/${this.kind}/${this.id}`,
    };
  };
}

module.exports = ReferencePayloadBuilder;
