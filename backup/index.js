import BackupCreator from "./backupCreator";
import BackupCreateStatusGetter from "./backupCreateStatusGetter";
import BackupRestorer from "./backupRestorer";
import BackupRestoreStatusGetter from "./backupRestoreStatusGetter";
import BackupCreateHelper from "./backupCreateHelper";
import BackupRestoreHelper from "./backupRestoreHelper";

export const Storage = {
  FILESYSTEM: "filesystem",
  S3: "s3",
  GCS: "gcs",
};

export const CreateStatus = {
  STARTED: "STARTED",
  TRANSFERRING: "TRANSFERRING",
  TRANSFERRED: "TRANSFERRED",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
}

export const RestoreStatus = {
  STARTED: "STARTED",
  TRANSFERRING: "TRANSFERRING",
  TRANSFERRED: "TRANSFERRED",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
}

const backup = client => {
  return {
    creator: () => new BackupCreator(new BackupCreateHelper(client)),
    createStatusGetter: () => new BackupCreateStatusGetter(new BackupCreateHelper(client)),
    restorer: () => new BackupRestorer(new BackupRestoreHelper(client)),
    restoreStatusGetter: () => new BackupRestoreStatusGetter(new BackupRestoreHelper(client)),
  };
};

export default backup;
