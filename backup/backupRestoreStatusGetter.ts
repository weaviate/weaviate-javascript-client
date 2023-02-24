import { validateBackupId, validateBackend } from "./validation";
import Connection from "../connection";

export default class BackupRestoreStatusGetter {

  private backend?: string
  private backupId?: string;
  private errors: any[]
  private client: Connection;

  constructor(client: Connection) {
    this.client = client;
    this.errors = [] // FIXME it was not initialized
  }

  withBackend(backend: string) {
    this.backend = backend;
    return this;
  }

  withBackupId(backupId: string) {
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
    return `/backups/${this.backend}/${this.backupId}/restore`;
  }
}
