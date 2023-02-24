import Connection from "../connection";

export default class Getter {
  private client: Connection;
  private errors: any[];
  private id?: string;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  withId = (id: string) => {
    this.id = id;
    return this;
  };

  validateIsSet = (prop: string | undefined | null, name: string, setter: string) => {
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
