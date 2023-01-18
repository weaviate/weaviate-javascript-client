export default class Deleter {
  className: any;
  client: any;
  errors: any;
  id: any;
  objectsPath: any;
  constructor(client: any, objectsPath: any) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
  }

  withId = (id: any) => {
    this.id = id;
    return this;
  };

  withClassName = (className: any) => {
    this.className = className;
    return this;
  }

  validateIsSet = (prop: any, name: any, setter: any) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validateId = () => {
    this.validateIsSet(this.id, "id", ".withId(id)");
  };

  validate = () => {
    this.validateId();
  };

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    this.validate();

    return this.objectsPath.buildDelete(this.id, this.className)
      .then(this.client.delete);
  };
}
