import { CreateStatus } from "./consts";
import { validateBackupId, validateExcludeClassNames, validateIncludeClassNames, validateBackend } from "./validation";

const WAIT_INTERVAL = 1000;

export default class BackupCreator {
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
      id: this.backupId,
      config: {},
      include: this.includeClassNames,
      exclude: this.excludeClassNames,
    };

    if (this.waitForCompletion) {
      return this._createAndWaitForCompletion(payload);
    }
    return this._create(payload);
  }

  _create(payload: any) {
    return this.client.post(this._path(), payload);
  }

  _createAndWaitForCompletion(payload: any) {
    return new Promise((resolve, reject) => {
      this._create(payload)
        .then((createResponse: any) => {
          this.statusGetter
            .withBackend(this.backend)
            .withBackupId(this.backupId);

          const loop = () => {
            this.statusGetter.do()
              .then((createStatusResponse: any) => {
                if (createStatusResponse.status == CreateStatus.SUCCESS
                    || createStatusResponse.status == CreateStatus.FAILED
                ) {
                  resolve(this._merge(createStatusResponse, createResponse));
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
    return `/backups/${this.backend}`;
  }

  _merge(createStatusResponse: any, createResponse: any) {
    const merged = {};
    if ('id' in createStatusResponse) {
      // @ts-expect-error TS(2339): Property 'id' does not exist on type '{}'.
      merged.id = createStatusResponse.id;
    }
    if ('path' in createStatusResponse) {
      // @ts-expect-error TS(2339): Property 'path' does not exist on type '{}'.
      merged.path = createStatusResponse.path
    }
    if ('backend' in createStatusResponse) {
      // @ts-expect-error TS(2339): Property 'backend' does not exist on type '{}'.
      merged.backend = createStatusResponse.backend
    }
    if ('status' in createStatusResponse) {
      // @ts-expect-error TS(2339): Property 'status' does not exist on type '{}'.
      merged.status = createStatusResponse.status
    }
    if ('error' in createStatusResponse) {
      // @ts-expect-error TS(2339): Property 'error' does not exist on type '{}'.
      merged.error = createStatusResponse.error
    }
    if ('classes' in createResponse) {
      // @ts-expect-error TS(2339): Property 'classes' does not exist on type '{}'.
      merged.classes = createResponse.classes
    }
    return merged;
  }
}
