export default class NodesStatusGetter {
  client: any;

  constructor(client: any) {
    this.client = client;
  }

  do() {
    return this.client.get("/nodes");
  }
}
