import { isValidStringProperty } from "../validation/string";

export default class ShardsGetter {
  className: any;
  client: any;
  errors: any;
  constructor(client: any) {
    this.client = client;
    this.errors = [];
  }

  withClassName = (className: any) => {
    this.className = className;
    return this;
  };

  validateClassName = () => {
    if (!isValidStringProperty(this.className)) {
      this.errors = [
        ...this.errors,
        "className must be set - set with .withClassName(className)",
      ];
    }
  };

  validate = () => {
    this.validateClassName();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error(`invalid usage: ${this.errors.join(", ")}`)
      );
    }

    return getShards(this.client, this.className)
  };
}

export function getShards(client: any, className: any) {
  const path = `/schema/${className}/shards`;
  return client.get(path)
}
