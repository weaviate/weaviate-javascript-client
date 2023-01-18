import { AuthUserPasswordCredentials, AuthAccessTokenCredentials } from './auth.js';
import Connection from "./index.js";

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const weaviate = require("../index");

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("connection", () => {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("makes an Okta logged-in request with username/password", async () => {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    if (process.env.OKTA_DUMMY_CI_PW == undefined || process.env.OKTA_DUMMY_CI_PW == "") {
      console.warn("Skipping because `OKTA_DUMMY_CI_PW` is not set");
      return;
    }

    const client = weaviate.client({
      scheme: "http",
      host: "localhost:8082",
      authClientSecret: new AuthUserPasswordCredentials({
        username: "test@test.de",
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        password: process.env.OKTA_DUMMY_CI_PW
      })
    });

    return client.misc
      .metaGetter()
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.version).toBeDefined();;
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("makes a WCS logged-in request with username/password", async () => {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    if (process.env.WCS_DUMMY_CI_PW == undefined || process.env.WCS_DUMMY_CI_PW == "") {
      console.warn("Skipping because `WCS_DUMMY_CI_PW` is not set");
      return;
    }

    const client = weaviate.client({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthUserPasswordCredentials({
        username: "ms_2d0e007e7136de11d5f29fce7a53dae219a51458@existiert.net",
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        password: process.env.WCS_DUMMY_CI_PW
      })
    });

    return client.misc
      .metaGetter()
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.version).toBeDefined();;
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("makes a logged-in request with access token", async () => {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    if (process.env.WCS_DUMMY_CI_PW == undefined || process.env.WCS_DUMMY_CI_PW == "") {
      console.warn("Skipping because `WCS_DUMMY_CI_PW` is not set");
      return;
    }

    const dummy = new Connection({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthUserPasswordCredentials({
        username: "ms_2d0e007e7136de11d5f29fce7a53dae219a51458@existiert.net",
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.version).toBeDefined();;
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("uses refresh token to fetch new access token", async () => {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    if (process.env.WCS_DUMMY_CI_PW == undefined || process.env.WCS_DUMMY_CI_PW == "") {
      console.warn("Skipping because `WCS_DUMMY_CI_PW` is not set");
      return;
    }

    const dummy = new Connection({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthUserPasswordCredentials({
        username: "ms_2d0e007e7136de11d5f29fce7a53dae219a51458@existiert.net",
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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
        expiresIn: 1,
        refreshToken: dummy.auth.refreshToken
      })
    });
    // force the use of refreshToken
    conn.auth.expirationEpoch = 0

    return conn.login()
      .then(resp => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(resp).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(resp != "").toBeTruthy();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e) => fail("it should not have errord: " + e));
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails to access auth-enabled server without client auth", async () => {
    const client = weaviate.client({
      scheme: "http",
      host: "localhost:8083"
    });

    return client.misc
      .metaGetter()
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'fail'.
        fail(`should not have succeeded. received: ${res}`);
      })
      .catch((e: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(e).toContain("401");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(e).toContain("anonymous access not enabled");
      });
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("warns when client auth is configured, but server auth is not", async () => {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    const logSpy = jest.spyOn(console, 'warn');

    const client = weaviate.client({
      scheme: "http",
      host: "localhost:8080",
      authClientSecret: new AuthUserPasswordCredentials({
        username: "some-user",
        password: "passwd"
      })
    });

    await client.misc
      .metaGetter()
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.version).toBeDefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(logSpy).toHaveBeenCalledWith(
      "client is configured for authentication, but server is not");
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("warns when client access token expires, no refresh token provided", async () => {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    const logSpy = jest.spyOn(console, 'warn');

    const conn = new Connection({
      scheme: "http",
      host: "localhost:8083",
      authClientSecret: new AuthAccessTokenCredentials({
        accessToken: "abcd1234",
        expiresIn: 1
      })
    });
    // force the use of refreshToken
    conn.auth.expirationEpoch = 0

    await conn.login()
      .then(resp => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(resp).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(resp ).toEqual("abcd1234");
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e) => fail("it should not have errord: " + e));
    
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(logSpy).toHaveBeenCalledWith(
      "AuthAccessTokenCredentials not provided with refreshToken, cannot refresh");
  })
})
