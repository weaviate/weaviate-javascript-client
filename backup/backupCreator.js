import { validateBackupId, validateExcludeClassNames, validateIncludeClassNames, validateStorageName } from "./validation";

export default class BackupCreator {

  includeClassNames;
  excludeClassNames;
  storageName;
  backupId;
  waitForCompletion;
  errors = [];

  constructor(helper) {
    this.helper = helper;
  }

  withIncludeClassNames(...classNames) {
    let cls = classNames;
    if (classNames.length && Array.isArray(classNames[0])) {
      cls = classNames[0];
    }
    this.includeClassNames = cls;
    return this;
  }

  withExcludeClassNames(...classNames) {
    let cls = classNames;
    if (classNames.length && Array.isArray(classNames[0])) {
      cls = classNames[0];
    }
    this.excludeClassNames = cls;
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
    this.errors = [
      ...validateIncludeClassNames(this.includeClassNames),
      ...validateExcludeClassNames(this.excludeClassNames),
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

    const payload = {
      id: this.backupId,
      config: {},
      include: this.includeClassNames,
      exclude: this.excludeClassNames,
    };

    if (this.waitForCompletion) {
      return this.helper.createAndWaitForCompletion(this.storageName, payload);
    }
    return this.helper.create(this.storageName, payload);
  }
}
