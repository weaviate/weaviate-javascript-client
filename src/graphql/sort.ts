export default class GraphQLSort {
  errors: any;
  order: any;
  path: any;
  sortArgs: any;
  source: any;
  constructor(sortObj: any) {
    this.source = sortObj;
    this.sortArgs = [];
    this.errors = []
  }

  toString() {
    this.parse();
    this.validate();

    let args: any = [];

    if (this.sortArgs.length > 0) {
      args = [...args, this.sortArgs];
    } else {
      if (this.path) {
        args = [...args, `path:${JSON.stringify(this.path)}`];
      }
  
      if (this.order) {
        args = [...args, `order:${this.order}`];
      }
    }

    if (this.sortArgs.length > 0) {
      return `${args.join(",")}`;
    }
    return `{${args.join(",")}}`;
  }

  validate() {
    if (this.sortArgs.length == 0) {
      this.validatePath(this.path)
    }
  }

  validatePath(path: any) {
    if (!path) {
      throw new Error("sort filter: path needs to be set");
    }
    if (path.length == 0) {
      throw new Error("sort filter: path cannot be empty");
    }
  }

  parse() {
    for (let key in this.source) {
      switch (key) {
        case "path":
          this.parsePath(this.source[key]);
          break;
        case "order":
          this.parseOrder(this.source[key]);
          break;
        default:
          try {
            this.sortArgs = [...this.sortArgs, this.parseSortArgs(this.source[key])];
          } catch(e) {
            // @ts-expect-error TS(2571): Object is of type 'unknown'.
            this.errors = [...this.errors, `sort argument at ${key}: ${e.message}`];
          }
      }
    }

    if (this.errors.length > 0) {
      throw new Error(`sort filter: ${this.errors.join(", ")}`);
    }
  }

  parseSortArgs(args: any) {
    return new GraphQLSort(args).toString();
  }

  parsePath(path: any) {
    if (!Array.isArray(path)) {
      throw new Error("sort filter: path must be an array");
    }

    this.path = path;
  }

  parseOrder(order: any) {
    if (typeof order !== "string") {
      throw new Error("sort filter: order must be a string");
    }

    if (order !== "asc" && order !== "desc") {
      throw new Error("sort filter: order parameter not valid, possible values are: asc, desc");
    }

    this.order = order;
  }
}
