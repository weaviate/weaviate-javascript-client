export default class ShardsGetter {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withClassName = (className) => {
    this.className = className;
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
    // const path = `/schema/${this.className}/shards`;
    // return this.client.get(path);
    return getShards(this.client, this.className)
  };
}

export function getShards(client, className) {
  const path = `/schema/${className}/shards`;
  return client.get(path)
}
