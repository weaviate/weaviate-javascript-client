import { RestoreStatus } from "./consts";
import { validateBackupId, validateExcludeClassNames, validateIncludeClassNames, validateBackend } from "./validation";

const WAIT_INTERVAL = 1000;

export default class BackupRestorer {
  client: any;
  statusGetter: any;

  includeClassNames: any;
  excludeClassNames: any;
  backend: any;
  backupId: any;
  waitForCompletion: any;
  errors: any;

  constructor(client: any, statusGetter: any) {
    this.client = client;
    this.statusGetter = statusGetter;
  }

  withIncludeClassNames(...classNames: any[]) {
    let cls = classNames;
    if (classNames.length && Array.isArray(classNames[0])) {
      cls = classNames[0];
    }
    this.includeClassNames = cls;
    return this;
  }

  withExcludeClassNames(...classNames: any[]) {
    let cls = classNames;
    if (classNames.length && Array.isArray(classNames[0])) {
      cls = classNames[0];
    }
    this.excludeClassNames = cls;
    return this;
  }

  withBackend(backend: any) {
    this.backend = backend;
    return this;
  }

  withBackupId(backupId: any) {
    this.backupId = backupId;
    return this;
  }

  withWaitForCompletion(waitForCompletion: any) {
    this.waitForCompletion = waitForCompletion;
    return this;
  }

  validate() {
    this.errors = [
      ...validateIncludeClassNames(this.includeClassNames),
      ...validateExcludeClassNames(this.excludeClassNames),
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

    const payload = {
      config: {},
      include: this.includeClassNames,
      exclude: this.excludeClassNames,
    };

    if (this.waitForCompletion) {
      return this._restoreAndWaitForCompletion(payload);
    }
    return this._restore(payload);
  }

  _restore(payload: any) {
    return this.client.post(this._path(), payload);
  }

  _restoreAndWaitForCompletion(payload: any) {
    return new Promise((resolve, reject) => {
      this._restore(payload)
        .then((restoreResponse: any) => {
          this.statusGetter
            .withBackend(this.backend)
            .withBackupId(this.backupId);

          const loop = () => {
            this.statusGetter.do()
              .then((restoreStatusResponse: any) => {
                if (restoreStatusResponse.status == RestoreStatus.SUCCESS
                    || restoreStatusResponse.status == RestoreStatus.FAILED
                ) {
                  resolve(this._merge(restoreStatusResponse, restoreResponse));
                } else {
                  setTimeout(loop, WAIT_INTERVAL);
                }
              })
              .catch(reject);
          };

          loop();
        })
        .catch(reject)
    });
  }

  _path() {
    return `/backups/${this.backend}/${this.backupId}/restore`;
  }

  _merge(restoreStatusResponse: any, restoreResponse: any) {
    const merged = {};
    if ('id' in restoreStatusResponse) {
      // @ts-expect-error TS(2339): Property 'id' does not exist on type '{}'.
      merged.id = restoreStatusResponse.id;
    }
    if ('path' in restoreStatusResponse) {
      // @ts-expect-error TS(2339): Property 'path' does not exist on type '{}'.
      merged.path = restoreStatusResponse.path
    }
    if ('backend' in restoreStatusResponse) {
      // @ts-expect-error TS(2339): Property 'backend' does not exist on type '{}'.
      merged.backend = restoreStatusResponse.backend
    }
    if ('status' in restoreStatusResponse) {
      // @ts-expect-error TS(2339): Property 'status' does not exist on type '{}'.
      merged.status = restoreStatusResponse.status
    }
    if ('error' in restoreStatusResponse) {
      // @ts-expect-error TS(2339): Property 'error' does not exist on type '{}'.
      merged.error = restoreStatusResponse.error
    }
    if ('classes' in restoreResponse) {
      // @ts-expect-error TS(2339): Property 'classes' does not exist on type '{}'.
      merged.classes = restoreResponse.classes
    }
    return merged;
  }
}
