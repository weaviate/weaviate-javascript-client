import { OidcClient } from "oidc-client-ts"

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
    let config = await this.getOpenidConfig(localConfig);

    let client = new OidcClient({
      client_id: config.clientId,
      authority: config.provider.issuer,
      metadataUrl: config.metadataUrl
    })

    var authenticator;
    switch (this.creds.constructor) {
      case AuthUserPasswordCredentials:
        authenticator = new UserPasswordAuthenticator(client, this.creds, config);
        break;
      case AuthAccessTokenCredentials:
        authenticator = new AccessTokenAuthenticator(client, this.creds, config);
        break;
      case AuthClientCredentials:
        authenticator = new ClientCredentialsAuthenticator(client, this.creds, config);
        break;
      default:
        throw new Error("unsupported credential type");
    }

    return authenticator.refresh()
      .then(this.postRefresh)
  };

  getOpenidConfig = async (localConfig) => {
    return this.http.externalGet(localConfig.href)
      .then(openidProviderConfig => {
        let scope = localConfig.scopes.join(" ");
        return {
          clientId: localConfig.clientId,
          scope: scope,
          metadataUrl: localConfig.href,
          provider: openidProviderConfig
        };
      });
  };

  postRefresh = (refreshResp) => {
    this.bearerToken = refreshResp.bearerToken;
    this.expirationEpoch = refreshResp.expirationEpoch;
    this.refreshToken = refreshResp.refreshToken;
    if (!this.refreshRunning) {
      this.runBackgroundTokenRefresh();
      this.refreshRunning = true;
    }
  };

  runBackgroundTokenRefresh = () => {
    setInterval(async () => { 
      // check every 30s if the token will expire in <= 1m,
      // if so, refresh
      if (this.expirationEpoch - Date.now() <= 60_000) {
        let resp = await this.client.useRefreshToken({ 
          state: {
            refresh_token: this.creds.refreshToken,
            scope: this.openidConfig.scope
          }
        });
        this.bearerToken = resp.access_token;
        this.expirationEpoch = resp.expires_at;
        this.refreshToken = resp.refresh_token;
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
  constructor(client, creds, config) {
    this.client = client;
    this.creds = creds;
    this.openidConfig = config;
  }

  refresh = () => {
    this.validateOpenidConfig();
    return this.requestAccessToken()
      .then(tokenResp => {
        // clear the username/password, as they're no longer needed
        delete this.creds;
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

  requestAccessToken = async () => {
    return await this.client.processResourceOwnerPasswordCredentials({
      username: this.creds.username,
      password: this.creds.password,
    });
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
  constructor(client, creds, config) {
    this.client = client;
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

  requestAccessToken = async () => {
    return await this.client.useRefreshToken({ 
      state: {
        refresh_token: this.creds.refreshToken,
        scope: this.openidConfig.scope
      }
    });
  };
}

export class AuthClientCredentials {
  
}

class ClientCredentialsAuthenticator {

}

function calcExpirationEpoch(expiresIn) {
  return Date.now() + ((expiresIn - 2) * 1000); // -2 for some lag
}
