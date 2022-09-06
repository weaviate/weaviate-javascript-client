import BackupCreator from "./backupCreator";
import BackupCreateStatusGetter from "./backupCreateStatusGetter";
import BackupRestorer from "./backupRestorer";
import BackupRestoreStatusGetter from "./backupRestoreStatusGetter";
// import BackupGetter from "./backupGetter";

export const Backend = {
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
    creator: () => new BackupCreator(client, new BackupCreateStatusGetter(client)),
    createStatusGetter: () => new BackupCreateStatusGetter(client),
    restorer: () => new BackupRestorer(client, new BackupRestoreStatusGetter(client)),
    restoreStatusGetter: () => new BackupRestoreStatusGetter(client),
    // getter: () => new BackupGetter(client),
  };
};

export default backup;
