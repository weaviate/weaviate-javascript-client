import Connection from "../connection";

export default class ClassCreator {
  private class: any;
  private client: Connection;
  private errors: any[];
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  withClass = (classObj: any) => {
    this.class = classObj;
    return this;
  };

  validateClass = () => {
    if (this.class == undefined || this.class == null) {
      this.errors = [
        ...this.errors,
        "class object must be set - set with .withClass(class)",
      ];
    }
  };

  do = () => {
    this.validateClass();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/schema`;
    return this.client.post(path, this.class);
  };
}
