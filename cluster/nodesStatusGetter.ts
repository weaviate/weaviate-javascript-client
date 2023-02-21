import Connection from "../connection";

export default class NodesStatusGetter {
  private client: Connection;

  constructor(client: Connection) {
    this.client = client;
  }

  do() {
    return this.client.get("/nodes");
  };
}
