import Connection from "../connection";

export default class Getter {
  private client: Connection;
  private errors: any[];

  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/schema`;
    return this.client.get(path);
  };
}
