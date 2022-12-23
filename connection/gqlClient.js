import graphqlClient from 'graphql-client';

export const gqlClient = (config) => {
    const scheme = config.scheme
    const host = config.host
    const defaultHeaders = config.headers
    return {
      query: (query, headers = {}) => {
      var gql = graphqlClient({
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

export default gqlClient;