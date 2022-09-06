import { validateBackupId, validateStorageName } from "./validation";

export default class BackupCreateStatusGetter {

  storageName;
  backupId;
  errors = [];

  constructor(client) {
    this.client = client;
  }

  withStorageName(storageName) {
    this.storageName = storageName;
    return this;
  }

  withBackupId(backupId) {
    this.backupId = backupId;
    return this;
  }

  validate() {
    this.errors = [
      ...validateStorageName(this.storageName),
      ...validateBackupId(this.backupId),
    ];
  }

  do() {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    return this.client.get(this._path());
  }

  _path() {
    return `/backups/${this.storageName}/${this.backupId}`;
  }
}
