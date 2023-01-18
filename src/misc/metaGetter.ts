export default class MetaGetter {
  client: any;
  constructor(client: any) {
    this.client = client;
  }

  do = () => {
    return this.client.get("/meta", true);
  };
}
