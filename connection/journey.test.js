import { AuthUserPasswordCredentials } from './auth.js';

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
})
