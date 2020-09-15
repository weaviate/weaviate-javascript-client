const where = require('./where');
const explore = require('./explore');
const group = require('./group');
const {DEFAULT_KIND, validateKind} = require('../kinds');

class Getter {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
    this.errors = [];
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

  withGroup = groupObj => {
    try {
      this.groupString = new group.GraphQLGroup(groupObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withWhere = whereObj => {
    try {
      this.whereString = new where.GraphQLWhere(whereObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withExplore = exploreObj => {
    try {
      this.exploreString = new explore.GraphQLExplore(exploreObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withLimit = limit => {
    this.limit = limit;
    return this;
  };

  validateIsSet = (prop, name, setter) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validateKind = () => {
    try {
      validateKind(this.kind);
    } catch (e) {
      this.errors = [...this.errors, e.toString()];
    }
  };

  validate = () => {
    this.validateKind();
    this.validateIsSet(
      this.className,
      'className',
      '.withClassName(className)',
    );
    this.validateIsSet(this.fields, 'fields', '.withFields(fields)');
  };

  uppercasedKind = () => this.kind.charAt(0).toUpperCase() + this.kind.slice(1);

  do = () => {
    let params = '';

    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }

    if (
      this.whereString ||
      this.exploreString ||
      this.limit ||
      this.groupString
    ) {
      let args = [];

      if (this.whereString) {
        args = [...args, `where:${this.whereString}`];
      }

      if (this.exploreString) {
        args = [...args, `explore:${this.exploreString}`];
      }

      if (this.groupString) {
        args = [...args, `group:${this.groupString}`];
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
