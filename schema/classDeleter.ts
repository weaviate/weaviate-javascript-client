import { isValidStringProperty } from "../validation/string";
import Connection from "../connection";

export default class ClassDeleter {
  private client: Connection;
  private errors: any[];
  private className?: string;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  withClassName = (className: string) => {
    this.className = className;
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
    const path = `/schema/${this.className}`;
    return this.client.delete(path, undefined, false);
  };
}
