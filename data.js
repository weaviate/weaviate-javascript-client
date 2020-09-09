const {
  KIND_THINGS,
  KIND_ACTIONS,
  DEFAULT_KIND,
  validateKind,
} = require('./kinds');

const data = client => {
  return {
    creator: className => new Creator(client, className),
    getter: () => new Getter(client),
    getterById: id => new GetterById(client, id),
  };
};

module.exports = data;

class Creator {
  constructor(client, className) {
    this.client = client;
    this.className = className;
    this.kind = DEFAULT_KIND;
    this.errors = [];
    this.validateClassName();
  }

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
        'className must be set - initialize with creator(className)',
      ];
    }
  };

  payload = () => ({
    schema: this.schema,
    class: this.className,
    id: this.id,
  });

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/${this.kind}`;
    return this.client.post(path, this.payload());
  };
}

class Getter {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
    this.errors = [];
  }

  withKind = kind => {
    validateKind(kind);
    this.kind = kind;
    return this;
  };

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/${this.kind}`;
    return this.client.get(path);
  };
}

class GetterById {
  constructor(client, id) {
    this.client = client;
    this.id = id;
    this.kind = DEFAULT_KIND;
    this.errors = [];
    this.validateId();
  }

  withKind = kind => {
    validateKind(kind);
    this.kind = kind;
    return this;
  };

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [
        ...this.errors,
        'id must be set - initialize with getterById(id)',
      ];
    }
  };

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/${this.kind}/${this.id}`;
    return this.client.get(path);
  };
}
