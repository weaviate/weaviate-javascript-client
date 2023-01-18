import { isValidStringProperty } from "../validation/string";

export default class ReferencePayloadBuilder {
  className: any;
  client: any;
  errors: any;
  id: any;
  constructor(client: any) {
    this.client = client;
    this.errors = [];
  }

  withId = (id: any) => {
    this.id = id;
    return this;
  };

  withClassName(className: any) {
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

  validate = () => {
    this.validateIsSet(this.id, "id", ".withId(id)");
  };

  payload = () => {
    this.validate();
    if (this.errors.length > 0) {
      throw new Error(this.errors.join(", "));
    }

    var beacon = `weaviate://localhost`;
    if (isValidStringProperty(this.className)) {
      beacon = `${beacon}/${this.className}`;
    }
    return {
      beacon: `${beacon}/${this.id}`,
    };
  };
}
