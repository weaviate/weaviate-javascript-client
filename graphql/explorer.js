import explore from './explore';
import {DEFAULT_KIND, validateKind} from '../kinds';

export default class Explorer {
  constructor(client) {
    this.client = client;
    this.params = {};
    this.errors = [];
  }

  withFields = fields => {
    this.fields = fields;
    return this;
  };

  withLimit = limit => {
    this.limit = limit;
    return this;
  };

  withConcepts = concepts => {
    this.params.concepts = concepts;
    return this;
  };

  withMoveTo = moveTo => {
    this.params.moveTo = moveTo;
    return this;
  };

  withMoveAwayFrom = moveAwayFrom => {
    this.params.moveAwayFrom = moveAwayFrom;
    return this;
  };

  withCertainty = certainty => {
    this.params.certainty = certainty;
    return this;
  };

  uppercasedKind = () => this.kind.charAt(0).toUpperCase() + this.kind.slice(1);

  validateGroup = () => {
    if (!this.group) {
      // nothing to check if this optional parameter is not set
      return;
    }

    if (!Array.isArray(this.group)) {
      throw new Error('groupBy must be an array');
    }
  };

  buildExploreArgs = () => {
    try {
      this.exploreString = new explore.GraphQLExplore(this.params).toString(
        false,
      );
    } catch (e) {
      this.errors = [...this.errors, e];
    }
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
    this.validateIsSet(this.fields, 'fields', '.withFields(fields)');
    this.validateIsSet(
      this.params.concepts,
      'concepts',
      '.withConcepts(concepts)',
    );
  };

  do = () => {
    let params = '';

    this.buildExploreArgs();
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }

    let args = [];

    if (this.exploreString) {
      args = [...args, `${this.exploreString}`];
    }

    if (this.limit) {
      args = [...args, `limit:${this.limit}`];
    }

    params = `(${args.join(',')})`;

    return this.client.query(`{Explore${params}{${this.fields}}}`);
  };
}
