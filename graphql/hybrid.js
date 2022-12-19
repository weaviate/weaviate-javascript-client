export default class GraphQLHybrid {
  constructor(hybridObj) {
    this.source = hybridObj;
  }

  toString(wrap = true) {
    this.parse();
    this.validate();

    let args = [`query:${JSON.stringify(this.query)}`]; // query must always be set

    if (this.alpha) {
      args = [...args, `alpha:${JSON.stringify(this.alpha)}`];
    }

    if (this.vector) {
      args = [...args, `vector:${JSON.stringify(this.vector)}`];
    }

    if (!wrap) {
      return `${args.join(",")}`;
    }
    return `{${args.join(",")}}`;
  }

  validate() {
    if (!this.query) {
      throw new Error("hybrid filter: query cannot be empty");
    }
  }

  parse() {
    for (let key in this.source) {
      switch (key) {
        case "query":
          this.parseQuery(this.source[key]);
          break;
        case "alpha":
          this.parseAlpha(this.source[key]);
          break;
        case "vector":
          this.parseVector(this.source[key]);
          break;
        default:
          throw new Error("hybrid filter: unrecognized key '" + key + "'");
      }
    }
  }

  parseVector(vector) {
    if (!Array.isArray(vector)) {
      throw new Error("hybrid filter: vector must be an array");
    }

    this.vector = vector;
  }

  parseQuery(query) {
    if (typeof query !== "string") {
      throw new Error("hybrid filter: query must be a string");
    }

    this.query = query;
  }

  parseAlpha(alpha) {
    if (typeof alpha !== "number") {
      throw new Error("hybrid filter: alpha must be a number");
    }

    this.alpha = alpha;
  }
}
