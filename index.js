const {get} = require('./graphql');
const schema = require('./schema');
const {KIND_THINGS, KIND_ACTIONS} = require('./kinds');

module.exports = {
  client: function (params) {
    // check if the URL is set
    if (!params.host) throw new Error('Missing `host` parameter');

    // check if the scheme is set
    if (!params.scheme) throw new Error('Missing `scheme` parameter');

    // check if headers are set
    if (!params.headers) params.headers = {};

    const graphqlClient = require('graphql-client')({
      url: params.scheme + '://' + params.host + '/v1/graphql',
      headers: params.headers,
    });

    const httpClient = require('./httpClient.js')({
      baseUri: params.scheme + '://' + params.host + '/v1',
      headers: params.headers,
    });

    return {
      graphql: {
        get: get(graphqlClient),
      },

      schema: schema(httpClient),
    };
  },

  // constants
  KIND_THINGS,
  KIND_ACTIONS,
};
