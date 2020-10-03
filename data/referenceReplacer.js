import {DEFAULT_KIND, validateKind} from '../kinds';

export default class ReferenceReplacer {
  constructor(client) {
    this.client = client;
    this.errors = [];
    this.kind = DEFAULT_KIND;
  }

  withId = id => {
    this.id = id;
    return this;
  };

  withKind = kind => {
    this.kind = kind;
    return this;
  };

  withReferences = refs => {
    this.references = refs;
    return this;
  };

  withReferenceProperty = refProp => {
    this.refProp = refProp;
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
    this.validateIsSet(this.id, 'id', '.withId(id)');
    this.validateIsSet(
      this.refProp,
      'referenceProperty',
      '.withReferenceProperty(refProp)',
    );
  };

  payload = () => this.references;

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error('invalid usage: ' + this.errors.join(', ')),
      );
    }
    const path = `/${this.kind}/${this.id}/references/${this.refProp}`;
    return this.client.put(path, this.payload(), false);
  };
}
