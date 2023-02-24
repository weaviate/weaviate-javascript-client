import Connection from "../connection";
import {isValidStringProperty} from "../validation/string";
import {ObjectsPath} from "./path";

export default class Merger {
  private client: Connection;
  private objectsPath: ObjectsPath;
  private errors: any[];
  private className?: string;
  private properties?: any[];
  private id?: string;
  private consistencyLevel?: string
  constructor(client: Connection, objectsPath: ObjectsPath) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
  }

  withProperties = (properties: any[]) => {
    this.properties = properties;
    return this;
  };

  withClassName = (className: string) => {
    this.className = className;
    return this;
  };

  withId = (id: string) => {
    this.id = id;
    return this;
  };

  withConsistencyLevel = (cl: string) => {
    this.consistencyLevel = cl;
    return this;
  };

  validateClassName = () => {
    if (!isValidStringProperty(this.className)) {
      this.errors = [
        ...this.errors,
        "className must be set - set with withClassName(className)",
      ];
    }
  };

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [...this.errors, "id must be set - set with withId(id)"];
    }
  };

  payload = () => ({
    properties: this.properties,
    class: this.className,
    id: this.id,
  });

  validate = () => {
    this.validateClassName();
    this.validateId();
  };

  do = () => {
    this.validate();

    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.objectsPath.buildMerge(this.id!, this.className!, this.consistencyLevel!)
      .then((path: string) => this.client.patch(path, this.payload()));
  };
}
