export default class GetterById {
  constructor(client, objectsPath) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
    this.additionals = [];
  }

  withId = (id) => {
    this.id = id;
    return this;
  };

  withClassName = (className) => {
    this.className = className;
    return this;
  };

  extendAdditionals = (prop) => {
    this.additionals = [...this.additionals, prop];
    return this;
  };

  withAdditional = (additionalFlag) => this.extendAdditionals(additionalFlag);

  withVector = () => this.extendAdditionals("vector");

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [
        ...this.errors,
        "id must be set - initialize with getterById(id)",
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
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.objectsPath.buildGetOne(this.id, this.className, this.additionals)
      .then(this.client.get);
  };
}
