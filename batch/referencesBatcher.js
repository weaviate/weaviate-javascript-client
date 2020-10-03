import {DEFAULT_KIND, validateKind} from '../kinds';

export default class ReferencesBatcher {
  constructor(client) {
    this.client = client;
    this.references = [];
    this.errors = [];
    this.kind = DEFAULT_KIND;
  }

  withReference = obj => {
    this.references = [...this.references, obj];
    return this;
  };

  payload = () => this.references;

  validateReferenceCount = () => {
    if (this.references.length == 0) {
      this.errors = [
        ...this.errors,
        'need at least one reference to send a request, ' +
          'add one with .withReference(obj)',
      ];
    }
  };

  validate = () => {
    this.validateReferenceCount();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/batching/references`;
    return this.client.post(path, this.payload());
  };
}
