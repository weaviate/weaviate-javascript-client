export default class ShardUpdater {
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

  withShardName = (shardName) => {
    this.shardName = shardName;
    return this;
  };

  validateShardName = () => {
    if (
      this.shardName == undefined ||
      this.shardName == null ||
      this.shardName.length == 0
    ) {
      this.errors = [
        ...this.errors,
        "shardName must be set - set with .withShardName(shardName)",
      ];
    }
  };

  withStatus = (status) => {
    this.status = status
    return this;
  }

  validateStatus = () => {
    if (
      this.status == undefined ||
      this.status == null ||
      this.status.length == 0
    ) {
      this.errors = [
        ...this.errors,
        "status must be set - set with .withStatus(status)",
      ];
    }
  };

  validate = () => {
    this.validateClassName();
    this.validateShardName();
    this.validateStatus();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    const path = `/schema/${this.className}/shards/${this.shardName}`;
    return this.client.put(path, {status: this.status}, true);
  };
}
