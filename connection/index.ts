import {Authenticator} from './auth';
import OpenidConfigurationGetter from "../misc/openidConfigurationGetter.js";

import httpClient from './httpClient';
import gqlClient from './gqlClient';
import {IConnectionParams} from "../index";

export interface IHttpClient { patch: (path: string, payload: any, bearerToken?: string) => any; head: (path: string, payload: any, bearerToken?: string) => any; post: (path: string, payload: any, expectReturnContent?: boolean, bearerToken?: string) => any; get: (path: string, expectReturnContent?: boolean, bearerToken?: string) => any; externalPost: (externalUrl: string, body: any, contentType: any) => any; getRaw: (path: string, bearerToken?: string) => any; delete: (path: string, payload: any, expectReturnContent?: boolean, bearerToken?: string) => any; put: (path: string, payload: any, expectReturnContent?: boolean, bearerToken?: string) => any; externalGet: (externalUrl: string) => any };

export default class Connection {
  private auth: any;
  private readonly authEnabled: boolean;
  private gql: { query: (query: any, headers?: {}) => Promise<{ data: any }> };
  private readonly http: IHttpClient

  constructor(params: IConnectionParams) {
    this.http = httpClient(params);
    this.gql = gqlClient(params)

    this.authEnabled = (params.authClientSecret !== undefined)
    if (this.authEnabled) {
      this.auth = new Authenticator(this.http, params.authClientSecret);
    }
  }

  post = (path: string, payload: any, expectReturnContent = true) => {
    if (this.authEnabled) {
      return this.login().then(
        token => this.http.post(path, payload, expectReturnContent, token))
    }
    return this.http.post(path, payload, expectReturnContent);
  };

  put = (path: string, payload: any, expectReturnContent = true) => {
    if (this.authEnabled) {
      return this.login().then(
        token => this.http.put(path, payload, expectReturnContent, token))
    }
    return this.http.put(path, payload, expectReturnContent);
  };

  patch = (path: string, payload: any) => {
    if (this.authEnabled) {
      return this.login().then(
        token => this.http.patch(path, payload, token))
    }
    return this.http.patch(path, payload);
  };

  delete = (path: string, payload: any, expectReturnContent = false) => {
    if (this.authEnabled) {
      return this.login().then(
        token => this.http.delete(path, payload, expectReturnContent, token))
    }
    return this.http.delete(path, payload, expectReturnContent)
  };

  head = (path: string, payload: any) => {
    if (this.authEnabled) {
      return this.login().then(
        token => this.http.head(path, payload, token))
    }
    return this.http.head(path, payload);
  };

  get = (path: string, expectReturnContent: boolean = true) => {
    if (this.authEnabled) {
      return this.login().then(
        token => this.http.get(path, expectReturnContent, token))
    }
    return this.http.get(path, expectReturnContent);
  };

  getRaw = (path: string) => {
    if (this.authEnabled) {
      return this.login().then(
        token => this.http.getRaw(path, token));
    }
    return this.http.getRaw(path);
  };

  query = (query: any) => {
    if (this.authEnabled) {
      return this.login().then(
        token => {
          var headers = {Authorization: `Bearer ${token}`};
          return this.gql.query(query, headers);
        });
    }
    return this.gql.query(query);
  };

  login = async () => {
    const localConfig = await new OpenidConfigurationGetter(this.http).do()
      .then((resp: any) => resp);

    if (localConfig === undefined) {
      console.warn("client is configured for authentication, but server is not");
      return "";
    }

    if (Date.now() >= this.auth.expiresAt) {
      await this.auth.refresh(localConfig);
    }
    return this.auth.accessToken;
  };
}
