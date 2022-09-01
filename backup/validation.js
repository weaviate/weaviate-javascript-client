import { isValidStringProperty } from "../validation/string";

export function validateIncludeClassNames(classNames) {
  if (Array.isArray(classNames)) {
    let errors = [];
    classNames.forEach(className => {
      if (!isValidStringProperty(className)) {
        errors.push("string className invalid - set with .withIncludeClassNames(...classNames)")
      }
    });
    return errors;
  }
  if (classNames !== null || classNames !== undefined) {
    return ["strings classNames invalid - set with .withIncludeClassNames(...classNames)"];
  }
  return [];
}

export function validateExcludeClassNames(classNames) {
  if (Array.isArray(classNames)) {
    let errors = [];
    classNames.forEach(className => {
      if (!isValidStringProperty(className)) {
        errors.push("string className invalid - set with .withExcludeClassNames(...classNames)")
      }
    });
    return errors;
  }
  if (classNames !== null && classNames !== undefined) {
    return ["strings classNames invalid - set with .withExcludeClassNames(...classNames)"];
  }
  return [];
}

export function validateStorageName(storageName) {
  if (!isValidStringProperty(storageName)) {
    return ["string storageName must set - set with .withStorageName(storageName)"];
  }
  return [];
}

export function validateBackupId(backupId) {
  if (!isValidStringProperty(backupId)) {
    return ["string backupId must be set - set with .withBackupId(backupId)"];
  }
  return [];
}
