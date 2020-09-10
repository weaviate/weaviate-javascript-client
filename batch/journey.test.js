const weaviate = require('../index');

const className = 'BatchJourneyTest';

describe('batch importing', () => {
  const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
  });

  it('sets up', () => setup(client));

  describe('import objects', () => {
    describe('hand assembling the objects', () => {
      const toImport = [
        {
          class: className,
          id: 'c25365bd-276b-4d88-9d8f-9e924701aa89',
          schema: {stringProp: 'foo'},
        },
        {
          class: className,
          id: 'e0754de5-1458-4814-b21f-382a77b5d64b',
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
          client.data.getterById().withId(toImport[0].id).do(),
          client.data.getterById().withId(toImport[1].id).do(),
        ]).catch(e => fail("it should not have error'd " + e));
      });
    });
  });

  it('tears down and cleans up', () => cleanup(client));
});

const setup = client =>
  client.schema
    .classCreator()
    .withClass({
      class: className,
      properties: [
        {
          name: 'stringProp',
          dataType: ['string'],
        },
        // {
        //   name: 'refProp',
        //   dataType: [className],
        // },
      ],
    })
    .do();

const cleanup = client =>
  client.schema.classDeleter().withClassName(className).do();
