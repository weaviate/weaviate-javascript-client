import { isValidStringProperty } from "../validation/string";
import { getShards } from "./shardsGetter";
import { updateShard } from "./shardUpdater";
import Connection from "../connection";

export default class ShardsUpdater {
  private client: Connection;
  private errors: any[];
  private shards: any[];
  private status: any;
  private className: any;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
    this.shards = [];
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
    this.validateStatus();
  };

  updateShards = async () => {
    let payload: any = [];
    for (let i = 0; i < this.shards.length; i++) {
      await updateShard(this.client, this.className, this.shards[i].name, this.status)
        .then((res: any) => {
          payload.push({name: this.shards[i].name, status: res.status})
        })
        .catch((err: any) => this.errors = [...this.errors, err]);
    }

    if (this.errors.length > 0) {
      return Promise.reject(
        new Error(`failed to update shards: ${this.errors.join(", ")}`)
      );
    }

    return Promise.resolve(payload);
  }

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error(`invalid usage: ${this.errors.join(", ")}`)
      );
    }

    return getShards(this.client, this.className)
      .then((shards: any) => this.shards = shards)
      .then(this.updateShards)
      .then((payload: any) => {return payload})
      .catch((err: any) => {
        return Promise.reject(err);
      });
  };
}
