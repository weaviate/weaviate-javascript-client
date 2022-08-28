import { CreateStatus } from ".";

const WAIT_INTERVAL = 1000;

export default class BackupCreateHelper {

  constructor(client) {
    this.client = client;
  }

  create(className, storageName, backupId) {
    return this._create(this._path(className, storageName, backupId));
  }

  _create(path) {
    return this.client.post(path)
  }

  statusCreate(className, storageName, backupId) {
    return this._statusCreate(this._path(className, storageName, backupId));
  }

  _statusCreate(path) {
    return this.client.get(path)
  }

  createAndWaitForCompletion(className, storageName, backupId) {
    const path = this._path(className, storageName, backupId);

    return new Promise((resolve, reject) => {
      const loop = () => {
        this._statusCreate(path)
          .then(metaStatusCreate => {
            if (metaStatusCreate.status == CreateStatus.SUCCESS || metaStatusCreate.status == CreateStatus.FAILED) {
              resolve(metaStatusCreate);
            } else {
              setTimeout(loop, WAIT_INTERVAL);
            }
          })
          .catch(reject);
      };

      this._create(path)
        .then(loop)
        .catch(reject)
    });
  }

  _path(className, storageName, backupId) {
    // TODO change snapshots to backups
    return `/schema/${className}/snapshots/${storageName}/${backupId}`;
  }
}
