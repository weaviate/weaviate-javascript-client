import { isValidStringProperty } from "../validation/string";

export default class PropertyCreator {
  className: any;
  client: any;
  errors: any;
  property: any;
  constructor(client: any) {
    this.client = client;
    this.errors = [];
  }

  withClassName = (className: any) => {
    this.className = className;
    return this;
  };

  withProperty = (property: any) => {
    this.property = property;
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

  validateProperty = () => {
    if (this.property == undefined || this.property == null) {
      this.errors = [
        ...this.errors,
        "property must be set - set with .withProperty(property)",
      ];
    }
  };

  validate = () => {
    this.validateClassName();
    this.validateProperty();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/schema/${this.className}/properties`;
    return this.client.post(path, this.property);
  };
}
