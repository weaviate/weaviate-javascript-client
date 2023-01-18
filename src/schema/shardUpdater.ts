import { isValidStringProperty } from "../validation/string";

export default class ShardUpdater {
  className: any;
  client: any;
  errors: any;
  shardName: any;
  status: any;
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

  withShardName = (shardName: any) => {
    this.shardName = shardName;
    return this;
  };

  validateShardName = () => {
    if (!isValidStringProperty(this.shardName)) {
      this.errors = [
        ...this.errors,
        "shardName must be set - set with .withShardName(shardName)",
      ];
    }
  };

  withStatus = (status: any) => {
    this.status = status
    return this;
  }

  validateStatus = () => {
    if (!isValidStringProperty(this.status)) {
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
        new Error(`invalid usage: ${this.errors.join(", ")}`)
      );
    }

    return updateShard(this.client, this.className, this.shardName, this.status)
  };
}

export function updateShard(client: any, className: any, shardName: any, status: any) {
  const path = `/schema/${className}/shards/${shardName}`;
  return client.put(path, {status: status}, true)
}
