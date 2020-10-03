import {DEFAULT_KIND, validateKind} from '../kinds';

export default class Deleter {
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
    validateKind(kind);
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

  validateId = () => {
    this.validateIsSet(this.id, 'id', '.withId(id)');
  };

  validateKind = () => {
    try {
      validateKind(this.kind);
    } catch (e) {
      this.errors = [...this.errors, e.toString()];
    }
  };

  validate = () => {
    this.validateId();
    this.validateKind();
  };

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    this.validate();

    const path = `/${this.kind}/${this.id}`;
    return this.client.delete(path);
  };
}
