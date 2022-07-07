export default class ReferencesBatcher {
  constructor(client, beaconPath) {
    this.client = client;
    this.beaconPath = beaconPath;
    this.references = [];
    this.errors = [];
  }

  withReference = (obj) => {
    this.references = [...this.references, obj];
    return this;
  };

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
    const payloadPromise = Promise.all(this.references.map(ref => this.rebuildReferencePromise(ref)));

    return payloadPromise.then(payload => this.client.post(path, payload));
  };

  rebuildReferencePromise(reference) {
    return this.beaconPath.rebuild(reference.to)
      .then(beaconTo => ({
        from: reference.from,
        to: beaconTo
      }));
  }
}
