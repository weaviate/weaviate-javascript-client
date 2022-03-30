import { getShards } from "./shardsGetter";
import { updateShard } from "./shardUpdater";

export default class ShardsUpdater {
  constructor(client) {
    this.client = client;
    this.errors = [];
    this.shards = [];
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
    this.validateStatus();
  };

  updateShards = async () => {
    var payload = []
    for (let i = 0; i < this.shards.length; i++) {
      await updateShard(this.client, this.className, this.shards[i].name, this.status)
        .then(res => {
          payload.push({name: this.shards[i].name, status: res.status})
        })
        .catch(err => this.errors = [...this.errors, err]);
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
      .then(shards => this.shards = shards)
      .then(this.updateShards)
      .then(payload => {return payload})
      .catch(err => {
        return Promise.reject(err);
      });
  };
}
