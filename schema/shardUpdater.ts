import {isValidStringProperty} from "../validation/string";
import Connection from "../connection";

export default class ShardUpdater {
  private client: Connection;
  private errors: any[];
  private className: any;
  private shardName: any;
  private status: any;
  constructor(client: Connection) {
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

export function updateShard(client: Connection, className: any, shardName: any, status: any) {
  const path = `/schema/${className}/shards/${shardName}`;
  return client.put(path, {status: status}, true)
}
