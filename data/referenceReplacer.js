export default class ReferenceReplacer {
  constructor(client, referencesPath, beaconPath) {
    this.client = client;
    this.referencesPath = referencesPath;
    this.beaconPath = beaconPath;
    this.errors = [];
  }

  withId = (id) => {
    this.id = id;
    return this;
  };

  withClassName(className) {
    this.className = className;
    return this;
  }

  withReferences = (refs) => {
    this.references = refs;
    return this;
  };

  withReferenceProperty = (refProp) => {
    this.refProp = refProp;
    return this;
  };

  validateIsSet = (prop, name, setter) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validate = () => {
    this.validateIsSet(this.id, "id", ".withId(id)");
    this.validateIsSet(
      this.refProp,
      "referenceProperty",
      ".withReferenceProperty(refProp)"
    );
  };

  payload = () => this.references;

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    var rebuiltBeaconsPromise;
    if (Array.isArray(this.references)) {
      var promises = this.references
        .map(reference => reference.beacon)
        .map(beacon => this.beaconPath.rebuild(beacon));
      rebuiltBeaconsPromise = Promise.all(promises)
    } else {
      rebuiltBeaconsPromise = Promise.resolve([]);
    }

    return Promise.all([
      this.referencesPath.build(this.id, this.className, this.refProp),
      rebuiltBeaconsPromise
    ]).then(results => {
      const path = results[0];
      const beacons = results[1];
      return this.client.put(path, beacons.map(beacon => ({ beacon })), false);
    });
  };
}
