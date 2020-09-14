const where = require('./where');
const explore = require('./explore');
const {DEFAULT_KIND, validateKind} = require('../kinds');

class Getter {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
  }

  withFields = fields => {
    this.fields = fields;
    return this;
  };

  withClassName = className => {
    this.className = className;
    return this;
  };

  withKind = kind => {
    this.kind = kind;
    return this;
  };

  withWhere = whereObj => {
    this.whereString = new where.GraphQLWhere(whereObj).toString();
    return this;
  };

  withExplore = exploreObj => {
    this.exploreString = new explore.GraphQLExplore(exploreObj).toString();
    return this;
  };

  withLimit = limit => {
    this.limit = limit;
    return this;
  };

  uppercasedKind = () => this.kind.charAt(0).toUpperCase() + this.kind.slice(1);

  do = () => {
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
      `{Get{${this.uppercasedKind()}{${this.className}${params}{${
        this.fields
      }}}}}`,
    );
  };
}

module.exports = Getter;
