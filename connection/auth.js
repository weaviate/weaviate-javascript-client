export class Authenticator {
  constructor(http, creds) {
    this.http = http;
    this.creds = creds;
    this.bearer = "";
    this.expirationEpoch = 0
  }

  refresh = async (localConfig) => {
    var config = await this.getOpenidConfig(localConfig);
  
    if (this.creds instanceof AuthUserPasswordCredentials) {
      return new UserPasswordAuthenticator(this.http, this.creds, config)
        .refresh()
        .then(resp => {
          this.bearer = resp.bearer;
          this.expirationEpoch = resp.expirationEpoch;
        });
    }

    // TODO: Future authentication flows go here

    throw new Error("unsupported credential type");
  };

  getOpenidConfig = async (localConfig) => {
    return this.http.externalGet(localConfig.href)
      .then(openidProviderConfig => {
        return {
          clientId: localConfig.clientId, 
          provider: openidProviderConfig
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
  constructor(http, creds, config) {
    this.http = http;
    this.creds = creds;
    this.openidConfig = config;
  }

  refresh = () => {
    return this.requestAccessToken()
      .then(tokenResp => {
        return {
          bearer: tokenResp.access_token,
          expirationEpoch: Date.now() + tokenResp.expires_in - 2 // -2 for some lag time
        };
      })
      .catch(err => {
        return Promise.reject(
          new Error(`failed to refresh access token: ${err}`)
        );
      });
  }

  requestAccessToken = () => {
    if (!this.openidConfig.provider.grant_types_supported.includes("password")) {
      throw new Error("grant_type password not supported");
    }
    var url = this.openidConfig.provider.token_endpoint;
    var params = new URLSearchParams({
      grant_type: "password",
      client_id: this.openidConfig.clientId,
      username: this.creds.username,
      password: this.creds.password
    });
    let contentType = "application/x-www-form-urlencoded;charset=UTF-8";
    return this.http.externalPost(url, params, contentType);
  };
}
