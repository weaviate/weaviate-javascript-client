import { isValidStringProperty } from "../validation/string";
import Connection from "../connection";

export default class Validator {
  private client: Connection;
  private errors: any[];
  private id: any;
  private properties?: any[];
  private className?: string;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  withClassName = (className: string) => {
    this.className = className;
    return this;
  };

  withProperties = (properties: any[]) => {
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
