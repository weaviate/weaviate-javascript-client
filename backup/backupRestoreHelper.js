import { RestoreStatus } from ".";

const WAIT_INTERVAL = 1000;

export default class BackupRestoreHelper {

  constructor(client) {
    this.client = client;
  }

  restore(className, storageName, backupId) {
    return this._restore(this._path(className, storageName, backupId));
  }

  _restore(path) {
    return this.client.post(path)
  }

  statusRestore(className, storageName, backupId) {
    return this._statusRestore(this._path(className, storageName, backupId));
  }

  _statusRestore(path) {
    return this.client.get(path)
  }

  restoreAndWaitForCompletion(className, storageName, backupId) {
    const path = this._path(className, storageName, backupId);

    return new Promise((resolve, reject) => {
      const loop = () => {
        this._statusRestore(path)
          .then(metaStatusRestore => {
            if (metaStatusRestore.status == RestoreStatus.SUCCESS || metaStatusRestore.status == RestoreStatus.FAILED) {
              resolve(metaStatusRestore);
            } else {
              setTimeout(loop, WAIT_INTERVAL);
            }
          })
          .catch(reject);
      };

      this._restore(path)
        .then(loop)
        .catch(reject)
    });
  }

  _path(className, storageName, backupId) {
    // TODO change snapshots to backups
    return `/schema/${className}/snapshots/${storageName}/${backupId}/restore`;
  }
}

