const {DEFAULT_KIND} = require('../kinds');

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

  validate = () => {
    this.validateObjectCount();
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
