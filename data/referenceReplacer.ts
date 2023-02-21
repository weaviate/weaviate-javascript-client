import Connection from "../connection";
import {BeaconPath} from "../utils/beaconPath";
import {ReferencesPath} from "./path";

export default class ReferenceReplacer {
  private client: Connection;
  private referencesPath: ReferencesPath;
  private beaconPath: BeaconPath;
  private errors: any[];
  private references?: any[];
  private className?: string;
  private refProp: any;
  private id: any;
  private consistencyLevel?: string
  constructor(client: Connection, referencesPath: ReferencesPath, beaconPath: BeaconPath) {
    this.client = client;
    this.referencesPath = referencesPath;
    this.beaconPath = beaconPath;
    this.errors = [];
  }

  withId = (id: any) => {
    this.id = id;
    return this;
  };

  withClassName(className: string) {
    this.className = className;
    return this;
  }

  withReferences = (refs: any) => {
    this.references = refs;
    return this;
  };

  withReferenceProperty = (refProp: any) => {
    this.refProp = refProp;
    return this;
  };

  withConsistencyLevel = (cl:string) => {
    this.consistencyLevel = cl;
    return this;
  };

  validateIsSet = (prop: string | any[] | null | undefined, name: string, setter: string) => {
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

    var payloadPromise = Array.isArray(this.references)
      ? Promise.all(this.references.map(ref => this.rebuildReferencePromise(ref)))
      : Promise.resolve([]);

    return Promise.all([
      this.referencesPath.build(this.id, this.className, this.refProp, this.consistencyLevel),
      payloadPromise
    ]).then(results => {
      const path = results[0];
      const payload = results[1];
      return this.client.put(path, payload, false);
    });
  };

  rebuildReferencePromise(reference: any) {
    return this.beaconPath.rebuild(reference.beacon)
      .then((beacon: any) => ({ beacon }));
  }
}
