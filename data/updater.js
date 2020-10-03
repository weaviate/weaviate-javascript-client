import {DEFAULT_KIND, validateKind} from '../kinds';

export default class Updater {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
    this.errors = [];
  }

  withSchema = schema => {
    this.schema = schema;
    return this;
  };

  withId = id => {
    this.id = id;
    return this;
  };

  withClassName = className => {
    this.className = className;
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
        'className must be set - set with withId(id)',
      ];
    }
  };

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [
        ...this.errors,
        'id must be set - initialize with updater(id)',
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
    this.validateId();
  };

  do = () => {
    this.validate();

    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/${this.kind}/${this.id}`;
    return this.client.put(path, this.payload());
  };
}
