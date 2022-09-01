import { RestoreStatus } from ".";

const WAIT_INTERVAL = 1000;

export default class BackupRestoreHelper {

  constructor(client) {
    this.client = client;
  }

  restore(storageName, payload) {
    return this.client.post(this._path(storageName, payload.id), payload);
  }

  statusRestore(storageName, backupId) {
    return this.client.get(this._path(storageName, backupId));
  }

  restoreAndWaitForCompletion(storageName, payload) {
    return new Promise((resolve, reject) => {
      const loop = () => {
        this.statusRestore(storageName, payload.id)
          .then(metaStatusRestore => {
            if (metaStatusRestore.status == RestoreStatus.SUCCESS || metaStatusRestore.status == RestoreStatus.FAILED) {
              resolve(metaStatusRestore);
            } else {
              setTimeout(loop, WAIT_INTERVAL);
            }
          })
          .catch(reject);
      };

      this.restore(storageName, payload)
        .then(loop)
        .catch(reject)
    });
  }

  _path(storageName, backupId) {
    return `/backups/${storageName}/${backupId}/restore`;
  }
}

