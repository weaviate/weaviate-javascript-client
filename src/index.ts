import Connection from "./connection/index"
import graphql from "./graphql/index";
import schema from "./schema/index";
import data from "./data/index";
import classifications from "./classifications/index";
import batch from "./batch/index";
import misc from "./misc/index";
import c11y from "./c11y/index";
import { DbVersionProvider, DbVersionSupport } from "./utils/dbVersion";
import backup from "./backup/index";
import backupConsts from "./backup/consts";
import batchConsts from "./batch/consts";
import filtersConsts from "./filters/consts";
import cluster from "./cluster/index";
import clusterConsts from "./cluster/consts";
import replicationConsts from "./data/replication/consts";
import { AuthAccessTokenCredentials, AuthUserPasswordCredentials } from "./connection/auth";

const app = {
  client: function (params: any) {
    // check if the URL is set
    if (!params.host) throw new Error("Missing `host` parameter");

    // check if the scheme is set
    if (!params.scheme) throw new Error("Missing `scheme` parameter");

    // check if headers are set
    if (!params.headers) params.headers = {};

    const conn = new Connection(params);
    const dbVersionProvider = initDbVersionProvider(conn);
    const dbVersionSupport = new DbVersionSupport(dbVersionProvider);

    return {
      graphql: graphql(conn),
      schema: schema(conn),
      data: data(conn, dbVersionSupport),
      classifications: classifications(conn),
      batch: batch(conn, dbVersionSupport),
      misc: misc(conn, dbVersionProvider),
      c11y: c11y(conn),
      backup: backup(conn),
      cluster: cluster(conn),
    };
  },

  // constants
  backup: backupConsts,
  batch: batchConsts,
  filters: filtersConsts,
  cluster: clusterConsts,
  replication: replicationConsts,
};

function initDbVersionProvider(conn: any) {
  // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
  const metaGetter = misc(conn).metaGetter();
  const versionGetter = () => {
    return metaGetter.do()
      .then((result: any) => result.version)
      .catch(() => Promise.resolve(""));
  }

  const dbVersionProvider = new DbVersionProvider(versionGetter);
  dbVersionProvider.refresh();

  return dbVersionProvider;
}

export default app;
export { AuthUserPasswordCredentials, AuthAccessTokenCredentials };
module.exports = app;
module.exports.AuthUserPasswordCredentials = AuthUserPasswordCredentials;
module.exports.AuthAccessTokenCredentials = AuthAccessTokenCredentials;
