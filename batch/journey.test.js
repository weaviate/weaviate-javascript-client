const weaviate = require('../index');

const thingClassName = 'BatchJourneyTestThing';
const actionClassName = 'BatchJourneyTestAction';

const thingIds = [
  'c25365bd-276b-4d88-9d8f-9e924701aa89',
  'e0754de5-1458-4814-b21f-382a77b5d64b',
  '5c345f46-c3c4-4f42-8ad6-65c6c60840b4',
  '5f4b0aa2-0704-4529-919f-c1f614e685f4',
];

const actionIds = [
  '5b354a0f-fe66-4fe7-ad62-4db72ddab815',
  '8727fa2b-610a-4a5c-af26-e558943f71c7',
];

describe('batch importing', () => {
  const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
  });

  it('sets up', () => setup(client));

  describe('import thing objects', () => {
    describe('hand assembling the objects', () => {
      const toImport = [
        {
          class: thingClassName,
          id: thingIds[0],
          schema: {stringProp: 'foo'},
        },
        {
          class: thingClassName,
          id: thingIds[1],
          schema: {stringProp: 'bar'},
        },
      ];

      it('imports them', () => {
        client.batch
          .objectsBatcher()
          .withObject(toImport[0])
          .withObject(toImport[1])
          .do()
          .then()
          .catch(e => fail("it should not have error'd " + e));
      });

      it('waits for es index refresh', () => {
        return new Promise(resolve => setTimeout(resolve, 1000));
      });

      it('verifies they are now queryable', () => {
        return Promise.all([
          client.data
            .getterById()
            .withKind(weaviate.KIND_THINGS)
            .withId(thingIds[0])
            .do(),
          client.data
            .getterById()
            .withKind(weaviate.KIND_THINGS)
            .withId(thingIds[1])
            .do(),
        ]).catch(e => fail("it should not have error'd " + e));
      });
    });

    describe('using the thing builder to assemble the objects', () => {
      const toImport = [
        client.data
          .creator()
          .withClassName(thingClassName)
          .withId(thingIds[2])
          .withSchema({stringProp: 'foo'})
          .payload(), // note the .payload(), not .do()!
        client.data
          .creator()
          .withClassName(thingClassName)
          .withId(thingIds[3])
          .withSchema({stringProp: 'foo'})
          .payload(), // note the .payload(), not .do()!
      ];

      it('imports them', () => {
        client.batch
          .objectsBatcher()
          .withObject(toImport[0])
          .withObject(toImport[1])
          .do()
          .then()
          .catch(e => fail("it should not have error'd " + e));
      });

      it('waits for es index refresh', () => {
        return new Promise(resolve => setTimeout(resolve, 1000));
      });

      it('verifies they are now queryable', () => {
        return Promise.all([
          client.data
            .getterById()
            .withKind(weaviate.KIND_THINGS)
            .withId(thingIds[2])
            .do(),
          client.data
            .getterById()
            .withKind(weaviate.KIND_THINGS)
            .withId(thingIds[3])
            .do(),
        ]).catch(e => fail("it should not have error'd " + e));
      });
    });
  });

  describe('import action objects', () => {
    describe('hand assembling the objects', () => {
      const toImport = [
        {
          class: actionClassName,
          id: actionIds[0],
          schema: {stringProp: 'foo'},
        },
        {
          class: actionClassName,
          id: actionIds[1],
          schema: {stringProp: 'bar'},
        },
      ];

      it('imports them', () => {
        client.batch
          .objectsBatcher()
          .withKind(weaviate.KIND_ACTIONS)
          .withObject(toImport[0])
          .withObject(toImport[1])
          .do()
          .then()
          .catch(e => fail("it should not have error'd " + e));
      });

      it('waits for es index refresh', () => {
        return new Promise(resolve => setTimeout(resolve, 1000));
      });

      it('verifies they are now queryable', () => {
        return Promise.all([
          client.data
            .getterById()
            .withKind(weaviate.KIND_ACTIONS)
            .withId(toImport[0].id)
            .do(),
          client.data
            .getterById()
            .withKind(weaviate.KIND_ACTIONS)
            .withId(toImport[1].id)
            .do(),
        ]).catch(e => fail("it should not have error'd " + e));
      });
    });
  });

  describe('batch reference between the thing and action objects', () => {
    it('imports the refs with raw objects', () => {
      client.batch
        .referencesBatcher()
        .withReference({
          from:
            `weaviate://localhost/things/${thingClassName}/` +
            `${thingIds[0]}/refProp`,
          to: `weaviate://localhost/actions/${actionIds[0]}`,
        })
        .withReference({
          from:
            `weaviate://localhost/things/${thingClassName}/` +
            `${thingIds[1]}/refProp`,
          to: `weaviate://localhost/actions/${actionIds[1]}`,
        })
        .do()
        .catch(e => fail("it should not have error'd " + e));
    });

    it('imports more refs with a builder pattern', () => {
      client.batch
        .referencesBatcher()
        .withReference(
          client.batch
            .referencePayloadBuilder()
            .withFromKind(weaviate.KIND_THINGS)
            .withFromClassName(thingClassName)
            .withFromRefProp('refProp')
            .withFromId(thingIds[2])
            .withToKind(weaviate.KIND_ACTIONS)
            .withToId(actionIds[0])
            .payload(),
        )
        .withReference(
          client.batch
            .referencePayloadBuilder()
            .withFromKind(weaviate.KIND_THINGS)
            .withFromClassName(thingClassName)
            .withFromRefProp('refProp')
            .withFromId(thingIds[3])
            .withToKind(weaviate.KIND_ACTIONS)
            .withToId(actionIds[1])
            .payload(),
        )
        .do()
        .catch(e => fail("it should not have error'd " + e));
    });

    it('waits for es index refresh', () => {
      return new Promise(resolve => setTimeout(resolve, 1000));
    });

    it('verifies the refs are now set', () => {
      return Promise.all([
        client.data
          .getterById()
          .withKind(weaviate.KIND_THINGS)
          .withId(thingIds[0])
          .do()
          .then(res => {
            expect(res.schema.refProp[0].beacon).toEqual(
              `weaviate://localhost/actions/${actionIds[0]}`,
            );
          }),
        client.data
          .getterById()
          .withKind(weaviate.KIND_THINGS)
          .withId(thingIds[1])
          .do()
          .then(res => {
            expect(res.schema.refProp[0].beacon).toEqual(
              `weaviate://localhost/actions/${actionIds[1]}`,
            );
          }),
        client.data
          .getterById()
          .withKind(weaviate.KIND_THINGS)
          .withId(thingIds[2])
          .do()
          .then(res => {
            expect(res.schema.refProp[0].beacon).toEqual(
              `weaviate://localhost/actions/${actionIds[0]}`,
            );
          }),
        client.data
          .getterById()
          .withKind(weaviate.KIND_THINGS)
          .withId(thingIds[3])
          .do()
          .then(res => {
            expect(res.schema.refProp[0].beacon).toEqual(
              `weaviate://localhost/actions/${actionIds[1]}`,
            );
          }),
      ]).catch(e => fail("it should not have error'd " + e));
    });
  });

  it('tears down and cleans up', () => cleanup(client));
});

const setup = async client => {
  // first import the classes
  await Promise.all([
    client.schema
      .classCreator()
      .withClass({
        class: thingClassName,
        properties: [
          {
            name: 'stringProp',
            dataType: ['string'],
          },
        ],
      })
      .do(),
    client.schema
      .classCreator()
      .withKind(weaviate.KIND_ACTIONS)
      .withClass({
        class: actionClassName,
        properties: [
          {
            name: 'stringProp',
            dataType: ['string'],
          },
        ],
      })
      .do(),
  ]);

  // now set a link from thing to action class, so we can batch import
  // references

  return client.schema
    .propertyCreator()
    .withClassName(thingClassName)
    .withProperty({name: 'refProp', dataType: [actionClassName]})
    .do();
};

//

const cleanup = client =>
  Promise.all([
    client.schema.classDeleter().withClassName(thingClassName).do(),
    client.schema
      .classDeleter()
      .withKind(weaviate.KIND_ACTIONS)
      .withClassName(actionClassName)
      .do(),
  ]);
