const get = {
  things: function (className, queryString) {
    return new GraphQLBuilder('Things', className, queryString);
  },
};

module.exports = {get};

class GraphQLBuilder {
  constructor(kind, className, queryString) {
    this.kind = kind;
    (this.className = className), (this.queryString = queryString);
  }

  withClient(client) {
    this.client = client;
    return this;
  }

  withWhere(whereObj) {
    this.whereString = new GraphQLWhere(whereObj).toString();
    return this;
  }

  do() {
    let params = '';

    if (this.whereString) {
      params = `(where:${this.whereString})`;
    }

    this.client.query(
      `{Get{${this.kind}{${this.className}${params}{${this.queryString}}}}}`,
    );
  }
}

class GraphQLWhere {
  constructor(whereObj) {
    this.source = whereObj;
  }

  toString() {
    this.parse();
    this.validate();
    if (this.operands) {
      return (
        `{` + `operator:${this.operator},` + `operands:[${this.operands}]` + `}`
      );
    } else {
      // this is an on-value filter
      return (
        `{` +
        `operator:${this.operator},` +
        `${this.valueType}:${JSON.stringify(this.valueContent)},` +
        `path:${JSON.stringify(this.path)}` +
        `}`
      );
    }
  }

  validate() {
    if (!this.operator) {
      throw new Error('where filter: operator cannot be empty');
    }

    if (!this.operands) {
      if (!this.valueType) {
        throw new Error('where filter: value<Type> cannot be empty');
      }

      if (!this.path) {
        throw new Error('where filter: path cannot be empty');
      }
    }
  }

  parse() {
    for (let key in this.source) {
      switch (key) {
        case 'operator':
          this.parseOperator(this.source[key]);
          break;
        case 'operands':
          this.parseOperands(this.source[key]);
          break;
        case 'path':
          this.parsePath(this.source[key]);
          break;
        default:
          if (key.indexOf('value') != 0) {
            throw new Error("where filter: unrecognized key '" + key + "'");
          }
          this.parseValue(key, this.source[key]);
      }
    }
  }

  parseOperator(op) {
    if (typeof op !== 'string') {
      throw new Error('where filter: operator must be a string');
    }

    this.operator = op;
  }

  parsePath(path) {
    if (!Array.isArray(path)) {
      throw new Error('where filter: path must be an array');
    }

    this.path = path;
  }

  parseValue(key, value) {
    switch (key) {
      case 'valueString':
      case 'valueText':
      case 'valueInt':
      case 'valueNumber':
      case 'valueDate':
      case 'valueBoolean':
      case 'valueGeoRange':
        break;
      default:
        throw new Error("where filter: unrecognized value prop '" + key + "'");
    }
    this.valueType = key;
    this.valueContent = value;
  }

  parseOperands(ops) {
    if (!Array.isArray(ops)) {
      throw new Error('where filter: operator must be an array');
    }

    this.operands = ops
      .map(element => {
        return new GraphQLWhere(element).toString();
      })
      .join(',');
  }
}
