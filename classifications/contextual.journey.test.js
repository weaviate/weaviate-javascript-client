const weaviate = require('../index');

const targetDessertId = '9f399d3e-45a4-44f4-b0fd-fa291abfb211';
const targetSavoryId = 'b7a64fbd-7c22-44ac-afbb-8d1432b8061b';
const unclassifiedOneId = '89024ad4-3434-4daa-bfde-a5c6fc4b7f33';
const unclassifiedTwoId = 'afed0b20-bc9a-44c0-84af-09bb6214b3b7';

describe('a classification journey', () => {

  // this journey test is more minimal compared to the kNN one, as a lot of
  // things that are already tested there, don't need to be tested again.

  describe("knn - using the client's wait method", () => {
    const client = weaviate.client({
      scheme: 'http',
      host: 'localhost:8080',
    });

    it('setups the schema and data', () => setup(client));

    let id; // will be assigned by weaviate, see then block in scheduler

    it('triggers a classification without waiting', async () => {
      return client.classifications
        .scheduler()
        .withType('contextual')
        .withClassName('ContextualClassificationJourneySource')
        .withClassifyProperties(['toTarget'])
        .withBasedOnProperties(['description'])
        .withWaitForCompletion()
        .withWaitTimeout(60 * 1000)
        .do()
        .then(res => {
          expect(res.status).toEqual('completed');
          expect(res.type).toEqual('contextual');
          id = res.id;
        })
        .catch(e => fail('it should not have errord: ' + e));
    });

    it('tears down and cleans up', () => cleanup(client));
  });

});

const setup = async client => {
  targetClass = {
    class: 'ContextualClassificationJourneyTarget',
    properties: [
      {
        name: 'name',
        dataType: ['string'],
      },
    ],
  };

  await client.schema.classCreator().withClass(targetClass).do();

  targetClass = {
    class: 'ContextualClassificationJourneySource',
    properties: [
      {
        name: 'description',
        dataType: ['text'],
      },
      {
        name: 'toTarget',
        dataType: ['ContextualClassificationJourneyTarget'],
      },
    ],
  };

  await client.schema.classCreator().withClass(targetClass).do();

  // import targets
  await Promise.all([
    client.data
      .creator()
      .withClassName('ContextualClassificationJourneyTarget')
      .withSchema({name: 'Dessert'})
      .withId(targetDessertId)
      .do(),
    client.data
      .creator()
      .withClassName('ContextualClassificationJourneyTarget')
      .withSchema({name: 'Savory'})
      .withId(targetSavoryId)
      .do(),
  ]);

  // import to-be-classifieds
  await Promise.all([
    client.data
      .creator()
      .withId(unclassifiedOneId)
      .withClassName('ContextualClassificationJourneySource')
      .withSchema({
        description: 'This sweet cake contains sugar.',
      })
      .do(),
    client.data
      .creator()
      .withId(unclassifiedTwoId)
      .withClassName('ContextualClassificationJourneySource')
      .withSchema({
        description: 'Potatoes and fried fish',
      })
      .do(),
  ]);

  // wait for elasticsearch index refresh
  // TODO: remove in 1.0.0

  await new Promise(resolve => setTimeout(resolve, 1000));
};

const cleanup = client => {
  return Promise.all([
    client.schema
      .classDeleter()
      .withClassName('ContextualClassificationJourneySource')
      .do(),
    client.schema
      .classDeleter()
      .withClassName('ContextualClassificationJourneyTarget')
      .do(),
  ]);
};

const beaconTo = target => `weaviate://localhost/things/${target}`;
