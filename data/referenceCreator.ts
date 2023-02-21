import connection from "../connection";
import { BeaconPath } from "../utils/beaconPath";
import { ReferencesPath } from "./path";
import Connection from "../connection";

export default class ReferenceCreator {
  private client: Connection;
  private referencesPath: ReferencesPath;
  private beaconPath: BeaconPath;
  private errors: any[];
  private id: any;
  private className?: string;
  private reference: any;
  private refProp: any;
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

  withReference = (ref: any) => {
    this.reference = ref;
    return this;
  };

  withReferenceProperty = (refProp: any) => {
    this.refProp = refProp;
    return this;
  };

  withConsistencyLevel = (cl: string) => {
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
    this.validateIsSet(this.reference, "reference", ".withReference(ref)");
    this.validateIsSet(
      this.refProp,
      "referenceProperty",
      ".withReferenceProperty(refProp)"
    );
  };

  payload = () => this.reference;

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return Promise.all([
      this.referencesPath.build(this.id, this.className, this.refProp, this.consistencyLevel),
      this.beaconPath.rebuild(this.reference.beacon)
    ]).then(results => {
      const path = results[0];
      const beacon = results[1];
      return this.client.post(path, { beacon }, false);
    });
  };
}
