import { isValidStringProperty } from "../validation/string";

export default class ObjectsBatchDeleter {
  client: any;
  errors: any;
  className: any;
  whereFilter: any;
  output: any;
  dryRun: any;

  constructor(client: any) {
    this.client = client;
    this.errors = [];
  }

  withClassName(className: any) {
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

  withDryRun(dryRun: any) {
    this.dryRun = dryRun;
    return this;
  }

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
  }

  do() {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/batch/objects`;
    return this.client.delete(path, this.payload(), true);
  }
}
