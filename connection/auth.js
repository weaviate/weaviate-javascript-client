export class AuthCredentials {}

export class AuthUserPasswordCredentials extends AuthCredentials {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

export class Authenticator {
  constructor(http, creds) {
    this.http = http;
    this.creds = creds;
    this.bearer = "";
    this.expirationEpoch = 0
  }

  refresh = () => {
    return this.http.get("/.well-known/openid-configuration")
      .then(localOpenIdConfig => this.getRemoteOpenIdConfig(localOpenIdConfig))
      .then(remoteOpenIdConfig => this.requestAccessToken(remoteOpenIdConfig))
      .then(tokenResp => {
        this.bearer = tokenResp.access_token;
        this.expirationEpoch = Date.now() + tokenResp.expires_in + 2
      })
      .catch(err => {
        console.debug(`failed: ${err}`);
        return Promise.reject(
          new Error(`failed to refresh access token: ${err}`)
        );
      });
  };

  getRemoteOpenIdConfig = (localOpenIdConfig) => {
    this.clientId = localOpenIdConfig.clientId;
    return this.http.externalGet(localOpenIdConfig.href)
  };

  requestAccessToken = (remoteOpenIdConfig) => {
    if (!remoteOpenIdConfig.grant_types_supported.includes("password")) {
      throw new Error("grant_type password not supported")
    }
    var url = remoteOpenIdConfig.token_endpoint
    var params = new URLSearchParams({
      grant_type: "password",
      client_id: this.clientId,
      username: this.creds.username,
      password: this.creds.password
    })
    let contentType = "application/x-www-form-urlencoded;charset=UTF-8";
    return this.http.externalPost(url, params, contentType);
  };
}
