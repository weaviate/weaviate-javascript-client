import { validateAll } from "./validation";

export default class BackupRestorer {

  className;
  storageName;
  backupId;
  waitForCompletion;
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

  withWaitForCompletion(waitForCompletion) {
    this.waitForCompletion = waitForCompletion;
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
    if (this.waitForCompletion) {
      return this.helper.restoreAndWaitForCompletion(this.className, this.storageName, this.backupId);
    }
    return this.helper.restore(this.className, this.storageName, this.backupId);
  }
}
