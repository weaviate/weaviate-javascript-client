export class DbVersionSupport {

  constructor(dbVersionProvider) {
    this.dbVersionProvider = dbVersionProvider;
  }

  supportsClassNameNamespacedEndpointsPromise() {
    return this.dbVersionProvider.getVersionPromise().then(version => ({
      version,
      supports: this.supportsClassNameNamespacedEndpoints(version),
      warns: {
        deprecatedNonClassNameNamespacedEndpointsForObjects: () => console.warn(`Usage of objects paths without className is deprecated in Weaviate ${version}. Please provide className parameter`),
        deprecatedNonClassNameNamespacedEndpointsForReferences: () => console.warn(`Usage of references paths without className is deprecated in Weaviate ${version}. Please provide className parameter`),
        deprecatedNonClassNameNamespacedEndpointsForBeacons: () => console.warn(`Usage of beacons paths without className is deprecated in Weaviate ${version}. Please provide className parameter`),
        notSupportedClassNamespacedEndpointsForObjects: () => console.warn(`Usage of objects paths with className is not supported in Weaviate ${version}. className parameter is ignored`),
        notSupportedClassNamespacedEndpointsForReferences: () => console.warn(`Usage of references paths with className is not supported in Weaviate ${version}. className parameter is ignored`),
        notSupportedClassNamespacedEndpointsForBeacons: () => console.warn(`Usage of beacons paths with className is not supported in Weaviate ${version}. className parameter is ignored`),
      }
    }));
  }

  // >= 1.14
  supportsClassNameNamespacedEndpoints(version) {
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


export class DbVersionProvider {

  constructor(versionGetter) {
    this.versionGetter = versionGetter;
    this.versionPromise = Promise.resolve("");
  }

  getVersionPromise() {
    return this.versionPromise;
  }

  refresh(force = false) {
    this.versionPromise.then(version => {
      if (force || version === "") {
        this.versionPromise = this.versionGetter();
      }
    });
  }
}
