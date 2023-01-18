import { isValidStringProperty } from "../validation/string";

export default class Validator {
  className: any;
  client: any;
  errors: any;
  id: any;
  properties: any;
  constructor(client: any) {
    this.client = client;
    this.errors = [];
  }

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
    const path = `/objects/validate`;
    return this.client.post(path, this.payload(), false).then(() => true);
  };
}
