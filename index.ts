import Connection from "./connection/index"
import graphql, {IClientGraphQL} from "./graphql/index";
import schema, {IClientSchema} from "./schema/index";
import data, {IClientData} from "./data/index";
import classifications, {IClientClassifications} from "./classifications/index";
import batch, {IClientBatch} from "./batch/index";
import misc, {IClientMisc} from "./misc/index";
import c11y, {IClientC11y} from "./c11y/index";
import {DbVersionProvider, DbVersionSupport} from "./utils/dbVersion";
import backup, {IClientBackup} from "./backup/index";
import backupConsts from "./backup/consts";
import batchConsts from "./batch/consts";
import filtersConsts from "./filters/consts";
import cluster, {IClientCluster} from "./cluster/index";
import clusterConsts from "./cluster/consts";
import replicationConsts from "./data/replication/consts";
import {AuthAccessTokenCredentials, AuthUserPasswordCredentials} from "./connection/auth";

export interface IConnectionParams {
  authClientSecret?: boolean;
  host: string
  scheme: string
  headers?: any
}

export interface  IClient {
  graphql: IClientGraphQL,
  schema: IClientSchema,
  data: IClientData,
  classifications: IClientClassifications,
  batch: IClientBatch,
  misc: IClientMisc,
  c11y: IClientC11y,
  backup: IClientBackup,
  cluster: IClientCluster
}
const app = {
  client: function (params: IConnectionParams): IClient {
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

function initDbVersionProvider(conn: Connection) {
  // FIXME 'misc' requires a conneciton and the DbVersionProvider that itself requires misc().metaGetter :thinking:
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

export default app
export { AuthUserPasswordCredentials, AuthAccessTokenCredentials };
