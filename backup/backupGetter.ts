import { validateBackend } from "./validation";
import Connection from "../connection";

export default class BackupGetter {

  private client: Connection
  private backend: any;
  private errors: any[];

  constructor(client: Connection) {
    this.client = client;
    this.errors = []
  }

  withBackend(backend: any) {
    this.backend = backend;
    return this;
  }

  validate() {
    this.errors = validateBackend(this.backend);
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
    return `/backups/${this.backend}`;
  }
}
