export default class Connection {
  constructor(params) {
    this.gql = require("graphql-client")({
      url: params.scheme + "://" + params.host + "/v1/graphql",
      headers: params.headers,
    });

    this.http = require("./httpClient.js")({
      baseUri: params.scheme + "://" + params.host + "/v1",
      headers: params.headers,
    });

    this.authClientSecret = params.authClientSecret;
  }

  post = (path, payload, expectReturnContent = true) => {
    return this.http.post(path, payload, expectReturnContent);
  };

  put = (path, payload, expectReturnContent = true) => {
    return this.http.put(path, payload, expectReturnContent);
  };

  patch = (path, payload) => {
    return this.http.patch(path, payload);
  };

  delete = (path, payload, expectReturnContent = false) => {
    return this.http.delete(path, payload, expectReturnContent)
  };
  
  head = (path, payload) => {
    return this.http.head(path, payload);
  };

  get = (path, expectReturnContent = true) => {
    return this.http.get(path, expectReturnContent);
  };

  getRaw = (path) => {
    return this.http.getRaw(path);
  };

  query = (query) => {
    return this.gql.query(query);
  };
}
