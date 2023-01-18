import { isValidStringProperty } from "../validation/string";

export default class Creator {
  className: any;
  client: any;
  errors: any;
  id: any;
  objectsPath: any;
  properties: any;
  vector: any;
  constructor(client: any, objectsPath: any) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
  }

  withVector = (vector: any) => {
    this.vector = vector;
    return this;
  };

  withClassName = (className: any) => {
    this.className = className;
    return this;
  };

  withProperties = (properties: any) => {
    this.properties = properties;
    return this;
  };

  withId = (id: any) => {
    this.id = id;
    return this;
  };

  validateClassName = () => {
    if (!isValidStringProperty(this.className)) {
      this.errors = [
        ...this.errors,
        "className must be set - set with .withClassName(className)",
      ];
    }
  };

  payload = () => ({
    vector: this.vector,
    properties: this.properties,
    class: this.className,
    id: this.id,
  });

  validate = () => {
    this.validateClassName();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.objectsPath.buildCreate()
      .then((path: any) => this.client.post(path, this.payload()));
  };
}
