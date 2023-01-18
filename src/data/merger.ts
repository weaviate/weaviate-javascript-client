import { isValidStringProperty } from "../validation/string";

export default class Merger {
  className: any;
  client: any;
  errors: any;
  id: any;
  objectsPath: any;
  properties: any;
  constructor(client: any, objectsPath: any) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
  }

  withProperties = (properties: any) => {
    this.properties = properties;
    return this;
  };

  withClassName = (className: any) => {
    this.className = className;
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
        "className must be set - set with withClassName(className)",
      ];
    }
  };

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [...this.errors, "id must be set - set with withId(id)"];
    }
  };

  payload = () => ({
    properties: this.properties,
    class: this.className,
    id: this.id,
  });

  validate = () => {
    this.validateClassName();
    this.validateId();
  };

  do = () => {
    this.validate();

    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.objectsPath.buildMerge(this.id, this.className)
      .then((path: any) => this.client.patch(path, this.payload()));
  };
}
