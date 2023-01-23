import { OidcClient, OAuth2Token } from "oidc-client-ts"
import { OAuth2Client } from "@badgateway/oauth2-client"

export class Authenticator {
  constructor(http, creds) {
    this.http = http;
    this.creds = creds;
    this.accessToken = "";
    this.refreshToken = "";
    this.expiresAt = 0
    this.refreshRunning = false;

    // If the authentication method is access token,
    // our bearer token is already available for use
    if (this.creds instanceof AuthAccessTokenCredentials) {
      this.accessToken = this.creds.accessToken;
      this.expiresAt = calcExpirationEpoch(this.creds.expiresIn);
      this.refreshToken = this.creds.refreshToken;
    }
  }

  refresh = async (localConfig) => {
    let config = await this.getOpenidConfig(localConfig);

    this.client = new OAuth2Client({
      server: config.provider.issuer,
      clientId: config.clientId,
      tokenEndpoint: config.provider.token_endpoint,
      discoveryEndpoint: config.metadataUrl,
      authenticationMethod: "client_secret_post"
    })

    var authenticator;
    switch (this.creds.constructor) {
      case AuthUserPasswordCredentials:
        authenticator = new UserPasswordAuthenticator(this.client, this.creds, config);
        break;
      case AuthAccessTokenCredentials:
        authenticator = new AccessTokenAuthenticator(this.client, this.creds, config);
        break;
      case AuthClientCredentials:
        authenticator = new ClientCredentialsAuthenticator(this.client, this.creds, config);
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
        let scope = localConfig.scopes;
        return {
          clientId: localConfig.clientId,
          scope: scope,
          metadataUrl: localConfig.href,
          provider: openidProviderConfig
        };
      });
  };

  postRefresh = (refreshResp) => {
    this.accessToken = refreshResp.accessToken;
    this.expiresAt = refreshResp.expiresAt;
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
      if (this.expiresAt - Date.now() <= 60_000) {
        let resp = await this.client.refreshToken({
          accessToken: this.accessToken,
          expiresAt: this.expiresAt,
          refreshToken: this.refreshToken,
        });
        this.accessToken = resp.accessToken;
        this.expiresAt = resp.expiresAt;
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
          accessToken: tokenResp.accessToken,
          expiresAt: tokenResp.expiresAt,
          refreshToken: tokenResp.refreshToken
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
    this.openidConfig.scope.push("offline_access")
    return await this.client.password({
      username: this.creds.username,
      password: this.creds.password,
      scope: this.openidConfig.scope
    });
  };
}

export class AuthAccessTokenCredentials {
  constructor(creds) {
    this.validate(creds);
    this.accessToken = creds.accessToken;
    this.expiresAt = calcExpirationEpoch(creds.expiresIn);
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
          accessToken: this.creds.accessToken,
          expiresAt: this.creds.expiresAt
      });
    }
    this.validateOpenidConfig();
    return this.requestAccessToken()
      .then(tokenResp => {
        return {
          accessToken: tokenResp.accessToken,
          expiresAt: tokenResp.expiresAt,
          refreshToken: tokenResp.refreshToken
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
    return await this.client.refreshToken({
      accessToken: this.creds.accessToken,
      expiresAt: this.creds.expiresAt,
      refreshToken: this.creds.refreshToken,
    });
  };
}

export class AuthClientCredentials {
  constructor(creds) {
    this.clientSecret = creds.clientSecret;
  }
}

class ClientCredentialsAuthenticator {
  constructor(client, creds, config) {
    this.client = client;
    this.creds = creds;
    this.openidConfig = config;
  }

  refresh = () => {
    return this.requestAccessToken()
      .then(tokenResp => {
        // clear the username/password, as they're no longer needed
        delete this.creds;
        return {
          accessToken: tokenResp.accessToken,
          expiresAt: tokenResp.expiresAt,
          refreshToken: tokenResp.refreshToken
        };
      })
      .catch(err => {
        return Promise.reject(
          new Error(`failed to refresh access token: ${err}`)
        );
      });
  };

  requestAccessToken = async () => {
    this.client.settings.clientSecret = this.creds.clientSecret;
    return await this.client.clientCredentials();
  };
}

function calcExpirationEpoch(expiresIn) {
  return Date.now() + ((expiresIn - 2) * 1000); // -2 for some lag
}
