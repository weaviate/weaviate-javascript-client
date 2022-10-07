export default class NodesGetter {

  constructor(client) {
    this.client = client;
  }

  do() {
    return this.client.get("/nodes");
  };
}
