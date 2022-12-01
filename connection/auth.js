export class Authenticator {
  constructor(http, creds) {
    this.http = http;
    this.creds = creds;
    this.bearer = "";
    this.expirationEpoch = 0
  }

  refresh = () => {
    if (this.creds instanceof AuthUserPasswordCredentials) {
      return new UserPasswordAuthenticator(this.http, this.creds, this.getOpenidConfig)
        .refresh()
        .then(resp => {
          this.bearer = resp.bearer;
          this.expirationEpoch = resp.expirationEpoch;
        });
    }

    // TODO: Future authentication flows go here

    throw new Error("unsupported credential type");
  };

  getOpenidConfig = () => {
    return this.http.get("/.well-known/openid-configuration")
      .then(async openidConfig => {
        var provider = await this.http.externalGet(openidConfig.href)
        return {
          clientId: openidConfig.clientId,
          provider: provider 
        };
      });
  };
}

export class AuthUserPasswordCredentials {
  constructor(creds) {
    this.username = creds.username;
    this.password = creds.password;
  }
}

class UserPasswordAuthenticator {
  constructor(http, creds, configFn) {
    this.http = http;
    this.creds = creds;
    this.configFn = configFn;
  }

  refresh = () => {
    return this.configFn()
      .then(config => this.requestAccessToken(config))
      .then(tokenResp => {
        return {
          bearer: tokenResp.access_token,
          expirationEpoch: Date.now() + tokenResp.expires_in - 2 // -2 for some lag time
        };
      })
      .catch(err => {
        console.debug(`failed: ${err}`);
        return Promise.reject(
          new Error(`failed to refresh access token: ${err}`)
        );
      });
  }

  requestAccessToken = (openidConfig) => {
    if (!openidConfig.provider.grant_types_supported.includes("password")) {
      throw new Error("grant_type password not supported")
    }
    var url = openidConfig.provider.token_endpoint
    var params = new URLSearchParams({
      grant_type: "password",
      client_id: openidConfig.clientId,
      username: this.creds.username,
      password: this.creds.password
    })
    let contentType = "application/x-www-form-urlencoded;charset=UTF-8";
    return this.http.externalPost(url, params, contentType);
  };
}
