export class Authenticator {
  constructor(http, creds) {
    this.http = http;
    this.creds = creds;
    this.bearerToken = "";
    this.refreshToken = "";
    this.expirationEpoch = 0
    this.refreshRunning = false;

    // If the authentication method is access token,
    // our bearer token is already available for use
    if (this.creds instanceof AuthAccessTokenCredentials) {
      this.bearerToken = this.creds.accessToken;
      this.expirationEpoch = calcExpirationEpoch(this.creds.expiresIn);
      this.refreshToken = this.creds.refreshToken;
    }
  }

  refresh = async (localConfig) => {
    var config = await this.getOpenidConfig(localConfig);

    var authenticator;
    switch (this.creds.constructor) {
      case AuthUserPasswordCredentials:
        authenticator = new UserPasswordAuthenticator(this.http, this.creds, config);
        break;
      case AuthAccessTokenCredentials:
        authenticator = new AccessTokenAuthenticator(this.http, this.creds, config);
        break;
      case AuthClientCredentials:
        authenticator = new ClientCredentialsAuthenticator(this.http, this.creds, config);
        break;
      default:
        throw new Error("unsupported credential type");
    }

    return authenticator.refresh()
      .then(resp => {
        this.bearerToken = resp.bearerToken;
        this.expirationEpoch = resp.expirationEpoch;
        this.refreshToken = resp.refreshToken;
        if (!this.refreshRunning) {
          this.runBackgroundTokenRefresh(authenticator);
          this.refreshRunning = true;
        }
      });
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

  runBackgroundTokenRefresh = (authenticator) => {
    setInterval(async () => { 
      // check every 30s if the token will expire in <= 1m,
      // if so, refresh
      if (this.expirationEpoch - Date.now() <= 60_000) {
        var resp = await authenticator.refresh();
        this.bearerToken = resp.bearerToken;
        this.expirationEpoch = resp.expirationEpoch;
        this.refreshToken = resp.refreshToken;
      }
    }, 30_000)
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
    this.validateOpenidConfig();
    return this.requestAccessToken()
      .then(tokenResp => {
        return {
          bearerToken: tokenResp.access_token,
          expirationEpoch: calcExpirationEpoch(tokenResp.expires_in),
          refreshToken: tokenResp.refresh_token
        };
      })
      .catch(err => {
        return Promise.reject(
          new Error(`failed to refresh access token: ${err}`)
        );
      });
  };

  requestAccessToken = () => {
    var url = this.openidConfig.provider.token_endpoint;
    var params = new URLSearchParams({
      grant_type: "password",
      client_id: this.openidConfig.clientId,
      username: this.creds.username,
      password: this.creds.password,
      scope: "openid offline_access"
    });
    let contentType = "application/x-www-form-urlencoded;charset=UTF-8";
    return this.http.externalPost(url, params, contentType);
  };

  validateOpenidConfig = () => {
    if (this.openidConfig.provider.grant_types_supported !== undefined &&
      !this.openidConfig.provider.grant_types_supported.includes("password")) {
        throw new Error("grant_type password not supported");
      }
    if (this.openidConfig.provider.token_endpoint.includes(
      "https://login.microsoftonline.com")) {
        throw new Error("microsoft/azure recommends to avoid authentication using "+
          "username and password, so this method is not supported by this client");
      }
  };
}

export class AuthAccessTokenCredentials {
  constructor(creds) {
    this.validate(creds);
    this.accessToken = creds.accessToken;
    this.expirationEpoch = calcExpirationEpoch(creds.expiresIn);
    this.refreshToken = creds.refreshToken;
  }

  validate = (creds) => {
    if (creds.expiresIn === undefined) {
      throw new Error("AuthAccessTokenCredentials: expiresIn is required");
    }
    if (!Number.isInteger(creds.expiresIn) || creds.expiresIn <= 0) {
      throw new Error("AuthAccessTokenCredentials: expiresIn must be int > 0");
    }
  };
}

class AccessTokenAuthenticator {
  constructor(http, creds, config) {
    this.http = http;
    this.creds = creds;
    this.openidConfig = config;
  }

  refresh = () => {
    if (this.creds.refreshToken === undefined || this.creds.refreshToken == "") {
      console.warn("AuthAccessTokenCredentials not provided with refreshToken, cannot refresh");
      return Promise.resolve({
          bearerToken: this.creds.accessToken,
          expirationEpoch: this.creds.expirationEpoch
      });
    }
    this.validateOpenidConfig();
    return this.requestAccessToken()
      .then(tokenResp => {
        return {
          bearerToken: tokenResp.access_token,
          expirationEpoch: calcExpirationEpoch(tokenResp.expires_in),
          refreshToken: tokenResp.refresh_token
        };
      })
      .catch(err => {
        return Promise.reject(
          new Error(`failed to refresh access token: ${err}`)
        );
      });
  };

  validateOpenidConfig = () => {
    if (this.openidConfig.provider.grant_types_supported === undefined ||
      !this.openidConfig.provider.grant_types_supported.includes("refresh_token")) {
        throw new Error("grant_type refresh_token not supported");
      }
  };

  requestAccessToken = () => {
    var url = this.openidConfig.provider.token_endpoint;
    var params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: this.openidConfig.clientId,
      refresh_token: this.creds.refreshToken,
    });
    let contentType = "application/x-www-form-urlencoded;charset=UTF-8";
    return this.http.externalPost(url, params, contentType);
  };
}

export class AuthClientCredentials {
  
}

class ClientCredentialsAuthenticator {

}

function calcExpirationEpoch(expiresIn) {
  return Date.now() + ((expiresIn - 2) * 1000) // -2 for some lag
}
