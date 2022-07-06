export default class Getter {
  constructor(client, objectsPath) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
    this.additionals = [];
  }

  withLimit = (limit) => {
    this.limit = limit;
    return this;
  };

  extendAdditionals = (prop) => {
    this.additionals = [...this.additionals, prop];
    return this;
  };

  withAdditional = (additionalFlag) => this.extendAdditionals(additionalFlag);

  withVector = () => this.extendAdditionals("vector");

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.objectsPath.buildGet(this.limit, this.additionals)
      .then(this.client.get);
  };
}
