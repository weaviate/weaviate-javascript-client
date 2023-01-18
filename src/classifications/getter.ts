export default class Getter {
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
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    const path = `/classifications/${this.id}`;
    return this.client.get(path);
  };
}
