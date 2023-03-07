import { isValidStringProperty } from "../validation/string";
import {ObjectsPath} from "./path";
import Connection from "../connection";

export default class Updater {
  private client: Connection;
  private objectsPath: ObjectsPath;
  private errors: any[];
  private className?: string;
  private id?: string;
  private properties?: any[];
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

  withId = (id: string) => {
    this.id = id;
    return this;
  };

  withClassName = (className: string) => {
    this.className = className;
    return this;
  };

  validateClassName = () => {
    if (!isValidStringProperty(this.className)) {
      this.errors = [
        ...this.errors,
        "className must be set - use withClassName(className)",
      ];
    }
  };

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [
        ...this.errors,
        "id must be set - initialize with updater(id)",
      ];
    }
  };

  withConsistencyLevel = (cl: string) => {
    this.consistencyLevel = cl;
    return this;
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

    return this.objectsPath.buildUpdate(this.id!, this.className, this.consistencyLevel)
      .then((path: string) => this.client.put(path, this.payload()));
  };
}
