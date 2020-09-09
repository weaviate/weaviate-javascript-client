const {
  DEFAULT_KIND,
  validateKind,
} = require('../kinds');

class Getter {
  constructor(client) {
    this.client = client;
    this.kind = DEFAULT_KIND;
    this.errors = [];
    this.underscores = [];
  }

  withKind = kind => {
    validateKind(kind);
    this.kind = kind;
    return this;
  };

  extendUnderscores = prop => {
    this.underscores = [...this.underscores, prop];
    return this;
  };

  withUnderscoreClassification = () =>
    this.extendUnderscores('_classification');

  withUnderscoreInterpretation = () =>
    this.extendUnderscores('_interpretation');

  withUnderscoreNearestNeighbors = () =>
    this.extendUnderscores('_nearestNeighbors');

  withUnderscoreFeatureProjection = () =>
    this.extendUnderscores('_featureProjection');

  withUnderscoreVector = () => this.extendUnderscores('_vector');

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    let path = `/${this.kind}`;
    if (this.underscores.length > 0) {
      path += `?include=${this.underscores.join(',')}`;
    }
    return this.client.get(path);
  };
}

module.exports = Getter;
