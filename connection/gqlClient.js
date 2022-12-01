const client = (config) => {
    const scheme = config.scheme
    const host = config.host
    const defaultHeaders = config.headers
    return {
      query: (query, headers = {}) => {
      var gql = require("graphql-client")({
        url: `${scheme}://${host}/v1/graphql`,
        headers: {
          ...defaultHeaders,
          ...headers,
        }
      });
      return gql.query(query);
    }
  }
}

module.exports = client;
