import Where from "./where";
import NearText from "./nearText";
import NearVector from "./nearVector";
import NearObject from "./nearObject";
import {isValidPositiveIntProperty} from "../validation/number";
import Connection from "../connection";

export default class Aggregator {
  private client: Connection;
  private errors: any[];
  private includesNearMediaFilter: boolean;
  private fields: any;
  private className: any;
  private whereString: string | undefined;
  private nearTextString: string | undefined;
  private nearObjectString: string | undefined;
  private objectLimit: any;
  private nearVectorString: string | undefined;
  private limit: any;
  private groupBy: any;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
    this.includesNearMediaFilter = false
  }

  withFields = (fields: any) => {
    this.fields = fields;
    return this;
  };

  withClassName = (className: any) => {
    this.className = className;
    return this;
  };

  withWhere = (whereObj: any) => {
    try {
      this.whereString = new Where(whereObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearText = (nearTextObj: any) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearTextString = new NearText(nearTextObj).toString();
      this.includesNearMediaFilter = true;
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withNearObject = (nearObjectObj: any) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearObjectString = new NearObject(nearObjectObj).toString();
      this.includesNearMediaFilter = true;
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withNearVector = (nearVectorObj: any) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearVectorString = new NearVector(nearVectorObj).toString();
      this.includesNearMediaFilter = true;
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withObjectLimit = (objectLimit: any) => {
    if (!isValidPositiveIntProperty(objectLimit)) {
      throw new Error(
        "objectLimit must be a non-negative integer"
      )
    }

    this.objectLimit = objectLimit;
    return this;
  };

  withLimit = (limit: any) => {
    this.limit = limit;
    return this;
  };

  withGroupBy = (groupBy: any) => {
    this.groupBy = groupBy;
    return this;
  };

  validateGroup = () => {
    if (!this.groupBy) {
      // nothing to check if this optional parameter is not set
      return;
    }

    if (!Array.isArray(this.groupBy)) {
      throw new Error("groupBy must be an array");
    }
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
    this.validateGroup();
    this.validateIsSet(
      this.className,
      "className",
      ".withClassName(className)"
    );
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

    if (
      this.whereString ||
      this.nearTextString ||
      this.nearObjectString ||
      this.nearVectorString ||
      this.limit ||
      this.groupBy
    ) {
      let args: any[] = [];

      if (this.whereString) {
        args = [...args, `where:${this.whereString}`];
      }

      if (this.nearTextString) {
        args = [...args, `nearText:${this.nearTextString}`];
      }

      if (this.nearObjectString) {
        args = [...args, `nearObject:${this.nearObjectString}`];
      }

      if (this.nearVectorString) {
        args = [...args, `nearVector:${this.nearVectorString}`];
      }

      if (this.groupBy) {
        args = [...args, `groupBy:${JSON.stringify(this.groupBy)}`];
      }

      if (this.limit) {
        args = [...args, `limit:${this.limit}`];
      }

      if (this.objectLimit) {
        args = [...args, `objectLimit:${this.objectLimit}`];
      }

      params = `(${args.join(",")})`;
    }

    return this.client.query(
      `{Aggregate{${this.className}${params}{${this.fields}}}}`
    );
  };
}
