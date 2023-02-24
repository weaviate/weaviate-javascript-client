import { isValidStringProperty } from "../validation/string";
import { buildObjectsPath } from "./path"
import Connection from "../connection";

export default class ObjectsBatchDeleter {
  private className?: string;
  private whereFilter?: any;
  private output?: any;
  private dryRun?: boolean;
  private errors: any[];
  private client: Connection;

  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  withClassName(className: string) {
    this.className = className;
    return this;
  }

  withWhere(whereFilter: any) {
    this.whereFilter = whereFilter;
    return this;
  }

  withOutput(output: any) {
    this.output = output;
    return this;
  }

  withDryRun(dryRun: boolean) {
    this.dryRun = dryRun;
    return this;
  }

  withConsistencyLevel = (cl) => {
    this.consistencyLevel = cl;
    return this;
  };

  payload() {
    return {
      match: {
        class: this.className,
        where: this.whereFilter,
      },
      output: this.output,
      dryRun: this.dryRun,
    }
  }

  validateClassName() {
    if (!isValidStringProperty(this.className)) {
      this.errors = [
        ...this.errors,
        "string className must be set - set with .withClassName(className)",
      ];
    }
  }

  validateWhereFilter() {
    if (typeof this.whereFilter != "object") {
      this.errors = [
        ...this.errors,
        "object where must be set - set with .withWhere(whereFilter)"
      ]
    }
  }

  validate() {
    this.validateClassName();
    this.validateWhereFilter();
  };

  do() {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    let params = new URLSearchParams()
    if (this.consistencyLevel) {
      params.set("consistency_level", this.consistencyLevel)
    }
    const path = buildObjectsPath(params);
    return this.client.delete(path, this.payload(), true);
  };
}
