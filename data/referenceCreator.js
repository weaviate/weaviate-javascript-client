export default class ReferenceCreator {
  constructor(client, referencesPath) {
    this.client = client;
    this.referencesPath = referencesPath;
    this.errors = [];
  }

  withId = (id) => {
    this.id = id;
    return this;
  };

  withClassName(className) {
    this.className = className;
    return this;
  }

  withReference = (ref) => {
    this.reference = ref;
    return this;
  };

  withReferenceProperty = (refProp) => {
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

  validate = () => {
    this.validateIsSet(this.id, "id", ".withId(id)");
    this.validateIsSet(this.reference, "reference", ".withReference(ref)");
    this.validateIsSet(
      this.refProp,
      "referenceProperty",
      ".withReferenceProperty(refProp)"
    );
  };

  payload = () => this.reference;

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    
    return this.referencesPath.build(this.id, this.className, this.refProp)
      .then(path => this.client.post(path, this.payload(), false));
  };
}
