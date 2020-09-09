const {
  KIND_THINGS,
  KIND_ACTIONS,
  DEFAULT_KIND,
  validateKind,
} = require('./kinds');

const data = client => {
  return {
    creator: () => new Creator(client),
    updater: () => new Updater(client),
    merger: () => new Merger(client),
    getter: () => new Getter(client),
    getterById: () => new GetterById(client),
  };
};

module.exports = data;

class Creator {
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
        'className must be set - initialize with creator(className)',
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
    const path = `/${this.kind}`;
    return this.client.post(path, this.payload());
  };
}

class Updater {
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

class Merger {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
    this.errors = [];
  }

  withSchema = schema => {
    this.schema = schema;
    return this;
  };

  withClassName = className => {
    this.className = className;
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
        'className must be set - set with withClassName(className)',
      ];
    }
  };

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [...this.errors, 'id must be set - set with withId(id)'];
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
    return this.client.patch(path, this.payload());
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

  withId = id => {
    this.id = id;
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

  validate = () => {
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
    return this.client.get(path);
  };
}
