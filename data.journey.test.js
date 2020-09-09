const weaviate = require('./index');

const thingClassName = 'DataJourneyTestThing';
const actionClassName = 'DataJourneyTestAction';

describe('data', () => {
  const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
  });

  it('creates a schema class', () => {
    // this is just test setup, not part of what we want to test here
    return setup(client);
  });

  it('creates a new thing object without an explicit id', () => {
    const schema = {stringProp: 'without-id'};

    return client.data
      .creator()
      .withClassName(thingClassName)
      .withSchema(schema)
      .do()
      .then(res => {
        expect(res.schema).toEqual(schema);
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('creates a new thing object with an explicit id', () => {
    const schema = {stringProp: 'with-id'};
    const id = '1565c06c-463f-466c-9092-5930dbac3887';

    return client.data
      .creator()
      .withClassName(thingClassName)
      .withSchema(schema)
      .withId(id)
      .withKind(weaviate.KIND_THINGS)
      .do()
      .then(res => {
        expect(res.schema).toEqual(schema);
        expect(res.id).toEqual(id);
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('creates a new action object with an explicit id', () => {
    const schema = {stringProp: 'this-is-the-action'};
    const id = '40d2f93a-8f55-4561-8636-7c759f89ef13';

    return client.data
      .creator()
      .withClassName(actionClassName)
      .withSchema(schema)
      .withId(id)
      .withKind(weaviate.KIND_ACTIONS)
      .do()
      .then(res => {
        expect(res.schema).toEqual(schema);
        expect(res.id).toEqual(id);
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('waits for es index updates', () => {
    return new Promise((resolve, reject) => {
      // TODO: remove in 1.0.0
      setTimeout(resolve, 1000);
    });
  });

  it('errors without a className', () => {
    return client.data
      .creator()
      .do()
      .then(() => fail('it should have errord'))
      .catch(err => {
        expect(err).toEqual(
          new Error(
            'invalid usage: className must be set - initialize with creator(className)',
          ),
        );
      });
  });

  it('gets all things', () => {
    return client.data
      .getter()
      .do()
      .then(res => {
        expect(res.things).toHaveLength(2);
        expect(res.things).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '1565c06c-463f-466c-9092-5930dbac3887',
              schema: {stringProp: 'with-id'},
            }),
            expect.objectContaining({schema: {stringProp: 'without-id'}}),
          ]),
        );
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('gets all actions', () => {
    return client.data
      .getter()
      .withKind(weaviate.KIND_ACTIONS)
      .do()
      .then(res => {
        expect(res.actions).toHaveLength(1);
        expect(res.actions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '40d2f93a-8f55-4561-8636-7c759f89ef13',
              schema: {stringProp: 'this-is-the-action'},
            }),
          ]),
        );
      });
  });

  it('gets one thing by id', () => {
    return client.data
      .getterById()
      .withId('1565c06c-463f-466c-9092-5930dbac3887')
      .do()
      .then(res => {
        expect(res).toEqual(
          expect.objectContaining({
            id: '1565c06c-463f-466c-9092-5930dbac3887',
            schema: {stringProp: 'with-id'},
          }),
        );
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('gets one action by id', () => {
    return client.data
      .getterById()
      .withId('40d2f93a-8f55-4561-8636-7c759f89ef13')
      .withKind(weaviate.KIND_ACTIONS)
      .do()
      .then(res => {
        expect(res).toEqual(
          expect.objectContaining({
            id: '40d2f93a-8f55-4561-8636-7c759f89ef13',
            schema: {stringProp: 'this-is-the-action'},
          }),
        );
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('errors if the id is empty', () => {
    return client.data
      .getterById()
      .do()
      .then(() => fail('it should have errord'))
      .catch(e => {
        expect(e).toEqual(
          new Error(
            'invalid usage: id must be set - initialize with getterById(id)',
          ),
        );
      });
  });

  it('updates a thing', () => {
    const id = '1565c06c-463f-466c-9092-5930dbac3887';
    return client.data
      .getterById()
      .withId(id)
      .do()
      .then(res => {
        // alter the schema
        const schema = res.schema;
        schema.stringProp = 'thing-updated';
        return client.data
          .updater()
          .withId(id)
          .withClassName(thingClassName)
          .withSchema(schema)
          .do();
      })
      .then(res => {
        expect(res.schema).toEqual({
          stringProp: 'thing-updated',
        });
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('updates an action', () => {
    const id = '40d2f93a-8f55-4561-8636-7c759f89ef13';
    return client.data
      .getterById()
      .withId(id)
      .withKind(weaviate.KIND_ACTIONS)
      .do()
      .then(res => {
        // alter the schema
        const schema = res.schema;
        schema.stringProp = 'action-updated';
        return client.data
          .updater()
          .withId(id)
          .withClassName(actionClassName)
          .withKind(weaviate.KIND_ACTIONS)
          .withSchema(schema)
          .do();
      })
      .then(res => {
        expect(res.schema).toEqual({
          stringProp: 'action-updated',
        });
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('merges a thing', () => {
    const id = '1565c06c-463f-466c-9092-5930dbac3887';
    return client.data
      .getterById()
      .withId(id)
      .do()
      .then(res => {
        // alter the schema
        const schema = res.schema;
        schema.intProp = 7;
        return client.data
          .merger()
          .withId(id)
          .withKind(weaviate.KIND_THINGS)
          .withClassName(thingClassName)
          .withSchema(schema)
          .do();
      })
      .catch(e => fail('it should not have errord: ' + e));
  });

  it('tears down and cleans up', () => {
    return Promise.all([
      client.schema.deleteClass(actionClassName, weaviate.KIND_ACTIONS),
      client.schema.deleteClass(thingClassName),
    ]);
  });
});

const setup = client => {
  const thing = {
    class: thingClassName,
    properties: [
      {
        name: 'stringProp',
        dataType: ['string'],
      },
      {
        name: 'intProp',
        dataType: ['int'],
      },
    ],
  };

  const action = {
    class: actionClassName,
    properties: [
      {
        name: 'stringProp',
        dataType: ['string'],
      },
      {
        name: 'intProp',
        dataType: ['int'],
      },
    ],
  };

  return Promise.all([
    client.schema.createClass(thing),
    client.schema.createClass(action, weaviate.KIND_ACTIONS),
  ]);
};
