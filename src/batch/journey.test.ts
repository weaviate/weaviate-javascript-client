// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'weaviate'.
const weaviate = require("../index");

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'thingClass... Remove this comment to see the full error message
const thingClassName = "BatchJourneyTestThing";
const otherThingClassName = "BatchJourneyTestOtherThing";

const thingIds = [
  "c25365bd-276b-4d88-9d8f-9e924701aa89",
  "e0754de5-1458-4814-b21f-382a77b5d64b",
  "5c345f46-c3c4-4f42-8ad6-65c6c60840b4",
  "5f4b0aa2-0704-4529-919f-c1f614e685f4",
];

const otherThingIds = [
  "5b354a0f-fe66-4fe7-ad62-4db72ddab815",
  "8727fa2b-610a-4a5c-af26-e558943f71c7",
];

const someObjects = [
  {
    class: thingClassName,
    id: thingIds[0],
    properties: { stringProp: "foo1" },
  },
  {
    class: thingClassName,
    id: thingIds[1],
    properties: { stringProp: "bar1" },
  },
  {
    class: thingClassName,
    id: thingIds[2],
    properties: { stringProp: "foo2" },
  },
  {
    class: thingClassName,
    id: thingIds[3],
    properties: { stringProp: "bar2" },
  },
  {
    class: otherThingClassName,
    id: otherThingIds[0],
    properties: { stringProp: "foo3" },
  },
  {
    class: otherThingClassName,
    id: otherThingIds[1],
    properties: { stringProp: "bar3" },
  },
];

const someReferences = [
  {
    from: `weaviate://localhost/${thingClassName}/${thingIds[0]}/refProp`,
    to: `weaviate://localhost/${otherThingClassName}/${otherThingIds[0]}`,
  },
  {
    from: `weaviate://localhost/${thingClassName}/${thingIds[1]}/refProp`,
    to: `weaviate://localhost/${otherThingClassName}/${otherThingIds[1]}`,
  },
  {
    from: `weaviate://localhost/${thingClassName}/${thingIds[2]}/refProp`,
    to: `weaviate://localhost/${otherThingClassName}/${otherThingIds[1]}`,
  },
  {
    from: `weaviate://localhost/${thingClassName}/${thingIds[3]}/refProp`,
    to: `weaviate://localhost/${otherThingClassName}/${otherThingIds[1]}`,
  }
];

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("batch importing", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("can add objects with different methods", () => {
    const batcher = client.batch.objectsBatcher()
      .withObject(someObjects[0])
      .withObjects(someObjects[1])
      .withObjects(someObjects[2], someObjects[3])
      .withObjects([someObjects[4], someObjects[5]]);

    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(batcher.objects).toHaveLength(someObjects.length);
    batcher.objects.forEach((obj: any, i: any) => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(obj.class).toBe(someObjects[i].class);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(obj.id).toBe(someObjects[i].id);
    })
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => setup(client));

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("import thing objects", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("hand assembling the objects", () => {
      const toImport = [
        {
          class: thingClassName,
          id: thingIds[0],
          properties: { stringProp: "foo" },
        },
        {
          class: thingClassName,
          id: thingIds[1],
          properties: { stringProp: "bar" },
        },
      ];

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("imports them", () => {
        client.batch
          .objectsBatcher()
          .withObject(toImport[0])
          .withObject(toImport[1])
          .do()
          .then()
          // @ts-expect-error TS(2304): Cannot find name 'fail'.
          .catch((e: any) => fail("it should not have error'd " + e));
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("waits for es index refresh", () => {
        return new Promise((resolve) => setTimeout(resolve, 1000));
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("verifies they are now queryable", () => {
        return Promise.all([
          client.data.getterById().withId(thingIds[0]).withClassName(thingClassName).do(),
          client.data.getterById().withId(thingIds[1]).withClassName(thingClassName).do(),
        // @ts-expect-error TS(2304): Cannot find name 'fail'.
        ]).catch((e) => fail("it should not have error'd " + e));
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("using the thing builder to assemble the objects", () => {
      const toImport = [
        client.data
          .creator()
          .withClassName(thingClassName)
          .withId(thingIds[2])
          .withProperties({ stringProp: "foo" })
          .payload(), // note the .payload(), not .do()!
        client.data
          .creator()
          .withClassName(thingClassName)
          .withId(thingIds[3])
          .withProperties({ stringProp: "foo" })
          .payload(), // note the .payload(), not .do()!
      ];

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("imports them", () => {
        client.batch
          .objectsBatcher()
          .withObjects(toImport[0], toImport[1])
          .do()
          .then()
          // @ts-expect-error TS(2304): Cannot find name 'fail'.
          .catch((e: any) => fail("it should not have error'd " + e));
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("waits for es index refresh", () => {
        return new Promise((resolve) => setTimeout(resolve, 1000));
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("verifies they are now queryable", () => {
        return Promise.all([
          client.data.getterById().withId(thingIds[2]).withClassName(thingClassName).do(),
          client.data.getterById().withId(thingIds[3]).withClassName(thingClassName).do(),
        // @ts-expect-error TS(2304): Cannot find name 'fail'.
        ]).catch((e) => fail("it should not have error'd " + e));
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("import other thing objects", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("hand assembling the objects", () => {
      const toImport = [
        {
          class: otherThingClassName,
          id: otherThingIds[0],
          properties: { stringProp: "foo" },
        },
        {
          class: otherThingClassName,
          id: otherThingIds[1],
          properties: { stringProp: "bar" },
        },
      ];

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("imports them", () => {
        client.batch
          .objectsBatcher()
          .withObjects([toImport[0], toImport[1]])
          .do()
          .then()
          // @ts-expect-error TS(2304): Cannot find name 'fail'.
          .catch((e: any) => fail("it should not have error'd " + e));
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("waits for es index refresh", () => {
        return new Promise((resolve) => setTimeout(resolve, 1000));
      });

      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("verifies they are now queryable", () => {
        return Promise.all([
          client.data.getterById().withId(toImport[0].id).withClassName(toImport[0].class).do(),
          client.data.getterById().withId(toImport[1].id).withClassName(toImport[1].class).do(),
        // @ts-expect-error TS(2304): Cannot find name 'fail'.
        ]).catch((e) => fail("it should not have error'd " + e));
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("batch reference between the thing and otherThing objects", () => {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("can add references with different methods", () => {
      const batcher = client.batch.referencesBatcher()
        .withReference(someReferences[0])
        .withReferences(someReferences[1], someReferences[2])
        .withReferences([someReferences[3]]);

      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(batcher.references).toHaveLength(someReferences.length);
      batcher.references.forEach((ref: any, i: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ref.from).toBe(someReferences[i].from);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(ref.to).toBe(someReferences[i].to);
      })
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("imports the refs with raw objects", () => {
      return client.batch
        .referencesBatcher()
        .withReference({
          from: `weaviate://localhost/${thingClassName}/${thingIds[0]}/refProp`,
          to: `weaviate://localhost/${otherThingClassName}/${otherThingIds[0]}`,
        })
        .withReference({
          from: `weaviate://localhost/${thingClassName}/${thingIds[1]}/refProp`,
          to: `weaviate://localhost/${otherThingClassName}/${otherThingIds[1]}`,
        })
        .do()
        .then((res: any) => {
          res.forEach((elem: any) => {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(elem.result.errors).toBeUndefined();
          });
        })
        // @ts-expect-error TS(2304): Cannot find name 'fail'.
        .catch((e: any) => fail("it should not have error'd " + e));
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("imports more refs with a builder pattern", () => {
      const reference1 = client.batch
        .referencePayloadBuilder()
        .withFromClassName(thingClassName)
        .withFromRefProp("refProp")
        .withFromId(thingIds[2])
        .withToId(otherThingIds[0])
        .withToClassName(otherThingClassName)
        .payload();
      const reference2 = client.batch
        .referencePayloadBuilder()
        .withFromClassName(thingClassName)
        .withFromRefProp("refProp")
        .withFromId(thingIds[3])
        .withToId(otherThingIds[1])
        .withToClassName(otherThingClassName)
        .payload();
      return client.batch
        .referencesBatcher()
        .withReferences(reference1, reference2)
        .do()
        .then((res: any) => {
          res.forEach((elem: any) => {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(elem.result.errors).toBeUndefined();
          });
        })
        // @ts-expect-error TS(2304): Cannot find name 'fail'.
        .catch((e: any) => fail("it should not have error'd " + e));
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("waits for es index refresh", () => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("verifies the refs are now set", () => {
      return Promise.all([
        client.data
          .getterById()
          .withId(thingIds[0])
          .withClassName(thingClassName)
          .do()
          .then((res: any) => {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(res.properties.refProp[0].beacon).toEqual(
              `weaviate://localhost/${otherThingClassName}/${otherThingIds[0]}`
            );
          }),
        client.data
          .getterById()
          .withId(thingIds[1])
          .withClassName(thingClassName)
          .do()
          .then((res: any) => {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(res.properties.refProp[0].beacon).toEqual(
              `weaviate://localhost/${otherThingClassName}/${otherThingIds[1]}`
            );
          }),
        client.data
          .getterById()
          .withId(thingIds[2])
          .withClassName(thingClassName)
          .do()
          .then((res: any) => {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(res.properties.refProp[0].beacon).toEqual(
              `weaviate://localhost/${otherThingClassName}/${otherThingIds[0]}`
            );
          }),
        client.data
          .getterById()
          .withId(thingIds[3])
          .withClassName(thingClassName)
          .do()
          .then((res: any) => {
            // @ts-expect-error TS(2304): Cannot find name 'expect'.
            expect(res.properties.refProp[0].beacon).toEqual(
              `weaviate://localhost/${otherThingClassName}/${otherThingIds[1]}`
            );
          }),
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      ]).catch((e) => fail("it should not have error'd " + e));
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("tears down and cleans up", () => cleanup(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("batch deleting", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up schema", () => setup(client));
  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up data", () => setupData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("batch deletes with dryRun and verbose output", () =>
    client.batch
      .objectsBatchDeleter()
      .withClassName(thingClassName)
      .withWhere({
        operator: weaviate.filters.Operator.EQUAL,
        valueString: "bar1",
        path: ["stringProp"]
      })
      .withDryRun(true)
      .withOutput(weaviate.batch.DeleteOutput.VERBOSE)
      .do()
      .then((result: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.dryRun).toBe(true);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.output).toBe(weaviate.batch.DeleteOutput.VERBOSE);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.match).toEqual({
          class: thingClassName,
          where: {
            operands: null, // FIXME should not be received
            operator: weaviate.filters.Operator.EQUAL,
            valueString: "bar1",
            path: ["stringProp"],
          },
        })
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results).toEqual({
          successful: 0,
          failed: 0,
          matches: 1,
          limit: 10000,
          objects: [{
            id: thingIds[1],
            status: weaviate.batch.DeleteResultStatus.DRYRUN,
          }],
        });
      })
  )

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("batch deletes with dryRun and minimal output", () =>
    client.batch
      .objectsBatchDeleter()
      .withClassName(otherThingClassName)
      .withWhere({
        operator: weaviate.filters.Operator.LIKE,
        valueString: "foo3",
        path: ["stringProp"]
      })
      .withDryRun(true)
      .withOutput(weaviate.batch.DeleteOutput.MINIMAL)
      .do()
      .then((result: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.dryRun).toBe(true);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.output).toBe(weaviate.batch.DeleteOutput.MINIMAL);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.match).toEqual({
          class: otherThingClassName,
          where: {
            operands: null, // FIXME should not be received
            operator: weaviate.filters.Operator.LIKE,
            valueString: "foo3",
            path: ["stringProp"],
          },
        })
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results).toEqual({
          successful: 0,
          failed: 0,
          matches: 1,
          limit: 10000,
          objects: null,
        });
      })
  )

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("batch deletes but no matches with default dryRun and output", () =>
    client.batch
      .objectsBatchDeleter()
      .withClassName(otherThingClassName)
      .withWhere({
        operator: weaviate.filters.Operator.EQUAL,
        valueString: "doesNotExist",
        path: ["stringProp"]
      })
      .do()
      .then((result: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.dryRun).toBe(false);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.output).toBe(weaviate.batch.DeleteOutput.MINIMAL);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.match).toEqual({
          class: otherThingClassName,
          where: {
            operands: null, // FIXME should not be received
            operator: weaviate.filters.Operator.EQUAL,
            valueString: "doesNotExist",
            path: ["stringProp"],
          },
        })
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results).toEqual({
          successful: 0,
          failed: 0,
          matches: 0,
          limit: 10000,
          objects: null,
        });
      })
  )

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("batch deletes with default dryRun", () => {
    const inAMinute = "" + (new Date().getTime() + 60 * 1000);
    return client.batch
      .objectsBatchDeleter()
      .withClassName(otherThingClassName)
      .withWhere({
        operator: weaviate.filters.Operator.LESS_THAN,
        valueString: inAMinute,
        path: ["_creationTimeUnix"]
      })
      .withOutput(weaviate.batch.DeleteOutput.VERBOSE)
      .do()
      .then((result: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.dryRun).toBe(false);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.output).toBe(weaviate.batch.DeleteOutput.VERBOSE);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.match).toEqual({
          class: otherThingClassName,
          where: {
            operands: null, // FIXME should not be received
            operator: weaviate.filters.Operator.LESS_THAN,
            valueString: inAMinute,
            path: ["_creationTimeUnix"],
          },
        })
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results.successful).toBe(2);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results.failed).toBe(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results.matches).toBe(2);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results.limit).toBe(10000);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results.objects).toHaveLength(2)
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results.objects).toContainEqual({
          id: otherThingIds[0],
          status: weaviate.batch.DeleteResultStatus.SUCCESS,
        });
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result.results.objects).toContainEqual({
          id: otherThingIds[1],
          status: weaviate.batch.DeleteResultStatus.SUCCESS,
        });
      });
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("batch deletes fails due to validation", () =>
    client.batch
      .objectsBatchDeleter()
      .withClassName("")
      .withWhere("shouldBeObject")
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .catch((err: any) => expect(err.toString()).toBe("Error: invalid usage: string className must be set - set with .withClassName(className), object where must be set - set with .withWhere(whereFilter)"))
  )

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("tears down and cleans up", () => cleanup(client));
});


// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'setup'.
const setup = async (client: any) => {
  // first import the classes
  await Promise.all([
    client.schema
      .classCreator()
      .withClass({
        class: thingClassName,
        properties: [
          {
            name: "stringProp",
            dataType: ["string"],
          },
        ],
      })
      .do(),
    client.schema
      .classCreator()
      .withClass({
        class: otherThingClassName,
        properties: [
          {
            name: "stringProp",
            dataType: ["string"],
          },
        ],
        invertedIndexConfig: {
          indexTimestamps: true,
        },
      })
      .do(),
  ]);

  // now set a link from thing to otherThing class, so we can batch import
  // references

  return client.schema
    .propertyCreator()
    .withClassName(thingClassName)
    .withProperty({ name: "refProp", dataType: [otherThingClassName] })
    .do();
};

const setupData = (client: any) => {
  return client.batch
    .objectsBatcher()
    .withObjects(someObjects)
    .do();
}

const cleanup = (client: any) => Promise.all([
  client.schema.classDeleter().withClassName(thingClassName).do(),
  client.schema.classDeleter().withClassName(otherThingClassName).do(),
]);
