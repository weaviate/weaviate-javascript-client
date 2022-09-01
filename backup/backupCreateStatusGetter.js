import { validateBackupId, validateStorageName } from "./validation";

export default class BackupCreateStatusGetter {

  storageName;
  backupId;
  errors = [];

  constructor(helper) {
    this.helper = helper;
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
    return this.helper.statusCreate(this.storageName, this.backupId);
  }
}
