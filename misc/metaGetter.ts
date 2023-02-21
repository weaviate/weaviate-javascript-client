import Connection from "../connection";

export default class MetaGetter {
  private client: Connection;
  constructor(client: Connection) {
    this.client = client;
  }

  do = () => {
    return this.client.get("/meta", true);
  };
}
