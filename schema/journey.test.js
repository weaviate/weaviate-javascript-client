const weaviate = require("../index");

describe("schema", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("creates a thing class (implicitly)", () => {
    const classObj = {
      class: 'MyThingClass',
      properties: [
        {
          dataType: ["string"],
          name: 'stringProp',
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
        cleanupIntervalSeconds: 60
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

    return client.schema
      .classCreator()
      .withClass(classObj)
      .do()
      .then((res) => {
        expect(res).toEqual(classObj);
      });
  });

  it("extends the thing class with a new property", () => {
    const className = "MyThingClass";
    const prop = {
      dataType: ["string"],
      name: "anotherProp",
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
                cleanupIntervalSeconds: 60
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

  it("deletes an existing class", () => {
    const className = "MyThingClass";

    return client.schema
      .classDeleter()
      .withClassName(className)
      .do()
      .then((res) => {
        expect(res).toEqual(undefined);
      });
  });
});
