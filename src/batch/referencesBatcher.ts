export default class ReferencesBatcher {
  beaconPath: any;
  client: any;
  errors: any;
  references: any;
  constructor(client: any, beaconPath: any) {
    this.client = client;
    this.beaconPath = beaconPath;
    this.references = [];
    this.errors = [];
  }

  /**
   * can be called as:
   *  - withReferences([ref1, ref2, ref3])
   *  - withReferences(ref1, ref2, ref3)
   *  - withReferences(ref1)
   * @param  {...any} references
   */
  withReferences(...references: any[]) {
    let refs = references;
    if (references.length && Array.isArray(references[0])) {
      refs = references[0];
    }
    this.references = [...this.references, ...refs];
    return this;
  }

  withReference(reference: any) {
    return this.withReferences(reference);
  }

  payload = () => this.references;

  validateReferenceCount = () => {
    if (this.references.length == 0) {
      this.errors = [
        ...this.errors,
        "need at least one reference to send a request, " +
          "add one with .withReference(obj)",
      ];
    }
  };

  validate = () => {
    this.validateReferenceCount();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/batch/references`;
    const payloadPromise = Promise.all(this.references.map((ref: any) => this.rebuildReferencePromise(ref)));

    return payloadPromise.then(payload => this.client.post(path, payload));
  };

  rebuildReferencePromise(reference: any) {
    return this.beaconPath.rebuild(reference.to)
      .then((beaconTo: any) => ({
      from: reference.from,
      to: beaconTo
    }));
  }
}
