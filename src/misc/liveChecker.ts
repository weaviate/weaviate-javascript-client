export default class LiveChecker {
  client: any;
  dbVersionProvider: any;
  constructor(client: any, dbVersionProvider: any) {
    this.client = client;
    this.dbVersionProvider = dbVersionProvider;
  }

  do = () => {
    return this.client
      .get("/.well-known/live", false)
      .then(() => {
        setTimeout(() => this.dbVersionProvider.refresh());
        return Promise.resolve(true);
      })
      .catch(() => Promise.resolve(false));
  };
}
