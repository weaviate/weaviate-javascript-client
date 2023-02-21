import Connection from '../connection'
import { validateBackupId, validateBackend } from "./validation";

export default class BackupCreateStatusGetter {

  private backend: any;
  private backupId: any;
  private errors: any[];
  private client: Connection;

  constructor(client: Connection) {
    this.client = client;
    this.errors = []
  }

  withBackend(backend: any) {
    this.backend = backend;
    return this;
  }

  withBackupId(backupId: any) {
    this.backupId = backupId;
    return this;
  }

  validate() {
    this.errors = [
      ...validateBackend(this.backend),
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
    return this.client.get(this._path());
  }

  _path() {
    return `/backups/${this.backend}/${this.backupId}`;
  }
}
