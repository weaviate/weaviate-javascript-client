import { AuthUserPasswordCredentials, AuthAccessTokenCredentials } from './auth.js';
import Connection from "./index.js";

const weaviate = require("../index");

describe("connection", () => {
  it("makes a logged-in request with username/password", async () => {
    if (process.env.WCS_DUMMY_CI_PW == undefined || process.env.WCS_DUMMY_CI_PW == "") {
      console.warn("Skipping because `WCS_DUMMY_CI_PW` is not set")
      return
    }

    const client = weaviate.client({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthUserPasswordCredentials({
        username: "ms_2d0e007e7136de11d5f29fce7a53dae219a51458@existiert.net",
        password: process.env.WCS_DUMMY_CI_PW
      })
    });

    return client.misc
      .metaGetter()
      .do()
      .then((res) => {
        expect(res.version).toBeDefined();;
      })
      .catch((e) => fail("it should not have errord: " + e));
  })

  it("makes a logged-in request with access token", async () => {
    const dummy = new Connection({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthUserPasswordCredentials({
        username: "ms_2d0e007e7136de11d5f29fce7a53dae219a51458@existiert.net",
        password: process.env.WCS_DUMMY_CI_PW
      })
    });
    // obtain access token with user/pass so we can
    // use it to test AuthAccessTokenCredentials
    await dummy.login();

    const client = weaviate.client({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthAccessTokenCredentials({
        accessToken: dummy.auth.bearerToken,
        expiresIn: 900
      })
    });

    return client.misc
      .metaGetter()
      .do()
      .then((res) => {
        expect(res.version).toBeDefined();;
      })
      .catch((e) => fail("it should not have errord: " + e));
  })

  it("uses refresh token to fetch new access token", async () => {
    const dummy = new Connection({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthUserPasswordCredentials({
        username: "ms_2d0e007e7136de11d5f29fce7a53dae219a51458@existiert.net",
        password: process.env.WCS_DUMMY_CI_PW
      })
    });
    // obtain access token with user/pass so we can
    // use it to test AuthAccessTokenCredentials
    await dummy.login();

    const conn = new Connection({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthAccessTokenCredentials({
        accessToken: dummy.auth.bearerToken,
        refreshToken: dummy.auth.refreshToken
      })
    });
    // force the use of refreshToken
    conn.auth.expirationEpoch = 0

    return conn.login()
      .then(resp => {
        expect(resp).toBeDefined()
        expect(resp != "").toBeTruthy()
      })
      .catch((e) => fail("it should not have errord: " + e));
  })
})
