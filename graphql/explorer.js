import NearText from "./nearText";
import NearVector from "./nearVector";
import { DEFAULT_KIND, validateKind } from "../kinds";

export default class Explorer {
  constructor(client) {
    this.client = client;
    this.params = {};
    this.errors = [];
  }

  withFields = (fields) => {
    this.fields = fields;
    return this;
  };

  withLimit = (limit) => {
    this.limit = limit;
    return this;
  };

  withNearText = (nearTextObj) => {
    try {
      this.nearTextString = new NearText(nearTextObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearVector = (nearVectorObj) => {
    try {
      this.nearVectorString = new NearVector(nearVectorObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  validateGroup = () => {
    if (!this.group) {
      // nothing to check if this optional parameter is not set
      return;
    }

    if (!Array.isArray(this.group)) {
      throw new Error("groupBy must be an array");
    }
  };

  validateIsSet = (prop, name, setter) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validateKind = () => {
    try {
      validateKind(this.kind);
    } catch (e) {
      this.errors = [...this.errors, e.toString()];
    }
  };

  validate = () => {
    this.validateIsSet(this.fields, "fields", ".withFields(fields)");
  };

  do = () => {
    let params = "";

    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    let args = [];

    if (this.nearTextString) {
      args = [...args, `nearText:${this.nearTextString}`];
    }

    if (this.nearVectorString) {
      args = [...args, `nearVector:${this.nearVectorString}`];
    }
    if (this.limit) {
      args = [...args, `limit:${this.limit}`];
    }

    params = `(${args.join(",")})`;

    return this.client.query(`{Explore${params}{${this.fields}}}`);
  };
}
