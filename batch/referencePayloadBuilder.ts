import { isValidStringProperty } from "../validation/string";
import Connection from "../connection";

export default class ReferencesBatcher {
  private client: Connection;
  private errors: any[];
  private fromId: any;
  private toId: any;
  private fromClassName: any;
  private fromRefProp: any;
  private toClassName: any;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  withFromId = (id: any) => {
    this.fromId = id;
    return this;
  };

  withToId = (id: any) => {
    this.toId = id;
    return this;
  };

  withFromClassName = (className: any) => {
    this.fromClassName = className;
    return this;
  };

  withFromRefProp = (refProp: any) => {
    this.fromRefProp = refProp;
    return this;
  };

  withToClassName(className: any) {
    this.toClassName = className;
    return this;
  }

  validateIsSet = (prop: string | any[] | null | undefined, name: string, setter: string) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validate = () => {
    this.validateIsSet(this.fromId, "fromId", ".withFromId(id)");
    this.validateIsSet(this.toId, "toId", ".withToId(id)");
    this.validateIsSet(
      this.fromClassName,
      "fromClassName",
      ".withFromClassName(className)"
    );
    this.validateIsSet(
      this.fromRefProp,
      "fromRefProp",
      ".withFromRefProp(refProp)"
    );
  };

  payload = () => {
    this.validate();
    if (this.errors.length > 0) {
      throw new Error(this.errors.join(", "));
    }

    var beaconTo = `weaviate://localhost`;
    if (isValidStringProperty(this.toClassName)) {
      beaconTo = `${beaconTo}/${this.toClassName}`;
    }

    return {
      from:
        `weaviate://localhost/${this.fromClassName}` +
        `/${this.fromId}/${this.fromRefProp}`,
      to: `${beaconTo}/${this.toId}`,
    };
  };
}
