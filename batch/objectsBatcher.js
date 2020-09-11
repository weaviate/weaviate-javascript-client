const {DEFAULT_KIND, validateKind} = require('../kinds');

class ObjectsBatcher {
  constructor(client) {
    this.client = client;
    this.objects = [];
    this.errors = [];
    this.kind = DEFAULT_KIND;
  }

  withObject = obj => {
    this.objects = [...this.objects, obj];
    return this;
  };

  payload = () => ({
    [this.kind]: this.objects,
  });

  withKind = kind => {
    this.kind = kind;
    return this;
  };

  validateObjectCount = () => {
    if (this.objects.length == 0) {
      this.errors = [
        ...this.errors,
        'need at least one object to send a request, ' +
          'add one with .withObject(obj)',
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
    this.validateObjectCount();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/batching/${this.kind}`;
    return this.client.post(path, this.payload());
  };
}

module.exports = ObjectsBatcher;
