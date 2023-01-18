export default class ReadyChecker {
  client: any;
  dbVersionProvider: any;
  constructor(client: any, dbVersionProvider: any) {
    this.client = client;
    this.dbVersionProvider = dbVersionProvider;
  }

  do = () => {
    return this.client
      .get("/.well-known/ready", false)
      .then(() => {
        setTimeout(() => this.dbVersionProvider.refresh());
        return Promise.resolve(true);
      })
      .catch(() => Promise.resolve(false));
  };
}
