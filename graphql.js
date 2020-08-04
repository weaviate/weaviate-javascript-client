const where = require('./graphqlWhere.js');
const explore = require('./graphqlExplore.js');

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
    this.whereString = new where.GraphQLWhere(whereObj).toString();
    return this;
  }

  withExplore(exploreObj) {
    this.exploreString = new explore.GraphQLExplore(exploreObj).toString();
    return this;
  }

  do() {
    let params = '';

    if (this.whereString || this.exploreString) {
      let args = [];

      if (this.whereString) {
        args = [...args, `where:${this.whereString}`];
      }

      if (this.exploreString) {
        args = [...args, `explore:${this.exploreString}`];
      }

      params = `(${args.join(',')})`;
    }

    this.client.query(
      `{Get{${this.kind}{${this.className}${params}{${this.queryString}}}}}`,
    );
  }
}
