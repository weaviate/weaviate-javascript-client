import { isValidStringProperty } from "../validation/string";

export default class GetterById {
  constructor(client) {
    this.client = client;
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

  buildPath = () => {
    let path = `/objects`;
    if (isValidStringProperty(this.className)) {
      path = `${path}/${this.className}`
    }
    return `/${path}/${this.id}`;
  }

  extendAdditionals = (prop) => {
    this.additionals = [...this.additionals, prop];
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

    let path = this.buildPath();
  
    if (this.additionals.length > 0) {
      path += `?include=${this.additionals.join(",")}`;
    }
    return this.client.get(path);
  };
}
