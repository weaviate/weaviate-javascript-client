// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'weaviate'.
const weaviate = require("../index");
// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("c11y endpoints", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("displays info about a concept", () => {
    return client.c11y
      .conceptsGetter()
      .withConcept("car")
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.individualWords[0].word).toEqual("car");
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("extends the c11y with a custom concept", () => {
    return client.c11y
      .extensionCreator()
      .withConcept("clientalmostdonehappyness")
      .withDefinition(
        "the happyness you feel when the Weaviate Javascript client " +
          "is almost complete and ready to be released"
      )
      .withWeight(1)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toEqual({
          concept: "clientalmostdonehappyness",
          definition:
            "the happyness you feel when the Weaviate Javascript client " +
            "is almost complete and ready to be released",
          weight: 1,
        });
      });
  });
});
