import {DbVersionProvider} from "../utils/dbVersion";
import Connection from "../connection";

export default class ReadyChecker {
  private client: Connection;
  private dbVersionProvider: DbVersionProvider;
  constructor(client: Connection, dbVersionProvider: DbVersionProvider) {
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
