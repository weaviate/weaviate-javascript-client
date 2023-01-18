// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'weaviate'.
const weaviate = require("../index");

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("misc endpoints", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  const auth_client = weaviate.client({
    scheme: "http",
    host: "localhost:8083"
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("reports as live", () => {
    return client.misc
      .liveChecker()
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((res: any) => expect(res).toEqual(true))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("reports as not live with a broken url", () => {
    const brokenClient = weaviate.client({
      scheme: "http",
      host: "localhost:12345", // note the incorrect port
    });

    return brokenClient.misc
      .liveChecker()
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((res: any) => expect(res).toEqual(false))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("reports as ready", () => {
    return client.misc
      .readyChecker()
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((res: any) => expect(res).toEqual(true))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("reports as not ready with a broken url", () => {
    const brokenClient = weaviate.client({
      scheme: "http",
      host: "localhost:12345", // note the incorrect port
    });

    return brokenClient.misc
      .readyChecker()
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((res: any) => expect(res).toEqual(false))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("displays meta info", () => {
    return client.misc
      .metaGetter()
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.version).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.modules["text2vec-contextionary"].wordCount).toBeDefined();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.modules["text2vec-contextionary"].wordCount).toBeGreaterThan(
          100
        );
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("shows oidc config as undefined when not set", () => {
    return client.misc
      .openidConfigurationGetter()
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("it should not have errord: " + e));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("shows oidc config when set", () => {
    return auth_client.misc
      .openidConfigurationGetter()
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.clientId).toEqual("wcs")
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.href).toContain(".well-known/openid-configuration")
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.scopes).toEqual(["openid","email"])
      });
  });
});
