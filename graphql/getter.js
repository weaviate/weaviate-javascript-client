const where = require('./where');
const explore = require('./explore');

class Getter {
  constructor(kind, className, queryString) {
    this.kind = kind;
    this.className = className;
    this.queryString = queryString;
  }

  withClient(client) {
    this.client = client;
    return this;
  }

  withWhere(whereObj) {
    this.whereString = new where.GraphQLWhere(whereObj).toString();
    return this;
  }

  withExplore(exploreObj) {
    this.exploreString = new explore.GraphQLExplore(exploreObj).toString();
    return this;
  }

  withLimit(limit) {
    this.limit = limit;
    return this;
  }

  do() {
    let params = '';

    if (this.whereString || this.exploreString || this.limit) {
      let args = [];

      if (this.whereString) {
        args = [...args, `where:${this.whereString}`];
      }

      if (this.exploreString) {
        args = [...args, `explore:${this.exploreString}`];
      }

      if (this.limit) {
        args = [...args, `limit:${this.limit}`];
      }

      params = `(${args.join(',')})`;
    }

    return this.client.query(
      `{Get{${this.kind}{${this.className}${params}{${this.queryString}}}}}`,
    );
  }
}

module.exports = Getter;
