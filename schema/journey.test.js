const weaviate = require("../index");

describe("schema", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  const classObj = newClassObject('MyThingClass');

  it("creates a thing class (implicitly)", () => {
    return client.schema
      .classCreator()
      .withClass(classObj)
      .do()
      .then((res) => {
        expect(res).toEqual(classObj);
      });
  });

  it("gets an existing class", () => {
    return client.schema
      .classGetter()
      .withClassName(classObj.class)
      .do()
      .then((res) => {
        expect(res).toEqual(classObj);
      });
  });

  it("fails to create class with property having not supported tokenization", () => {
    const doomedClass = newClassObject("DoomedClass");
    doomedClass.properties[0].tokenization = "not-supported";

    return client.schema
      .classCreator()
      .withClass(doomedClass)
      .do()
      .catch(err =>
        expect(err).toEqual("usage error (422): {\"code\":606,\"message\":\"tokenization in body should be one of [word field]\"}")
      );
  });

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
      .then((res) => {
        expect(res).toEqual(prop);
      });
  });

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
      .catch(err =>
        expect(err).toEqual("usage error (422): {\"error\":[{\"message\":\"Tokenization 'field' is not allowed for data type 'text'\"}]}")
      );
  });

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
      .catch(err =>
        expect(err).toEqual("usage error (422): {\"error\":[{\"message\":\"Tokenization 'word' is not allowed for data type 'int[]'\"}]}")
      );
  });

  it("retrieves the schema and it matches the expectations", () => {
    return client.schema
      .getter()
      .do()
      .then((res) => {
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
            },
          ],
        });
      });
  });

  it("gets the shards of an existing class", () => {
    return client.schema
      .shardsGetter()
      .withClassName(classObj.class)
      .do()
      .then((res) => {
        res.forEach(shard => {
          expect(shard.status).toEqual("READY");
        });
      });
  })

  it("updates a shard of an existing class to readonly", async () => {
    var shards = await getShards(client, classObj.class);
    expect(Array.isArray(shards)).toBe(true);
    expect(shards.length).toEqual(1);

    return client.schema
      .shardUpdater()
      .withClassName(classObj.class)
      .withShardName(shards[0].name)
      .withStatus("READONLY")
      .do()
      .then(res => {
        expect(res.status).toEqual("READONLY");
    });
  })

  it("updates a shard of an existing class to ready", async () => {
    var shards = await getShards(client, classObj.class);
    expect(Array.isArray(shards)).toBe(true);
    expect(shards.length).toEqual(1);

    return client.schema
      .shardUpdater()
      .withClassName(classObj.class)
      .withShardName(shards[0].name)
      .withStatus("READY")
      .do()
      .then(res => {
        expect(res.status).toEqual("READY");
    });
  })

  it("deletes an existing class", () => {
    return client.schema
      .classDeleter()
      .withClassName(classObj.class)
      .do()
      .then((res) => {
        expect(res).toEqual(undefined);
      });
  });

  it("updates all shards in a class", async () => {
    var shardCount = 3;
    var newClass = newClassObject('NewClass');
    newClass.shardingConfig.desiredCount = shardCount;

    await client.schema
      .classCreator()
      .withClass(newClass)
      .do()
      .then((res) => {
        expect(res).toHaveProperty('shardingConfig.actualCount', 3)
      });

    var shards = await getShards(client, newClass.class);
    expect(Array.isArray(shards)).toBe(true);
    expect(shards.length).toEqual(shardCount);

    await client.schema
      .shardsUpdater()
      .withClassName(newClass.class)
      .withStatus("READONLY")
      .do()
      .then(res => {
        expect(res.length).toEqual(shardCount)
        res.forEach(obj => {
          expect(obj.status).toEqual("READONLY")
        });
      });

    await client.schema
      .shardsUpdater()
      .withClassName(newClass.class)
      .withStatus("READY")
      .do()
      .then(res => {
        expect(res.length).toEqual(shardCount)
        res.forEach(obj => {
          expect(obj.status).toEqual("READY")
        });
      });

    return client.schema
      .classDeleter()
      .withClassName(newClass.class)
      .do()
      .then((res) => {
        expect(res).toEqual(undefined);
      });
  })
});

function newClassObject(className) {
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
  };
}

async function getShards(client, className) {
  return client.schema
    .shardsGetter()
    .withClassName(className)
    .do()
    .then((res) => {
      return res;
    });
}
