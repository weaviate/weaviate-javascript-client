import { isValidStringProperty } from "../validation/string";
import Connection from "../connection";

export default class ReferencePayloadBuilder {
  private client: Connection;
  private errors: any[];
  private className?: string;
  private id: any;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  withId = (id: any) => {
    this.id = id;
    return this;
  };

  withClassName(className: string) {
    this.className = className;
    return this;
  }

  validateIsSet = (prop: string | any[] | null | undefined, name: string, setter: string) => {
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
