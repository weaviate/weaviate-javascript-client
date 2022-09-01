import { validateStorageName } from "./validation";

export default class BackupGetter {

  storageName;
  errors = [];

  constructor(client) {
    this.client = client;
  }

  withStorageName(storageName) {
    this.storageName = storageName;
    return this;
  }

  validate() {
    this.errors = validateStorageName(this.storageName);
  }

  do() {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.client.get(this._path(this.storageName));
  }

  _path(storageName) {
    return `/backups/${storageName}`;
  }
}
