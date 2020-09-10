class Getter {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withId = id => {
    this.id = id;
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

  validate = () => {
    this.validateId();
  };

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    this.validate();

    const path = `/classifications/${this.id}`;
    return this.client.get(path);
  };
}

module.exports = Getter;
