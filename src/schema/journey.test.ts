// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'weaviate'.
const weaviate = require("../index");

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("schema", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  const classObj = newClassObject('MyThingClass');

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates a thing class (implicitly)", () => {
    return client.schema
      .classCreator()
      .withClass(classObj)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toEqual(classObj);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("gets an existing class", () => {
    return client.schema
      .classGetter()
      .withClassName(classObj.class)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toEqual(classObj);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails to create class with property having not supported tokenization", () => {
    const doomedClass = newClassObject("DoomedClass");
    doomedClass.properties[0].tokenization = "not-supported";

    return client.schema
      .classCreator()
      .withClass(doomedClass)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .catch((err: any) => expect(err).toEqual("usage error (422): {\"code\":606,\"message\":\"tokenization in body should be one of [word field]\"}")
      );
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("extends the thing class with a new property", () => {
    const className = "MyThingClass";
    const prop = {
      dataType: ["string"],
      name: "anotherProp",
      tokenization: "field",
      moduleConfig: {
        'text2vec-contextionary': {
          skip: false,
          vectorizePropertyName: false
        }
      }
    };

    return client.schema
      .propertyCreator()
      .withClassName(className)
      .withProperty(prop)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toEqual(prop);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails to extend the thing class with property having not supported tokenization (1)", () => {
    const className = "MyThingClass";
    const prop = {
      dataType: ["text"],
      name: "yetAnotherProp",
      tokenization: "field",
      moduleConfig: {
        'text2vec-contextionary': {
          skip: false,
          vectorizePropertyName: false
        }
      }
    };

    return client.schema
      .propertyCreator()
      .withClassName(className)
      .withProperty(prop)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .catch((err: any) => expect(err).toEqual("usage error (422): {\"error\":[{\"message\":\"Tokenization 'field' is not allowed for data type 'text'\"}]}")
      );
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails to extend the thing class with property having not supported tokenization (2)", () => {
    const className = "MyThingClass";
    const prop = {
      dataType: ["int[]"],
      name: "yetAnotherProp",
      tokenization: "word",
      moduleConfig: {
        'text2vec-contextionary': {
          skip: false,
          vectorizePropertyName: false
        }
      }
    };

    return client.schema
      .propertyCreator()
      .withClassName(className)
      .withProperty(prop)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      .catch((err: any) => expect(err).toEqual("usage error (422): {\"error\":[{\"message\":\"Tokenization 'word' is not allowed for data type 'int[]'\"}]}")
      );
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("retrieves the schema and it matches the expectations", () => {
    return client.schema
      .getter()
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toEqual({
          classes: [
            {
              class: "MyThingClass",
              properties: [
                {
                  dataType: ["string"],
                  name: "stringProp",
                  tokenization: "word",
                  moduleConfig: {
                    'text2vec-contextionary': {
                      skip: false,
                      vectorizePropertyName: false
                    }
                  }
                },
                {
                  dataType: ["string"],
                  name: "anotherProp",
                  tokenization: "field",
                  moduleConfig: {
                    'text2vec-contextionary': {
                      skip: false,
                      vectorizePropertyName: false
                    }
                  }
                },
              ],
              vectorIndexType: "hnsw",
              vectorizer: "text2vec-contextionary",
              vectorIndexConfig: {
                cleanupIntervalSeconds: 300,
                distance: "cosine",
                dynamicEfFactor: 8,
                dynamicEfMax: 500,
                dynamicEfMin: 100,
                ef: -1,
                maxConnections: 64,
                skip: false,
                efConstruction: 128,
                vectorCacheMaxObjects: 500000,
                flatSearchCutoff: 40000
              },
              invertedIndexConfig: {
                cleanupIntervalSeconds: 60,
                bm25: {
                  b: 0.75,
                  k1: 1.2
                },
                stopwords: {
                  preset: "en",
                  additions: null,
                  removals: null
                }
              },
              moduleConfig: {
                'text2vec-contextionary': {
                  vectorizeClassName: true
                }
              },
              shardingConfig: {
                actualCount: 1,
                actualVirtualCount: 128,
                desiredCount: 1,
                desiredVirtualCount: 128,
                function: "murmur3",
                key: "_id",
                strategy: "hash",
                virtualPerPhysical: 128,
              },
              replicationConfig: {
                factor: 1,
              },
            },
          ],
        });
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("gets the shards of an existing class", () => {
    return client.schema
      .shardsGetter()
      .withClassName(classObj.class)
      .do()
      .then((res: any) => {
        res.forEach((shard: any) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(shard.status).toEqual("READY");
        });
      });
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("updates a shard of an existing class to readonly", async () => {
    var shards = await getShards(client, classObj.class);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(Array.isArray(shards)).toBe(true);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(shards.length).toEqual(1);

    return client.schema
      .shardUpdater()
      .withClassName(classObj.class)
      .withShardName(shards[0].name)
      .withStatus("READONLY")
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.status).toEqual("READONLY");
    });
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("updates a shard of an existing class to ready", async () => {
    var shards = await getShards(client, classObj.class);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(Array.isArray(shards)).toBe(true);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(shards.length).toEqual(1);

    return client.schema
      .shardUpdater()
      .withClassName(classObj.class)
      .withShardName(shards[0].name)
      .withStatus("READY")
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.status).toEqual("READY");
    });
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("deletes an existing class", () => {
    return client.schema
      .classDeleter()
      .withClassName(classObj.class)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toEqual(undefined);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("updates all shards in a class", async () => {
    var shardCount = 3;
    var newClass = newClassObject('NewClass');
    newClass.shardingConfig.desiredCount = shardCount;

    await client.schema
      .classCreator()
      .withClass(newClass)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toHaveProperty('shardingConfig.actualCount', 3);
      });

    var shards = await getShards(client, newClass.class);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(Array.isArray(shards)).toBe(true);
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(shards.length).toEqual(shardCount);

    await client.schema
      .shardsUpdater()
      .withClassName(newClass.class)
      .withStatus("READONLY")
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.length).toEqual(shardCount)
        res.forEach((obj: any) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(obj.status).toEqual("READONLY")
        });
      });

    await client.schema
      .shardsUpdater()
      .withClassName(newClass.class)
      .withStatus("READY")
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res.length).toEqual(shardCount)
        res.forEach((obj: any) => {
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(obj.status).toEqual("READY")
        });
      });

    return deleteClass(client, newClass.class);
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("has updated values of bm25 config", async () => {
    var newClass = newClassObject('NewClass');
    var bm25Config = {k1: 1.13, b: 0.222};

    newClass.invertedIndexConfig.bm25 = bm25Config;

    await client.schema
      .classCreator()
      .withClass(newClass)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toHaveProperty('invertedIndexConfig.bm25', bm25Config);
      });

    return deleteClass(client, newClass.class);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("has updated values of stopwords config", async () => {
    var newClass = newClassObject('SpaceClass');
    var stopwordConfig = {
      preset: "en",
      additions: ["star", "nebula"],
      removals: ["a", "the"]
    };

    // @ts-expect-error TS(2322): Type '{ preset: string; additions: string[]; remov... Remove this comment to see the full error message
    newClass.invertedIndexConfig.stopwords = stopwordConfig;

    await client.schema
      .classCreator()
      .withClass(newClass)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toHaveProperty('invertedIndexConfig.stopwords', stopwordConfig);
      });

    return deleteClass(client, newClass.class);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates a class with bm25 and stopwords config", async () => {
    var newClass = {
      class: 'EmptyClass',
      properties: [{dataType: ["string"],name: 'stringProp'}]
    }

    var bm25Config = {k1: 1.13, b: 0.222};
    var stopwordConfig = {
      preset: "en",
      additions: ["star", "nebula"],
      removals: ["a", "the"]
    };

    // @ts-expect-error TS(2339): Property 'invertedIndexConfig' does not exist on t... Remove this comment to see the full error message
    newClass.invertedIndexConfig = {
      bm25: bm25Config,
      stopwords: stopwordConfig
    };

    await client.schema
      .classCreator()
      .withClass(newClass)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toHaveProperty('invertedIndexConfig.bm25', bm25Config);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toHaveProperty('invertedIndexConfig.stopwords', stopwordConfig);
      });

    return deleteClass(client, newClass.class);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates a class with explicit replication config", async () => {
    const replicationFactor = 2;
    var newClass = newClassObject("SomeClass");
    newClass.replicationConfig.factor = replicationFactor;

    await client.schema
      .classCreator()
      .withClass(newClass)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toHaveProperty('replicationConfig.factor', replicationFactor);
      });

    return deleteClass(client, newClass.class);
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates a class with implicit replication config", async () => {
    var newClass = newClassObject("SomeClass");
    // @ts-expect-error TS(2790): The operand of a 'delete' operator must be optiona... Remove this comment to see the full error message
    delete newClass.replicationConfig

    await client.schema
      .classCreator()
      .withClass(newClass)
      .do()
      .then((res: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(res).toHaveProperty('replicationConfig.factor', 1);
      });

    return deleteClass(client, newClass.class);
  });
});

function newClassObject(className: any) {
  return {
    class: className,
    properties: [
      {
        dataType: ["string"],
        name: 'stringProp',
        tokenization: "word",
        moduleConfig: {
          'text2vec-contextionary': {
            skip: false,
            vectorizePropertyName: false
          }
        }
      }
    ],
    vectorIndexType: 'hnsw',
    vectorizer: 'text2vec-contextionary',
    vectorIndexConfig: {
      cleanupIntervalSeconds: 300,
      distance: "cosine",
      dynamicEfFactor: 8,
      dynamicEfMax: 500,
      dynamicEfMin: 100,
      ef: -1,
      maxConnections: 64,
      skip: false,
      efConstruction: 128,
      vectorCacheMaxObjects: 500000,
      flatSearchCutoff: 40000
    },
    invertedIndexConfig: {
      cleanupIntervalSeconds: 60,
      bm25: {
        b: 0.75,
        k1: 1.2
      },
      stopwords: {
        preset: "en",
        additions: null,
        removals: null
      }
    },
    moduleConfig: {
      'text2vec-contextionary':
      {
        vectorizeClassName: true
      }
    },
    shardingConfig: {
      actualCount: 1,
      actualVirtualCount: 128,
      desiredCount: 1,
      desiredVirtualCount: 128,
      function: "murmur3",
      key: "_id",
      strategy: "hash",
      virtualPerPhysical: 128,
    },
    replicationConfig: {
      factor: 1,
    },
  };
}

async function getShards(client: any, className: any) {
  return client.schema
    .shardsGetter()
    .withClassName(className)
    .do()
    .then((res: any) => {
      return res;
    });
}

function deleteClass(client: any, className: any) {
  return client.schema
    .classDeleter()
    .withClassName(className)
    .do()
    .then((res: any) => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(res).toEqual(undefined);
    });
}
