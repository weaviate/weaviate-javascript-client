import { CreateStatus } from ".";

const WAIT_INTERVAL = 1000;

export default class BackupCreateHelper {

  constructor(client) {
    this.client = client;
  }

  create(storageName, payload) {
    return this.client.post(this._path(storageName), payload);
  }

  statusCreate(storageName, backupId) {
    return this.client.get(this._path(storageName, backupId));
  }

  createAndWaitForCompletion(storageName, payload) {
    return new Promise((resolve, reject) => {
      const loop = () => {
        this.statusCreate(storageName, payload.id)
          .then(metaStatusCreate => {
            if (metaStatusCreate.status == CreateStatus.SUCCESS || metaStatusCreate.status == CreateStatus.FAILED) {
              resolve(metaStatusCreate);
            } else {
              setTimeout(loop, WAIT_INTERVAL);
            }
          })
          .catch(reject);
      };

      this.create(storageName, payload)
        .then(loop)
        .catch(reject)
    });
  }

  _path(storageName, backupId) {
    if (backupId) {
      return `/backups/${storageName}/${backupId}`;
    }
    return `/backups/${storageName}`;
  }
}
