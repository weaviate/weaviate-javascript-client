export default class Getter {
  additionals: any;
  className: any;
  client: any;
  errors: any;
  limit: any;
  objectsPath: any;
  constructor(client: any, objectsPath: any) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
    this.additionals = [];
  }

  withClassName = (className: any) => {
    this.className = className;
    return this;
  };

  withLimit = (limit: any) => {
    this.limit = limit;
    return this;
  };

  extendAdditionals = (prop: any) => {
    this.additionals = [...this.additionals, prop];
    return this;
  };

  withAdditional = (additionalFlag: any) => this.extendAdditionals(additionalFlag);

  withVector = () => this.extendAdditionals("vector");

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.objectsPath.buildGet(this.className, this.limit, this.additionals)
      .then(this.client.get);
  };
}
