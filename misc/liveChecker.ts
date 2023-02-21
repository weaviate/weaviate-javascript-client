import Connection from "../connection";
import {DbVersionProvider} from "../utils/dbVersion";

export default class LiveChecker {
  private client: Connection;
  private dbVersionProvider: DbVersionProvider;
  constructor(client: Connection, dbVersionProvider: DbVersionProvider) {
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
