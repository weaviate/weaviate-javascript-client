export class DbVersionSupport {

  private dbVersionProvider: DbVersionProvider

  constructor(dbVersionProvider: DbVersionProvider) {
    this.dbVersionProvider = dbVersionProvider;
  }

  supportsClassNameNamespacedEndpointsPromise() {
    return this.dbVersionProvider.getVersionPromise().then((version: string | undefined) => ({
      version,
      supports: this.supportsClassNameNamespacedEndpoints(version),
      warns: {
        deprecatedNonClassNameNamespacedEndpointsForObjects: () => console.warn(`Usage of objects paths without className is deprecated in Weaviate ${version}. Please provide className parameter`),
        deprecatedNonClassNameNamespacedEndpointsForReferences: () => console.warn(`Usage of references paths without className is deprecated in Weaviate ${version}. Please provide className parameter`),
        deprecatedNonClassNameNamespacedEndpointsForBeacons: () => console.warn(`Usage of beacons paths without className is deprecated in Weaviate ${version}. Please provide className parameter`),
        notSupportedClassNamespacedEndpointsForObjects: () => console.warn(`Usage of objects paths with className is not supported in Weaviate ${version}. className parameter is ignored`),
        notSupportedClassNamespacedEndpointsForReferences: () => console.warn(`Usage of references paths with className is not supported in Weaviate ${version}. className parameter is ignored`),
        notSupportedClassNamespacedEndpointsForBeacons: () => console.warn(`Usage of beacons paths with className is not supported in Weaviate ${version}. className parameter is ignored`),
        notSupportedClassParameterInEndpointsForObjects: () => console.warn(`Usage of objects paths with class query parameter is not supported in Weaviate ${version}. class query parameter is ignored`),
      }
    }));
  }

  // >= 1.14
  supportsClassNameNamespacedEndpoints(version: string | undefined) {
    if (typeof version === "string") {
      const versionNumbers = version.split(".");
      if (versionNumbers.length >= 2) {
        const major = parseInt(versionNumbers[0]);
        const minor = parseInt(versionNumbers[1]);
        return (major == 1 && minor >= 14) || major >= 2;
      }
    }
    return false;
  }
}

const EMPTY_VERSION = "";
export class DbVersionProvider {
  private versionPromise?: Promise<string | undefined>;
  private emptyVersionPromise: Promise<string>;
  private versionGetter: () => Promise<string>;

  constructor(versionGetter: () => Promise<string>) {
    this.versionGetter = versionGetter;

    this.emptyVersionPromise = Promise.resolve(EMPTY_VERSION);
    this.versionPromise = undefined;
  }

  getVersionPromise() {
    if (this.versionPromise) {
      return this.versionPromise;
    }
    return this.versionGetter().then(version => this.assignPromise(version));
  }

  refresh(force = false) {
    if (force || !this.versionPromise) {
      this.versionPromise = undefined;
      return this.versionGetter()
        .then(version => this.assignPromise(version))
        .then(() => Promise.resolve(true));
    }
    return Promise.resolve(false);
  }

  assignPromise(version: string | undefined) {
    if (version === EMPTY_VERSION) {
      return this.emptyVersionPromise;
    }
    this.versionPromise = Promise.resolve(version);
    return this.versionPromise;
  }
}
