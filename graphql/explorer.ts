import NearText from "./nearText";
import NearVector from "./nearVector";
import NearObject from "./nearObject";
import NearImage from "./nearImage";
import Ask from "./ask";
import Connection from "../connection";

export default class Explorer {
  private client: Connection;
  private errors: any[];
  private params: {};
  private group?: string[];
  private nearVectorString?: string;
  private nearImageString?: string;
  private askString?: string;
  private nearObjectString?: string;
  private nearTextString?: string;
  private limit?: number
  private fields?: string;
  constructor(client: Connection) {
    this.client = client;
    this.params = {};
    this.errors = [];
  }

  withFields = (fields: string) => {
    this.fields = fields;
    return this;
  };

  withLimit = (limit: number) => {
    this.limit = limit;
    return this;
  };

  withNearText = (nearTextObj: any) => {
    try {
      this.nearTextString = new NearText(nearTextObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearObject = (nearObjectObj: any) => {
    try {
      this.nearObjectString = new NearObject(nearObjectObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withAsk = (askObj: any) => {
    try {
      this.askString = new Ask(askObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearImage = (nearImageObj: any) => {
    try {
      this.nearImageString = new NearImage(nearImageObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearVector = (nearVectorObj: any) => {
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

  validateIsSet = (prop: string | undefined | null, name: string, setter: string) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
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

    let args: any[] = [];

    if (this.nearTextString) {
      args = [...args, `nearText:${this.nearTextString}`];
    }

    if (this.nearObjectString) {
      args = [...args, `nearObject:${this.nearObjectString}`];
    }

    if (this.askString) {
      args = [...args, `ask:${this.askString}`];
    }

    if (this.nearImageString) {
      args = [...args, `nearImage:${this.nearImageString}`];
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
