export default class GraphQLBm25 {
  constructor(bm25Obj) {
    this.source = bm25Obj;
  }

  toString(wrap = true) {
    this.parse();
    this.validate();

    let args = [`query:${JSON.stringify(this.query)}`]; // query must always be set
   
    if (this.properties) {
      args = [...args, `properties:${JSON.stringify(this.properties)}`];
    }

    return `{${args.join(",")}}`;
  }

  validate() {
    if (!this.query) {
      throw new Error("bm25 filter: query cannot be empty");
    }
  }

  parse() {
    for (let key in this.source) {
      switch (key) {
        case "query":
          this.parseQuery(this.source[key]);
          break;
        case "properties":
          this.parseProperties(this.source[key]);
          break;
        default:
          throw new Error("bm25 filter: unrecognized key '" + key + "'");
      }
    }
  }

 
  parseProperties(properties) {
    if (!Array.isArray(properties)) {
      throw new Error("bm25 filter: properties must be an array");
    }

    this.properties = properties;
  }

  parseQuery(query) {
    if (typeof query !== "string") {
      throw new Error("bm25 filter: query must be a number");
    }

    this.query = query;
  }

}
