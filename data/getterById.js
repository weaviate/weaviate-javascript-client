import {DEFAULT_KIND, validateKind} from '../kinds';

export default class GetterById {
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

  withId = id => {
    this.id = id;
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

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [
        ...this.errors,
        'id must be set - initialize with getterById(id)',
      ];
    }
  };

  validate = () => {
    this.validateId();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }

    let path = `/${this.kind}/${this.id}`;
    if (this.underscores.length > 0) {
      path += `?include=${this.underscores.join(',')}`;
    }
    return this.client.get(path);
  };
}
