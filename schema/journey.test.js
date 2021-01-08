const weaviate = require('../index');

describe('schema', () => {
  const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
  });

  it('creates a thing class (implicitly)', () => {
    const classObj = {
      class: 'MyThingClass',
      properties: [
        {
          dataType: ['string'],
          name: 'stringProp',
        },
      ],
      vectorIndexType: 'hnsw',
      vectorizer: 'text2vec-contextionary',
    };

    return client.schema
      .classCreator()
      .withClass(classObj)
      .do()
      .then(res => {
        expect(res).toEqual(classObj);
      });
  });

  it('extends the thing class with a new property', () => {
    const className = 'MyThingClass';
    const prop = {
      dataType: ['string'],
      name: 'anotherProp',
    };

    return client.schema
      .propertyCreator()
      .withClassName(className)
      .withProperty(prop)
      .do()
      .then(res => {
        expect(res).toEqual(prop);
      });
  });

  it('retrieves the schema and it matches the expectations', () => {
    return client.schema
      .getter()
      .do()
      .then(res => {
        expect(res).toEqual({
            classes: [
              {
                class: 'MyThingClass',
                properties: [
                  {
                    dataType: ['string'],
                    name: 'stringProp',
                  },
                  {
                    dataType: ['string'],
                    name: 'anotherProp',
                  },
                ],
      vectorIndexType: 'hnsw',
      vectorizer: 'text2vec-contextionary',
              },
            ],
        });
      });
  });

  it('deletes an existing class', () => {
    const className = 'MyThingClass';

    return client.schema
      .classDeleter()
      .withClassName(className)
      .do()
      .then(res => {
        expect(res).toEqual(undefined);
      });
  });
});
