import { GraphQLClient } from 'graphql-request'
import {IConnectionParams} from "../index";

export interface IGraphQLClient {
  query: (query: any, headers?: {}) => Promise<{ data: any }>
}

export const gqlClient = (config: IConnectionParams): IGraphQLClient => {
    const scheme = config.scheme
    const host = config.host
    const defaultHeaders = config.headers
    return {
      // for backward compatibility with replaced graphql-client lib,
      // results are wrapped into { data: data }
      query: (query: any, headers = {}) => {
        return new GraphQLClient(`${scheme}://${host}/v1/graphql`, {
          headers: {
            ...defaultHeaders,
            ...headers,
          }
        })
        .request(query)
        .then(data => ({ data }));
    }
  }
}

export default gqlClient;
