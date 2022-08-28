import { validateAll } from "./validation";

export default class BackupCreateStatusGetter {

  className;
  storageName;
  backupId;
  errors = [];

  constructor(helper) {
    this.helper = helper;
  }

  withClassName(className) {
    this.className = className;
    return this;
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
    this.errors = validateAll(this.className, this.storageName, this.backupId)
  }

  do() {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    return this.helper.statusCreate(this.className, this.storageName, this.backupId);
  }
}
