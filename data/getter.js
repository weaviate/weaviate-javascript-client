import {DEFAULT_KIND, validateKind} from '../kinds';

export default class Getter {
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

  withLimit = limit => {
    this.limit = limit;
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

    let params = [];
    if (this.underscores.length > 0) {
      params = [...params, `include=${this.underscores.join(',')}`];
    }

    if (this.limit) {
      params = [...params, `limit=${this.limit}`];
    }

    if (params.length > 0) {
      path += `?${params.join('&')}`;
    }

    return this.client.get(path);
  };
}
