import Connection from "../connection";
import {ObjectsPath} from "./path";

export default class Getter {
  private client: Connection;
  private objectsPath: ObjectsPath;
  private errors: any[];
  private additionals: any[];
  private className?: string;
  private limit: any;
  private after: string
  constructor(client: Connection, objectsPath: ObjectsPath) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
    this.additionals = [];
  }

  withClassName = (className: string) => {
    this.className = className;
    return this;
  };

  withAfter = (id: string) => {
    this.after = id;
    return this;
  };

  withLimit = (limit: any) => {
    this.limit = limit;
    return this;
  };

  extendAdditionals = (prop: any) => {
    this.additionals = [...this.additionals, prop];
    return this;
  };

  withAdditional = (additionalFlag: any) => this.extendAdditionals(additionalFlag);

  withVector = () => this.extendAdditionals("vector");

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.objectsPath.buildGet(this.className, this.limit, 
      this.additionals, this.after)
      .then(this.client.get);
  };
}
