import Connection from "../connection";

export default class Checker {
  private client: Connection;
  private objectsPath: any;
  private errors: any[];
  private className?: string;
  private id?: string;
  constructor(client: Connection, objectsPath: any) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
  }

  withId = (id: string) => {
    this.id = id;
    return this;
  };

  withClassName = (className: string) => {
    this.className = className;
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
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    this.validate();

    return this.objectsPath.buildCheck(this.id, this.className)
      .then(this.client.head)
  };
}
