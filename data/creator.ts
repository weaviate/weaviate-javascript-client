import { isValidStringProperty } from "../validation/string";
import Connection from "../connection";
import {ObjectsPath} from "./path";

export default class Creator {
  private client: Connection;
  private objectsPath: ObjectsPath;
  private errors: any[];
  private vector: any;
  private className?: string;
  private properties?: any;
  private id?: string;
  private consistencyLevel?: string
  constructor(client: Connection, objectsPath: ObjectsPath) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
  }

  withVector = (vector: any) => {
    this.vector = vector;
    return this;
  };

  withClassName = (className: string) => {
    this.className = className;
    return this;
  };

  withProperties = (properties: any) => {
    this.properties = properties;
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
        "className must be set - set with .withClassName(className)",
      ];
    }
  };

  payload = () => ({
    vector: this.vector,
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

    return this.objectsPath.buildCreate(this.consistencyLevel)
      .then((path: string) => this.client.post(path, this.payload()))
  };
}
