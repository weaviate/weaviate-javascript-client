import graphql from "./graphql/index.js";
import schema from "./schema/index.js";
import data from "./data/index.js";
import classifications from "./classifications/index.js";
import batch from "./batch/index.js";
import misc from "./misc/index.js";
import c11y from "./c11y/index.js";
import { KIND_THINGS, KIND_ACTIONS } from "./kinds";
import { DbVersionProvider, DbVersionSupport } from "./utils/dbVersion.js";
import backup from "./backup/index.js";
import backupConsts from "./backup/consts.js";
import batchConsts from "./batch/consts.js";
import filtersConsts from "./filters/consts.js";

const app = {
  client: function (params) {
    // check if the URL is set
    if (!params.host) throw new Error("Missing `host` parameter");

    // check if the scheme is set
    if (!params.scheme) throw new Error("Missing `scheme` parameter");

    // check if headers are set
    if (!params.headers) params.headers = {};

    const graphqlClient = require("graphql-client")({
      url: params.scheme + "://" + params.host + "/v1/graphql",
      headers: params.headers,
    });

    const httpClient = require("./httpClient.js")({
      baseUri: params.scheme + "://" + params.host + "/v1",
      headers: params.headers,
    });

    const dbVersionProvider = initDbVersionProvider(httpClient);
    const dbVersionSupport = new DbVersionSupport(dbVersionProvider);

    return {
      graphql: graphql(graphqlClient),
      schema: schema(httpClient),
      data: data(httpClient, dbVersionSupport),
      classifications: classifications(httpClient),
      batch: batch(httpClient, dbVersionSupport),
      misc: misc(httpClient, dbVersionProvider),
      c11y: c11y(httpClient),
      backup: backup(httpClient),
    };
  },

  // constants
  KIND_THINGS,
  KIND_ACTIONS,

  backup: backupConsts,
  batch: batchConsts,
  filters: filtersConsts,
};

function initDbVersionProvider(httpClient) {
  const metaGetter = misc(httpClient).metaGetter();
  const versionGetter = () => {
    return metaGetter.do()
      .then(result => result.version)
      .catch(() => Promise.resolve(""));
  }

  const dbVersionProvider = new DbVersionProvider(versionGetter);
  dbVersionProvider.refresh();

  return dbVersionProvider;
}

export default app;
module.exports = app;
