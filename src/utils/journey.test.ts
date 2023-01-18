import { DbVersionProvider, DbVersionSupport } from "./dbVersion";

const EMPTY_VERSION = "";
const VERSION_1 = "1.2.3";
const VERSION_2 = "2.3.4";

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("db version provider", () => {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should return empty version", () => {
    const versionGetter = () => Promise.resolve(EMPTY_VERSION);
    const dbVersionProvider = new DbVersionProvider(versionGetter);

    return dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(EMPTY_VERSION))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should return proper version", () => {
    const versionGetter = () => Promise.resolve(VERSION_1);
    const dbVersionProvider = new DbVersionProvider(versionGetter);

    return dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_1))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should return new version after refresh",  async () => {
    let callsCounter = 0;
    const versionGetter = () => {
      switch(++callsCounter) {
        case 1:
          return Promise.resolve(VERSION_1);
        case 2:
          return Promise.resolve(VERSION_2);
        default:
          // @ts-expect-error TS(2304): Cannot find name 'fail'.
          fail("should not be called more then 2 times");
      }
    };
    const dbVersionProvider = new DbVersionProvider(versionGetter);

    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_1))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
    await dbVersionProvider.refresh(true);
    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_2))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should fetch version once", async () => {
    let callsCounter = 0;
    const versionGetter = () => {
      switch(++callsCounter) {
        case 1:
          return Promise.resolve(VERSION_1);
        default:
          // @ts-expect-error TS(2304): Cannot find name 'fail'.
          fail("should not be called more then 1 time");
      }
    };
    const dbVersionProvider = new DbVersionProvider(versionGetter);

    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_1))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_1))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_1))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(callsCounter).toBe(1);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should fetch version until success", async () => {
    let callsCounter = 0;
    const versionGetter = () => {
      switch(++callsCounter) {
        case 1:
        case 2:
          return Promise.resolve(EMPTY_VERSION);
        case 3:
          return Promise.resolve(VERSION_1);
        default:
          // @ts-expect-error TS(2304): Cannot find name 'fail'.
          fail("should not be called more then 3 times");
      }
    };
    const dbVersionProvider = new DbVersionProvider(versionGetter);

    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(EMPTY_VERSION))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(EMPTY_VERSION))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_1))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_1))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));
    await dbVersionProvider.getVersionPromise()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .then((version: any) => expect(version).toBe(VERSION_1))
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch(() => fail("version should always resolve successfully"));

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(callsCounter).toBe(3);
  });
});


// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("db version support", () => {
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("should not support", () => {
    const notSupportedVersions = ["0.11", "1.13.9", "1.13", "1.0"];
    notSupportedVersions.forEach(async version => {
      const dbVersionProvider = { getVersionPromise: () => Promise.resolve(version) };
      const dbVersionSupport = new DbVersionSupport(dbVersionProvider);

      await dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
        .then((support: any) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(support.supports).toBe(false);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(support.version).toBe(version);
        })
        // @ts-expect-error TS(2304): Cannot find name 'fail'.
        .catch(() => fail("version should always resolve successfully"));
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it ("should support", () => {
    const supportedVersions = ["1.14.0", "1.14.9", "1.100", "2.0", "10.11.12"];
    supportedVersions.forEach(async version => {
      const dbVersionProvider = { getVersionPromise: () => Promise.resolve(version) };
      const dbVersionSupport = new DbVersionSupport(dbVersionProvider);

      await dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
        .then((support: any) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(support.supports).toBe(true);
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(support.version).toBe(version);
        })
        // @ts-expect-error TS(2304): Cannot find name 'fail'.
        .catch(() => fail("version should always resolve successfully"));
    });
  });
});
