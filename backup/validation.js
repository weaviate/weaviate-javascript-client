import { isValidStringProperty } from "../validation/string";

export function validateClassName(className) {
  if (!isValidStringProperty(className)) {
    return ["string className must be set - set with .withClassName(className)"];
  }
  return [];
}

export function validateStorageName(storageName) {
  if (!isValidStringProperty(storageName)) {
    return ["string storageName must be set - set with .withStorageName(storageName)"];
  }
  return [];
}

export function validateBackupId(backupId) {
  if (!isValidStringProperty(backupId)) {
    return ["string backupId must be set - set with .withBackupId(backupId)"];
  }
  return [];
}

export function validateAll(className, storageName, backupId) {
  return [
    ...validateClassName(className),
    ...validateStorageName(storageName),
    ...validateBackupId(backupId),
  ];
}
